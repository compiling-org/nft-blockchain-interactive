#!/bin/bash
echo "PATH: $PATH" > wsl_debug.txt
echo "Check cargo-near:" >> wsl_debug.txt
which cargo-near >> wsl_debug.txt 2>&1
echo "Check near:" >> wsl_debug.txt
which near >> wsl_debug.txt 2>&1
echo "Cargo list:" >> wsl_debug.txt
cargo --list >> wsl_debug.txt 2>&1
echo "Cargo near version:" >> wsl_debug.txt
cargo near --version >> wsl_debug.txt 2>&1
