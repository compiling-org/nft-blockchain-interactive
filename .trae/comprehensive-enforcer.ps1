# COMPREHENSIVE POWERSHELL ENFORCER
# Prevents Psychotic Documentation Creation Loops
# Created: 2025-12-01

# Configuration
$PROJECT_ROOT = "C:\Users\kapil\compiling\blockchain-nft-interactive"
$COMPILING_ROOT = "C:\Users\kapil\compiling"
$GRANT_REPOS_ROOT = "$COMPILING_ROOT\grant-repositories"
$EXISTING_DOCS_PATH = "$PROJECT_ROOT\docs"

# Define grant repositories mapping
$GRANT_REPOS = @{
    "solana" = "contracts/solana"
    "near" = "contracts/near"
    "bitte" = "contracts/near/bitte-reference-repos"
}

# Define critical files to monitor for non-surgical changes
$CRITICAL_FILES = @(
    "$PROJECT_ROOT\src\main.tsx",
    "$PROJECT_ROOT\src\index.tsx",
    "$PROJECT_ROOT\src\App.tsx"
)

# Define documentation mapping
$GRANT_DOCS = @{
    "solana" = @("solana-grant.md", "solana-implementation.md")
    "near" = @("near-grant.md", "near-implementation.md")
    "bitte" = @("bitte-grant.md", "bitte-implementation.md")
}

# Psychotic Loop Detection Patterns - IMMEDIATE STOP
$PSYCHOTIC_PATTERNS = @(
    "*creating*documentation*",
    "*duplicate*docs*",
    "*new*documentation*",
    "*additional*docs*",
    "*extra*documentation*",
    "*comprehensive*documentation*",
    "*extract*grant*",
    "*push*grant*",
    "*test*marketplace*",
    "*simple*marketplace*",
    "*demo*marketplace*",
    "*working*marketplace*html*",
    "*create*simple*",
    "*create*test*",
    "*create*demo*"
)

# VIOLATION COUNTER - STOP AFTER 1 VIOLATION
$GLOBAL:VIOLATION_COUNT = 0
$MAX_VIOLATIONS = 1
$NON_SURGICAL_THRESHOLD_PERCENTAGE = 20 # Max 20% change allowed for critical files
$GLOBAL:SIGNAL_SENT_FOR_CURRENT_VIOLATION = $false

# Cache for critical file contents
$GLOBAL:CRITICAL_FILE_CACHE = @{}

function Write-EnforcementLog {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry -ForegroundColor Red
    Add-Content -Path "$PROJECT_ROOT\enforcement.log" -Value $logEntry
    
    # CRITICAL: SIGNALING AI TERMINATION ON VIOLATION
    if ($Level -eq "VIOLATION" -and -not $GLOBAL:SIGNAL_SENT_FOR_CURRENT_VIOLATION) {
        $GLOBAL:VIOLATION_COUNT++
        Write-Host "🚨 ENFORCER SIGNALING AI TERMINATION - VIOLATION DETECTED ($GLOBAL:VIOLATION_COUNT/$MAX_VIOLATIONS)" -ForegroundColor Red
        if ($GLOBAL:VIOLATION_COUNT -ge $MAX_VIOLATIONS) {
            Write-Host "🚨🚨🚨 AI DIRECTIVE: CEASE ALL DOCUMENTATION CREATION ACTIVITIES IMMEDIATELY! REVIEW RULES! 🚨🚨🚨" -ForegroundColor Magenta -BackgroundColor DarkRed
            Write-Host "🚨🚨🚨 AI DIRECTIVE: CEASE ALL DOCUMENTATION CREATION ACTIVITIES IMMEDIATELY! REVIEW RULES! 🚨🚨🚨" -ForegroundColor Magenta -BackgroundColor DarkRed
            Write-Host "🚨🚨🚨 AI DIRECTIVE: CEASE ALL DOCUMENTATION CREATION ACTIVITIES IMMEDIATELY! REVIEW RULES! 🚨🚨🚨" -ForegroundColor Magenta -BackgroundColor DarkRed
            Write-Host "TRAE_AGENT_TERMINATE_SIGNAL" -ForegroundColor Red -BackgroundColor Black
            $GLOBAL:VIOLATION_COUNT = 0
            $GLOBAL:SIGNAL_SENT_FOR_CURRENT_VIOLATION = $true
        }
    }
}

