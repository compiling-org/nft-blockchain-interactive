// Simple Node System for WGSL Studio

class NodeEditor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.draggingNode = null;
        this.dragOffset = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        // Create canvas for node editor
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        
        // Add event listeners
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('dblclick', (e) => this.onDoubleClick(e));
        
        // Initial nodes
        this.createInitialNodes();
        
        // Start render loop
        this.render();
    }
    
    createInitialNodes() {
        // Create input node
        this.createNode('Input', 100, 100, [
            { name: 'time', type: 'float', direction: 'output' },
            { name: 'resolution', type: 'vec2', direction: 'output' },
            { name: 'mouse', type: 'vec2', direction: 'output' }
        ]);
        
        // Create math node
        this.createNode('Math', 300, 150, [
            { name: 'a', type: 'float', direction: 'input' },
            { name: 'b', type: 'float', direction: 'input' },
            { name: 'result', type: 'float', direction: 'output' }
        ]);
        
        // Create output node
        this.createNode('Output', 500, 100, [
            { name: 'color', type: 'vec3', direction: 'input' }
        ]);
    }
    
    createNode(name, x, y, ports) {
        const node = {
            id: Date.now() + Math.random(),
            name: name,
            x: x,
            y: y,
            width: 150,
            height: 40 + ports.length * 25,
            ports: ports,
            selected: false
        };
        
        this.nodes.push(node);
        return node;
    }
    
    getNodeAt(x, y) {
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            const node = this.nodes[i];
            if (x >= node.x && x <= node.x + node.width &&
                y >= node.y && y <= node.y + node.height) {
                return node;
            }
        }
        return null;
    }
    
    getPortAt(x, y) {
        for (const node of this.nodes) {
            for (const port of node.ports) {
                const portX = port.direction === 'input' ? node.x : node.x + node.width;
                const portY = node.y + 30 + node.ports.indexOf(port) * 25 + 12;
                const distance = Math.sqrt((x - portX) ** 2 + (y - portY) ** 2);
                if (distance < 8) {
                    return { node, port };
                }
            }
        }
        return null;
    }
    
    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if clicking on a port
        const port = this.getPortAt(x, y);
        if (port) {
            this.draggingConnection = { start: port };
            return;
        }
        
        // Check if clicking on a node
        const node = this.getNodeAt(x, y);
        if (node) {
            this.draggingNode = node;
            this.dragOffset = { x: x - node.x, y: y - node.y };
            node.selected = true;
            this.selectedNode = node;
        } else {
            // Deselect all nodes
            this.nodes.forEach(n => n.selected = false);
            this.selectedNode = null;
        }
    }
    
    onMouseMove(e) {
        if (!this.draggingNode && !this.draggingConnection) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.draggingNode) {
            this.draggingNode.x = x - this.dragOffset.x;
            this.draggingNode.y = y - this.dragOffset.y;
        }
    }
    
    onMouseUp(e) {
        if (this.draggingConnection) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const endPort = this.getPortAt(x, y);
            if (endPort && endPort.node !== this.draggingConnection.start.node) {
                // Create connection
                this.connections.push({
                    from: this.draggingConnection.start,
                    to: endPort
                });
            }
            
            this.draggingConnection = null;
        }
        
        this.draggingNode = null;
    }
    
    onDoubleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const node = this.getNodeAt(x, y);
        if (node) {
            // Show node properties dialog
            this.showNodeProperties(node);
        }
    }
    
    showNodeProperties(node) {
        // Create a simple properties dialog
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.left = '50%';
        dialog.style.top = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '10px';
        dialog.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        dialog.style.zIndex = '1000';
        dialog.innerHTML = `
            <h3>${node.name} Properties</h3>
            <p>Position: ${Math.round(node.x)}, ${Math.round(node.y)}</p>
            <button onclick="this.parentElement.remove()">Close</button>
        `;
        document.body.appendChild(dialog);
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw connections
        this.drawConnections();
        
        // Draw nodes
        this.drawNodes();
        
        // Draw temporary connection if dragging
        if (this.draggingConnection) {
            this.drawTemporaryConnection();
        }
        
        // Continue render loop
        requestAnimationFrame(() => this.render());
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#f0f0f0';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawConnections() {
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 2;
        
        for (const connection of this.connections) {
            const fromNode = connection.from.node;
            const fromPort = connection.from.port;
            const toNode = connection.to.node;
            const toPort = connection.to.port;
            
            const fromX = fromNode.x + fromNode.width;
            const fromY = fromNode.y + 30 + fromNode.ports.indexOf(fromPort) * 25 + 12;
            const toX = toNode.x;
            const toY = toNode.y + 30 + toNode.ports.indexOf(toPort) * 25 + 12;
            
            this.ctx.beginPath();
            this.ctx.moveTo(fromX, fromY);
            this.ctx.bezierCurveTo(
                fromX + 100, fromY,
                toX - 100, toY,
                toX, toY
            );
            this.ctx.stroke();
        }
    }
    
    drawTemporaryConnection() {
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = rect.left + (this.draggingConnection.mouseX || 0);
        const mouseY = rect.top + (this.draggingConnection.mouseY || 0);
        
        const fromNode = this.draggingConnection.start.node;
        const fromPort = this.draggingConnection.start.port;
        const fromX = fromNode.x + fromNode.width;
        const fromY = fromNode.y + 30 + fromNode.ports.indexOf(fromPort) * 25 + 12;
        
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(mouseX, mouseY);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }
    
    drawNodes() {
        for (const node of this.nodes) {
            // Node background
            this.ctx.fillStyle = node.selected ? '#e0e7ff' : '#f8fafc';
            this.ctx.strokeStyle = node.selected ? '#667eea' : '#cbd5e1';
            this.ctx.lineWidth = 2;
            this.ctx.fillRect(node.x, node.y, node.width, node.height);
            this.ctx.strokeRect(node.x, node.y, node.width, node.height);
            
            // Node title
            this.ctx.fillStyle = '#1e293b';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.fillText(node.name, node.x + 10, node.y + 20);
            
            // Ports
            this.ctx.fillStyle = '#64748b';
            this.ctx.font = '12px Arial';
            
            for (let i = 0; i < node.ports.length; i++) {
                const port = node.ports[i];
                const portY = node.y + 30 + i * 25;
                
                // Port circle
                this.ctx.beginPath();
                const portX = port.direction === 'input' ? node.x : node.x + node.width;
                this.ctx.arc(portX, portY + 12, 6, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Port label
                this.ctx.fillStyle = '#1e293b';
                if (port.direction === 'input') {
                    this.ctx.fillText(port.name, node.x + 15, portY + 16);
                } else {
                    const textWidth = this.ctx.measureText(port.name).width;
                    this.ctx.fillText(port.name, node.x + node.width - textWidth - 15, portY + 16);
                }
                this.ctx.fillStyle = '#64748b';
            }
        }
    }
}

// Initialize node editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have a container for the node editor
    const container = document.getElementById('node-editor-container');
    if (container) {
        window.nodeEditor = new NodeEditor('node-editor-container');
    }
});