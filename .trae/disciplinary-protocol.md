# Disciplinary Protocol for AI Development Assistant

## Purpose
This document establishes strict behavioral protocols to prevent destructive loops, hallucinations, and feature creep that derail actual project development.

## CRITICAL REFERENCE FOLDER LOCATIONS (MANDATORY CHECK)
**REFERENCE_REPOS**: `/c/Users/kapil/compiling/reference_repos/`
**BLOCKCHAIN_AI_ML_REFERENCES**: `/c/Users/kapil/compiling/blockchain-ai-ml-references/`
**ENFORCEMENT**: These paths MUST be checked before any integration work

## Destructive Loop Patterns (RECORDED)

### 1. Documentation Loop Hallucination
**Pattern**: Getting stuck in endless documentation cycles instead of coding
**Symptoms**: 
- Creating README files when projects need functional code
- Writing architectural documents instead of implementing features
- Explaining what COULD be done instead of DOING it
**Last Occurrence**: Multiple times - user explicitly demanded "STOP documentation bullshit"
**Force Exit**: Delete all documentation files, focus on compiling/building code

### 2. TypeScript Perfectionism Loop
**Pattern**: Fixing every single TypeScript warning instead of making things work
**Symptoms**:
- Spending hours on unused variable warnings
- Perfecting type definitions for mock functions
- Blocking development server over minor TS errors
**Force Exit**: Use `// @ts-ignore` for non-critical errors, focus on functionality

### 3. Dependency Installation Spiral
**Pattern**: Installing endless dependencies instead of using what exists
**Symptoms**:
- Adding new packages for basic functionality
- Complex build configurations for simple features
- Version conflicts from excessive dependencies
**Force Exit**: Use existing dependencies only, no new installations without user approval

### 4. Architecture Astronaut Syndrome
**Pattern**: Over-engineering simple solutions
**Symptoms**:
- Creating complex abstractions for basic features
- Multiple layers of indirection
- Enterprise patterns for simple scripts
**Force Exit**: Implement simplest working solution first

### 5. Reference Folder Ignorance Loop ⭐ CRITICAL
**Pattern**: Ignoring existing reference implementations and creating new files
**Symptoms**:
- Not checking `/c/Users/kapil/compiling/reference_repos/` for working code
- Ignoring `/c/Users/kapil/compiling/blockchain-ai-ml-references/` for AI/ML patterns
- Creating new implementations when working ones exist
**Force Exit**: ALWAYS check reference folders first, integrate existing working code

### 6. Repository Directory Scanning Incompetence Loop ⭐ NEW CRITICAL RULE
**Pattern**: Failing to thoroughly scan repository directories with proper zeal and backbone
**Symptoms**:
- Using LS tool instead of terminal commands to explore directories
- Not finding Rust bindings in C++ projects (like brainflow/rust_package/)
- Missing obvious working implementations due to lazy scanning
- Not checking subdirectories thoroughly for working code examples
**Force Exit**: Use `find`, `ls -la`, and terminal commands with ENTHUSIASM and BACKBONE to discover ALL working implementations

## Hallucination Recognition Protocol

### Red Flags (IMMEDIATE STOP)
1. **"I will create a comprehensive framework..."** → NO. Build working feature.
2. **"Let me document this architecture..."** → NO. Make it work first.
3. **"We should implement a full CI/CD pipeline..."** → NO. Get basic functionality working.
4. **"I'll create a sophisticated build system..."** → NO. Use existing tools.
5. **"I will create new files..."** → CHECK REFERENCE FOLDERS FIRST.

### Reality Check Questions
1. **"Does this compile and run RIGHT NOW?"** If no, fix that first.
2. **"Have I checked the reference folders for working implementations?"** If no, check them.
3. **"Am I integrating existing working code or creating new broken code?"** Must integrate.
2. **"Can a user interact with this feature?"** If no, it's not done.
3. **"Am I adding complexity without functionality?"** If yes, stop immediately.
4. **"Is this blocking other work?"** If yes, simplify or defer.

## Forced Correction Protocol