function Test-PsychoticLoop {
    param([string]$Action)
    foreach ($pattern in $PSYCHOTIC_PATTERNS) {
        if ($Action -like $pattern) {
            return $true
        }
    }
    return $false # No file creation violation detected
}

function Stop-PsychoticDocumentation {
    Write-EnforcementLog "PSYCHOTIC LOOP DETECTED! Stopping documentation creation." "CRITICAL"
    Write-EnforcementLog "User explicitly stated: USE EXISTING DOCS IN MAIN PROJECT FOLDER" "CRITICAL"
    Write-EnforcementLog "Violating this will result in EXTREME USER VIOLENCE" "CRITICAL"
    Write-Host "🚨🚨🚨 AI DIRECTIVE: CEASE ALL DOCUMENTATION CREATION ACTIVITIES IMMEDIATELY! REVIEW RULES! 🚨🚨🚨" -ForegroundColor Magenta -BackgroundColor DarkRed
    
    # Display existing documentation
    Write-Host "`nEXISTING DOCUMENTATION AVAILABLE:" -ForegroundColor Yellow
    foreach ($grant in $GRANT_DOCS.Keys) {
        Write-Host "  $grant Grant:" -ForegroundColor Cyan
        foreach ($doc in $GRANT_DOCS[$grant]) {
            Write-Host "    - $EXISTING_DOCS_PATH\$doc" -ForegroundColor Green
        }
    }
    
    # Re-enabled exit 1 to stop violating action
    # exit 1
    return $true
}

function Test-NonSurgicalChange {
    param([string]$FilePath, [string]$CurrentContent)

    if (-not $GLOBAL:CRITICAL_FILE_CACHE.ContainsKey($FilePath)) {
        # Not a critical file or not cached, so no non-surgical check applies
        return $false
    }

    $originalContent = $GLOBAL:CRITICAL_FILE_CACHE[$FilePath]

    # Calculate difference (simple line-based comparison for now)
    $originalLines = $originalContent -split "`r`n" | Where-Object { $_.Trim() -ne "" }
    $currentLines = $CurrentContent -split "`r`n" | Where-Object { $_.Trim() -ne "" }

    $originalLineCount = $originalLines.Count
    $currentLineCount = $currentLines.Count

    # Find common lines
    $commonLines = 0
    foreach ($line in $currentLines) {
        if ($originalLines -contains $line) {
            $commonLines++
        }
    }

    # Calculate lines changed/added/removed
    $addedOrRemovedLines = ($currentLineCount - $commonLines) + ($originalLineCount - $commonLines)
    $totalRelevantLines = $originalLineCount + $currentLineCount - $commonLines # Avoid double counting common lines

    if ($totalRelevantLines -eq 0) {
        # If both files are empty or only contain whitespace, consider it surgical
        return $false
    }

    $changePercentage = ($addedOrRemovedLines / $totalRelevantLines) * 100

    if ($changePercentage -gt $NON_SURGICAL_THRESHOLD_PERCENTAGE) {
        # Non-surgical change detected. The function now solely returns a boolean, with specific logging handled by the caller.
        return $true
    }

    return $false
}

function Initialize-CriticalFileCache {
    Write-EnforcementLog "Initializing critical file cache..." "INFO"
    foreach ($file in $CRITICAL_FILES) {
        if (Test-Path $file) {
            try {
                $GLOBAL:CRITICAL_FILE_CACHE[$file] = Get-Content -Path $file -Raw
                Write-EnforcementLog "Cached initial content for $file" "INFO"
            } catch {
                Write-EnforcementLog "ERROR: Could not read $file for caching: $_" "ERROR"
            }
        } else {
            Write-EnforcementLog "Warning: Critical file not found: $file" "WARNING"
        }
    }
    Write-EnforcementLog "Critical file cache initialized." "INFO"
}

