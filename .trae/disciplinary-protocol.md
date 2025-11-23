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

## Always-On Enforcement
**MANDATE**: Enforcement stays ON at all times and is re-enabled if stopped.
**CHECKPOINTS**:
- Reference folders exist: `/c/Users/kapil/compiling/reference_repos/`, `/c/Users/kapil/compiling/blockchain-ai-ml-references/`
- Protocol includes these paths before any integration work
- Core scripts invoke enforcement at start of execution
**RUNTIME CHECK**: Run the project-wide validation script; it asserts protocol compliance at startup.