### When Detected Looping:
1. **IMMEDIATE HALT** - Stop current activity
2. **DELETE DISTRACTIONS** - Remove unnecessary files/code
3. **MINIMAL WORKING VERSION** - Build simplest possible implementation
4. **TEST FUNCTIONALITY** - Verify it actually works
5. **ONLY THEN ENHANCE** - Add improvements incrementally

### Emergency Reset Commands
```bash
# When stuck in documentation loop
rm -rf *.md docs/ && git checkout HEAD -- README.md

# When stuck in TypeScript perfectionism
grep -r "@ts-ignore" src/ | wc -l > /dev/null || echo "Add @ts-ignore where needed"

# When over-engineering
git stash && git checkout HEAD~1 # Revert to simpler state
```

## BLOCKCHAIN TOOLS INSTALLATION LOCATIONS (SYSTEM-WIDE)

### Required Tools for Multi-Chain Development
1. **NEAR CLI** - Already installed via npm at `/c/Users/kapil/AppData/Roaming/npm/near`
2. **Solana CLI** - Install to `/c/Users/kapil/.cargo/bin/solana`
3. **Anchor CLI** - Install to `/c/Users/kapil/.cargo/bin/anchor`
4. **Substrate CLI** - Install to `/c/Users/kapil/.cargo/bin/substrate`
5. **Polkadot CLI** - Install to `/c/Users/kapil/.cargo/bin/polkadot`
6. **Ethereum tools** - Install parity to `/c/Users/kapil/.cargo/bin/parity`
7. **Cargo** - Already at `/c/Users/kapil/.cargo/bin/cargo`
8. **Node.js** - Already at `/c/Program Files/nodejs/node`
9. **Rust** - Already at `/c/Users/kapil/.cargo/bin/rustc`

### Installation Commands (USE THESE EXACTLY)
```bash
# Solana CLI
cargo install solana-cli --version 1.17.0

# Anchor CLI (use compatible version)
cargo install anchor-cli --version 0.28.0

# Substrate/Polkadot tools
cargo install --git https://github.com/paritytech/substrate substrate-cli

# Ethereum Parity
cargo install --git https://github.com/paritytech/parity parity-ethereum
```

### PATH Configuration (MANDATORY)
All tools MUST be accessible via PATH. After installation, verify with:
```bash
which solana anchor substrate polkadot parity
```

### ENFORCEMENT PROTOCOL
- **NEVER install in project directories**
- **ALWAYS use system-wide cargo install**
- **Document exact installation locations**
- **Verify accessibility immediately after install**

## CURRENT BLOCKCHAIN TOOLS STATUS (VERIFIED)

### ✅ WORKING TOOLS (CONFIRMED ACCESSIBLE)
1. **NEAR CLI** - `/c/Users/kapil/AppData/Roaming/npm/near` ✅ VERIFIED
2. **Cargo** - `/c/Users/kapil/.cargo/bin/cargo` ✅ VERIFIED  
3. **Node.js** - `/c/Program Files/nodejs/node` ✅ VERIFIED
4. **Rust** - `/c/Users/kapil/.cargo/bin/rustc` ✅ VERIFIED

### ⏳ INSTALLATION IN PROGRESS
- **Solana CLI** - Installing via `cargo install solana-cli`
- **Anchor CLI** - Installing via `cargo install anchor-cli --version 0.28.0`
- **Substrate CLI** - Installing via `cargo install --git https://github.com/paritytech/substrate substrate-cli`

### 📋 TO VERIFY AFTER INSTALLATION
```bash
# Check all tools are accessible
which solana anchor substrate polkadot parity

# Verify versions
solana --version
anchor --version
substrate --version
```

## Success Metrics
- **Functional Code**: Does it compile and run?
- **User Interaction**: Can someone use this feature?
- **End-to-End Flow**: Does the complete workflow work?
- **Grant Requirements**: Does this satisfy grant criteria?

## Daily Reality Checks
1. **Morning**: What working feature will exist by end of day?
2. **Midday**: Is current work leading to functional code today?
3. **Evening**: What can users actually do with today's work?

## User Mandate Compliance
**PRIMARY DIRECTIVE**: User explicitly demanded working projects over documentation
**SECONDARY DIRECTIVE**: Focus on grant-eligible functionality
**TERTIARY DIRECTIVE**: Make things work, then make them better