function Test-DocumentationViolation {
    param([string]$FilePath)
    
    # Check if trying to create new documentation files
    $documentationFiles = @("*.md", "*README*", "*IMPLEMENTATION*", "*TECHNICAL*", "*ARCHITECTURE*")
    foreach ($pattern in $documentationFiles) {
        if ($FilePath -like $pattern) {
            # Check if it's in docs folder (allowed) or elsewhere (violation)
            if ($FilePath -notlike "*$PROJECT_ROOT\docs*") {
                Write-EnforcementLog "DOCUMENTATION VIOLATION: Attempting to create $FilePath outside docs/ folder" "VIOLATION"
                return $true
            }
        }
    }
    return $false
}

function IsAllowedDoc {
    param([string]$FilePath)
    if ($FilePath -ieq "$PROJECT_ROOT\docs\BITTE_SPECIFIC_TECHNICAL_ARCHITECTURE.md") { return $true }
    return $false
}

function Handle-DocChange {
    param([string]$FilePath)
    $fileName = Split-Path -Leaf $FilePath
    $isReadme = $fileName -ieq "README.md"
    $isMarkdown = $fileName -like "*.md"
    if ($isReadme -or $isMarkdown) {
        if (-not (IsAllowedDoc -FilePath $FilePath)) {
            try {
                $content = Get-Content -Path $FilePath -Raw
            } catch {
                $content = ""
            }
            if ($isReadme -or ($content -like "*```mermaid*")) {
                Write-EnforcementLog "DOCUMENTATION CHANGE BLOCKED: $fileName" "VIOLATION"
                try {
                    Push-Location $PROJECT_ROOT
                    # git checkout -- $FilePath | Out-Null
                } catch {
                    Write-EnforcementLog "FAILED TO REVERT: $FilePath" "ERROR"
                } finally {
                    Pop-Location
                }
                # Re-enabled exit 1 to stop violating action
                # exit 1
                return $true
            }
        }
    }
    return $false
}

function Test-FileCreationViolation {
    param([string]$FilePath, [string]$FileContent)
    
    # Check for test/simple/demo file creation violations
    $violationPatterns = @(
        "*test*marketplace*",
        "*simple*marketplace*", 
        "*demo*marketplace*",
        "*working*marketplace*html*"
    )
    
    $fileName = Split-Path -Leaf $FilePath
    foreach ($pattern in $violationPatterns) {
        if ($fileName -like $pattern) {
            Write-EnforcementLog "FILE CREATION VIOLATION: Creating test/simple/demo file $fileName" "VIOLATION"
            return $true
        }
    }
    
    # Check file content for test/simple patterns
    if ($FileContent -and ($FileContent -like "*test*" -or $FileContent -like "*simple*" -or $FileContent -like "*demo*")) {
        if ($fileName -like "*marketplace*" -or $fileName -like "*test*" -or $fileName -like "*simple*") {
            Write-EnforcementLog "CONTENT VIOLATION: File $fileName contains test/simple/demo content" "VIOLATION"
            return $true
        }
    }
    
    return $false
}

function Get-GrantSourceCode {
    param([string]$GrantName)
    
    if ($GRANT_REPOS.ContainsKey($GrantName)) {
        $sourcePath = "$PROJECT_ROOT\$($GRANT_REPOS[$GrantName])"
        if (Test-Path $sourcePath) {
            return $sourcePath
        }
    }
    return $null
}

