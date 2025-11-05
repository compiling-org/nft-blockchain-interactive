const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if we're running in a GitHub Actions environment
const isGitHubActions = !!process.env.GITHUB_ACTIONS;

// Load project configuration
let config = {
  "projectUrl": "https://github.com/compiling-org/nft-blockchain-interactive/projects/7",
  "projectId": "7",
  "organization": "compiling-org",
  "repo": "nft-blockchain-interactive",
  "autoAddToProject": true,
  "defaultLabels": ["automated-task"],
  "statusMapping": {
    "To Do": "Todo",
    "In Progress": "In Progress",
    "Done": "Done"
  }
};

// Try to load from file if it exists
try {
  const configPath = path.join(process.env.GITHUB_WORKSPACE || '.', '.github', 'project-config.json');
  if (fs.existsSync(configPath)) {
    config = {...config, ...JSON.parse(fs.readFileSync(configPath, 'utf8'))};
  }
} catch (error) {
  console.log("Using default configuration");
}

// Function to run shell commands
function runCommand(command) {
  // If not in GitHub Actions, just log the command
  if (!isGitHubActions) {
    console.log(`[DRY RUN] Would run: ${command}`);
    return null;
  }
  
  try {
    const output = execSync(command, { encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Read the CSV file
const csvFilePath = path.join(process.env.GITHUB_WORKSPACE || '.', 'PROJECT_TASKS.csv');
const csvData = fs.readFileSync(csvFilePath, 'utf8');

// Parse CSV data (simple implementation)
const lines = csvData.trim().split('\n');
const headers = lines[0].split(',');

console.log(`Found ${lines.length - 1} tasks to process`);

let createdIssues = 0;
let existingIssues = 0;

// Process each task
for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',');
  
  // Skip if not enough values
  if (values.length < 5) continue;
  
  const task = {
    title: values[0].trim().replace(/"/g, '\\"'),
    category: values[1].trim(),
    phase: values[2].trim(),
    status: values[3].trim(),
    module: values[4].trim()
  };

  // Skip empty tasks
  if (!task.title || task.title === '') continue;

  // Check if issue already exists (only in GitHub Actions)
  let issueExists = false;
  if (isGitHubActions) {
    const searchCommand = `gh issue list --search "${task.title}" --state all --limit 1`;
    const searchResult = runCommand(searchCommand);
    
    if (searchResult && searchResult.includes(task.title)) {
      console.log(`Issue already exists: ${task.title}`);
      existingIssues++;
      issueExists = true;
    }
  }

  // Skip if issue exists
  if (issueExists) continue;

  // Create labels
  const labels = [...config.defaultLabels];
  if (task.category) labels.push(`category:${task.category}`);
  if (task.phase && task.phase !== '') labels.push(`phase:${task.phase}`);
  if (task.module && task.module !== '') labels.push(`module:${task.module}`);
  if (task.status && task.status !== '') labels.push(`status:${task.status}`);

  // Create the issue
  const labelString = labels.join(',');
  
  console.log(`Creating issue: ${task.title}`);
  
  // Create the issue using GitHub CLI (only in GitHub Actions)
  if (isGitHubActions) {
    let createCommand = `gh issue create --title "${task.title}" --body "Task automatically generated from PROJECT_TASKS.csv\\n\\nCategory: ${task.category}\\nPhase: ${task.phase}\\nModule: ${task.module}\\nStatus: ${task.status}"`;
    
    if (labelString) {
      createCommand += ` --label "${labelString}"`;
    }
    
    const result = runCommand(createCommand);
    if (result) {
      console.log(`Created issue: ${result}`);
      createdIssues++;
      
      // Extract issue number from the URL
      const issueNumber = result.split('/').pop();
      
      // Add to project board if configured
      if (config.autoAddToProject && config.projectId) {
        try {
          // First, we need to get the project ID using the GitHub API
          // For now, we'll use a placeholder command
          console.log(`Would add issue #${issueNumber} to project #${config.projectId}`);
          
          // When you have the proper project ID, you can uncomment this:
          // const projectCommand = `gh issue edit ${issueNumber} --add-project "${config.organization}/${config.projectId}"`;
          // runCommand(projectCommand);
        } catch (error) {
          console.error(`Failed to add issue to project: ${error.message}`);
        }
      }
    }
  } else {
    console.log(`[DRY RUN] Would create issue with labels: ${labelString}`);
    createdIssues++;
  }
}

console.log(`Successfully processed ${createdIssues} tasks`);
if (isGitHubActions) {
  console.log(`${existingIssues} issues already existed`);
}
console.log(`Total tasks processed: ${lines.length - 1}`);