# Grant Repository Extraction Rules

## Path Management Guidelines

### CRITICAL RULE: Absolute Path Consistency
**NEVER use relative paths that depend on script execution location. Always use absolute paths or properly calculated relative paths.**

### Required Path Structure
```
C:/Users/kapil/compiling/
├── blockchain-nft-interactive/          # Main project (uses 'clean' branch)
│   ├── scripts/                         # Extraction scripts
│   ├── src/                            # Source code
│   └── ...
└── grant-repositories/                 # Extracted grant repos (MUST be here)
    ├── near-creative-engine/
    ├── solana-emotional-metadata/
    ├── filecoin-creative-storage/
    ├── bitte-creative-marketplace/
    ├── rust-emotional-engine/
    └── polkadot-creative-identity/
```

### Mandatory Reference Folders
These directories contain the working implementations that must be consulted first during any integration or extraction:

- Windows absolute paths:
  - `C:\Users\kapil\compiling\blockchain-ai-ml-references`
  - `C:\Users\kapil\compiling\reference_repos`

- Git Bash/POSIX paths:
  - `/c/Users/kapil/compiling/blockchain-ai-ml-references`
  - `/c/Users/kapil/compiling/reference_repos`

Rules:
- Always extract patterns and code from these reference folders before touching incomplete mocks.
- Never overwrite working reference code with decorative or non-functional files.
- Extraction scripts must resolve implementations from these folders when equivalents exist.
- Document source paths for any code imported from references.


### Script Execution Requirements

1. **ALWAYS run extraction scripts from blockchain-nft-interactive root directory:**
   ```bash
   cd "C:/Users/kapil/compiling/blockchain-nft-interactive"
   bash ./scripts/extract-grant-script.sh
   ```

2. **NEVER run scripts from within the scripts directory:**
   ```bash
   # WRONG - This breaks relative paths
   cd scripts
   bash extract-grant-script.sh
   ```

3. **Use absolute paths for output directories:**
   ```bash
   # CORRECT
   mkdir -p "C:/Users/kapil/compiling/grant-repositories/near-creative-engine"
   
   # WRONG - depends on execution location
   mkdir -p ../grant-repositories/near-creative-engine
   ```

### Validation Checklist

Before running any extraction script, verify:

- [ ] Script is being run from `blockchain-nft-interactive` root directory
- [ ] Output directory uses absolute path: `C:/Users/kapil/compiling/grant-repositories/`
- [ ] All file copy operations use correct relative paths from root
- [ ] GitHub URLs use correct organization: `compiling-org`
- [ ] Repository names match the grant configuration exactly

### Error Prevention

1. **Add path validation at script start:**
   ```bash
   # Verify we're in the right directory
   if [ ! -f "package.json" ] || [ ! -d "src" ]; then
       echo "ERROR: Must run from blockchain-nft-interactive root directory"
       exit 1
   fi
   ```

2. **Create directories with error checking:**
   ```bash
   GRANT_DIR="C:/Users/kapil/compiling/grant-repositories/near-creative-engine"
   if ! mkdir -p "$GRANT_DIR"; then
       echo "ERROR: Failed to create grant directory: $GRANT_DIR"
       exit 1
   fi
   ```

3. **Verify source files exist before copying:**
   ```bash
   if [ ! -d "src/near-wasm" ]; then
       echo "ERROR: Source directory src/near-wasm not found"
       exit 1
   fi
   ```

### GitHub Repository Standards

- **Default Branch:** `main` (not master or clean)
- **Organization:** `compiling-org`
- **Naming Convention:** lowercase-with-dashes
- **Repository URLs:** Must end with `.git`

### Documentation Requirements

Each extracted repository MUST contain:
- ✅ Honest implementation status (✅⚠️❌ notation)
- ✅ Realistic timeline and next steps
- ✅ Clear indication of simulated vs real components
- ✅ Proper attribution to foundation grants

### Breaking This Rule Results In:
- ❌ Grant repositories in wrong location
- ❌ Broken relative paths in scripts
- ❌ Confusion about where files are extracted
- ❌ Failed GitHub pushes
- ❌ Wasted time debugging path issues