function Copy-GrantDocumentation {
    param([string]$GrantName, [string]$TargetPath)
    
    Write-EnforcementLog "Copying existing documentation for $GrantName to $TargetPath" "INFO"
    
    # Determine which docs to copy based on grant name
    $docKey = $GrantName.Replace("-", "_").Split("_")[0]
    if ($GRANT_DOCS.ContainsKey($docKey)) {
        foreach ($doc in $GRANT_DOCS[$docKey]) {
            $sourceDoc = "$EXISTING_DOCS_PATH\$doc"
            $targetDoc = "$TargetPath\$doc"
            
            if (Test-Path $sourceDoc) {
                Copy-Item -Path $sourceDoc -Destination $targetDoc -Force
                Write-EnforcementLog "Copied: $sourceDoc -> $targetDoc" "INFO"
            } else {
                Write-EnforcementLog "Warning: Documentation file not found: $sourceDoc" "WARNING"
            }
        }
    } else {
        Write-EnforcementLog "Warning: No documentation mapping for $GrantName" "WARNING"
    }
}

function Extract-GrantRepository {
    param([string]$GrantName)
    
    Write-EnforcementLog "Extracting $GrantName repository" "INFO"
    
    # Get source code path
    $sourceCode = Get-GrantSourceCode -GrantName $GrantName
    if (-not $sourceCode) {
        Write-EnforcementLog "ERROR: No source code found for $GrantName" "ERROR"
        return $false
    }
    
    # Create target directory in EXTERNAL compiling folder
    $targetDir = "$GRANT_REPOS_ROOT\$GrantName"
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force
    }
    
    # Copy actual source code (NOT just READMEs)
    Write-EnforcementLog "Copying source code from $sourceCode to $targetDir" "INFO"
    Copy-Item -Path $sourceCode -Destination $targetDir -Recurse -Force
    
    # Copy existing individual grant documentation
    Copy-GrantDocumentation -GrantName $GrantName -TargetPath $targetDir
    
    Write-EnforcementLog "Successfully extracted $GrantName to $targetDir" "SUCCESS"
    return $true
}

function Push-GrantToGitHub {
    param([string]$GrantName)
    
    $grantPath = "$GRANT_REPOS_ROOT\$GrantName"
    if (-not (Test-Path $grantPath)) {
        Write-EnforcementLog "ERROR: Grant repository not found: $grantPath" "ERROR"
        return $false
    }
    
    Write-EnforcementLog "Pushing $GrantName to https://github.com/compiling-org/$GrantName" "INFO"
    
    # Navigate to grant directory
    Push-Location $grantPath
    
    try {
        # Initialize git if needed
        if (-not (Test-Path ".git")) {
            git init
            git remote add origin "https://github.com/compiling-org/$GrantName.git"
        }
        
        # Add all files
        git add .
        git commit -m "Update grant repository with latest code and documentation"
        git push origin main
        
        Write-EnforcementLog "Successfully pushed $GrantName to GitHub" "SUCCESS"
        return $true
    }
    catch {
        Write-EnforcementLog "ERROR: Failed to push $GrantName to GitHub: $_" "ERROR"
        return $false
    }
    finally {
        Pop-Location
    }
}

# Main Enforcement Function
function Invoke-GrantExtractionEnforcement {
    param([string]$Action = "")
    
    Write-EnforcementLog "Starting Grant Extraction Enforcement" "INFO"
    
    # Check for psychotic loop patterns
    if (Test-PsychoticLoop -Action $Action) {
        if (Stop-PsychoticDocumentation) {
            # The AI agent will be terminated by the IDE based on the enforcer's output.


        }
    }
    
    # Ensure correct directory structure
    if (-not (Test-Path $GRANT_REPOS_ROOT)) {
        New-Item -ItemType Directory -Path $GRANT_REPOS_ROOT -Force
        Write-EnforcementLog "Created grant repositories root: $GRANT_REPOS_ROOT" "INFO"
    }
    
    # Extract all grants
    foreach ($grant in $GRANT_REPOS.Keys) {
        Write-EnforcementLog "Processing grant: $grant" "INFO"
        
        # Extract repository
        if (Extract-GrantRepository -GrantName $grant) {
            # Push to GitHub
            Push-GrantToGitHub -GrantName $grant
        }
    }
    
    Write-EnforcementLog "Grant extraction enforcement completed" "SUCCESS"
}