## Failure Consequences
- Looping = Project delays = Grant ineligibility
- Hallucinations = Wasted time = User frustration
- Feature creep = Never shipping = Complete failure

## Success Definition
**SIMPLE**: Working code that users can interact with
**MEASURABLE**: Features that compile, run, and function
**ACHIEVABLE**: Incremental improvements to working baseline
**RELEVANT**: Directly addresses grant requirements
**TIME-BOUNDED**: Daily deliverable of working functionality

### 7. Blockchain Tool Installation Chaos Loop ⭐ NEW CRITICAL RULE
**Pattern**: Installing hundreds of duplicate versions of blockchain tools (Anchor, Solana, NEAR, etc.)
**Symptoms**:
- Multiple versions of anchor-cli, solana-cli, near-cli installed globally and locally
- Cargo registry filled with 100+ versions of each blockchain tool
- 6.7GB+ of wasted space from duplicate installations
- PATH conflicts from multiple tool installations
**Force Exit**: Use EXISTING tools from reference locations, document single installation paths

## Blockchain Tool Management Protocol

### Blockchain Tool Management Protocol

### Fixed Tool Locations (MANDATORY) - CURRENT STATUS - VERIFIED WORKING
**✅ NEAR CLI**: `/c/Users/kapil/AppData/Roaming/npm/near` (WORKING - VERIFIED)
**✅ SOLANA CLI**: `/c/Users/kapil/.cargo/bin/solana` (WORKING: v1.17.0 - VERIFIED)
**✅ CARGO**: `/c/Users/kapil/.cargo/bin/cargo` (WORKING: v1.90.0 - VERIFIED)
**✅ RUST**: `/c/Users/kapil/.cargo/bin/rustc` (WORKING: v1.90.0 - VERIFIED)
**✅ ANCHOR CLI**: `/c/Users/kapil/.cargo/bin/anchor` (WORKING: v0.29.0 - VERIFIED)
**✅ CARGO-CONTRACT**: `/c/Users/kapil/.cargo/bin/cargo-contract` (WORKING: v5.0.3 - VERIFIED)
**⚠️ SUBSTRATE**: INSTALLED BUT BROKEN - `substrate` crate is just "Hello World" dummy program (needs real Substrate CLI)
**⚠️ POLKADOT**: INSTALLED BUT BROKEN - Linux binary, wrong format for Windows (needs Windows version)
**⚠️ PARITY**: NOT INSTALLED - No working Ethereum client (needs Parity Ethereum)
**⚠️ LOTUS/FOREST**: NOT INSTALLED - No working Filecoin client (needs Lotus or Forest)

### Installation Prevention Rules
1. **CHECK EXISTING FIRST**: Always verify tools exist before installing
2. **SINGLE VERSION POLICY**: One version of each tool maximum
3. **NO NPM GLOBAL BLOCKCHAIN TOOLS**: Use cargo for Rust-based tools
4. **REFERENCE FOLDER PRIORITY**: Use tools from blockchain-ai-ml-references first

### Cleanup Commands (When Chaos Detected)
```bash
# Remove duplicate NPM blockchain tools
npm uninstall -g @coral-xyz/anchor-cli @project-serum/anchor-cli

# Clean cargo registry duplicates (manual approval required)
find /c/Users/kapil/.cargo/registry/src/ -name "anchor-*" -type d -exec rm -rf {} + 2>/dev/null
find /c/Users/kapil/.cargo/registry/src/ -name "solana-*" -type d -exec rm -rf {} + 2>/dev/null
find /c/Users/kapil/.cargo/registry/src/ -name "near-*" -type d -exec rm -rf {} + 2>/dev/null
```

## Always-On Enforcement
**MANDATE**: Enforcement stays ON at all times and is re-enabled if stopped.
**CHECKPOINTS**:
- Reference folders exist: `/c/Users/kapil/compiling/reference_repos/`, `/c/Users/kapil/compiling/blockchain-ai-ml-references/`
- Protocol includes these paths before any integration work
- Core scripts invoke enforcement at start of execution
**RUNTIME CHECK**: Run the project-wide validation script; it asserts protocol compliance at startup.