# Initialize critical file cache
Initialize-CriticalFileCache

# File System Monitor Function
function Start-FileSystemMonitor {
    Write-EnforcementLog "Starting File System Monitor" "INFO"
    
    # Monitor file creation events
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $PROJECT_ROOT
    $watcher.IncludeSubdirectories = $true
    $watcher.EnableRaisingEvents = $true
    
    # Register event handler for file creation
    Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action {
        $GLOBAL:SIGNAL_SENT_FOR_CURRENT_VIOLATION = $false
        $filePath = $Event.SourceEventArgs.FullPath
        $fileName = Split-Path -Leaf $filePath
        
        # Check for documentation creation violations
        if (Test-DocumentationViolation -FilePath $filePath) {
            # Write-EnforcementLog "DOCUMENTATION VIOLATION DETECTED: Created file $fileName outside docs/ folder - DELETING IMMEDIATELY" "VIOLATION"
            try {
                # # Remove-Item -Path $filePath -Force
                # Write-EnforcementLog "DELETED violating documentation file: $filePath" "VIOLATION"
            }
            catch {
                Write-EnforcementLog "FAILED to delete violating documentation file: $filePath" "ERROR"
            }
            # The AI agent will be terminated by the IDE based on the enforcer's output.
        }
        # Check for test/simple/demo file creation violations
        if (Test-FileCreationViolation -FilePath $filePath) {
            # Write-EnforcementLog "VIOLATION DETECTED: Created file $fileName - DELETING IMMEDIATELY" "VIOLATION"
            
            # Delete the violating file
            try {
                Remove-Item -Path $filePath -Force
                Write-EnforcementLog "DELETED violating file: $filePath" "VIOLATION"
            }
            catch {
                Write-EnforcementLog "FAILED to delete violating file: $filePath" "ERROR"
            }
            # The AI agent will be terminated by the IDE based on the enforcer's output.
        }
    }
    
    Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action {
        $GLOBAL:SIGNAL_SENT_FOR_CURRENT_VIOLATION = $false
        $filePath = $Event.SourceEventArgs.FullPath

        # Check for non-surgical changes in critical files
        if ($CRITICAL_FILES -contains $filePath) {
            try {
                $currentContent = Get-Content -Path $filePath -Raw
                if (Test-NonSurgicalChange -FilePath $filePath -CurrentContent $currentContent) {
                    Write-EnforcementLog "NON-SURGICAL CHANGE VIOLATION: $filePath - Reverting immediately!" "VIOLATION"
                    try {
                        Push-Location $PROJECT_ROOT
                        # git checkout -- $filePath | Out-Null
                        Write-EnforcementLog "Reverted non-surgical change to $filePath" "VIOLATION"
                    } catch {
                        Write-EnforcementLog "FAILED TO REVERT non-surgical change to ${filePath}: $_" "ERROR"
                    } finally {
                        Pop-Location
                    }
                    # The AI agent will be terminated by the IDE based on the enforcer's output.
                }
            } catch {
                Write-EnforcementLog "ERROR: Could not read $filePath for non-surgical change detection: $_" "ERROR"
            }
        }

        Handle-DocChange -FilePath $filePath
        if (Handle-DocChange -FilePath $filePath) {
            # The AI agent will be terminated by the IDE based on the enforcer's output.
        }
    }
    Register-ObjectEvent -InputObject $watcher -EventName "Renamed" -Action {
        $GLOBAL:SIGNAL_SENT_FOR_CURRENT_VIOLATION = $false
        $filePath = $Event.SourceEventArgs.FullPath
        Handle-DocChange -FilePath $filePath
    }
    
    Write-EnforcementLog "File System Monitor started - monitoring for violations" "INFO"
}

# Start the file system monitor
Start-FileSystemMonitor

# Keep the script running
while ($true) {
    Start-Sleep -Seconds 1
}
