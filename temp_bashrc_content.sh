# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (the "EXAMPLES" section)
# for examples

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# don't put duplicate lines or lines starting with space in the history.
# See bash(1) for more options
histcontrol=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
histsize=1000

# NVM Sourcing
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Prioritize Linux paths and filter out Windows paths
if [ -n "$PATH" ]; then
    NEW_PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
    if [ -d "$HOME/.cargo/bin" ]; then
        NEW_PATH="$HOME/.cargo/bin:$NEW_PATH"
    fi
    IFS=":" read -ra PATH_ARRAY <<< "$PATH"
    for p in "${PATH_ARRAY[@]}" ; do
        if [[ ! "$p" =~ ^/mnt/ ]] && [[ ! ":$NEW_PATH:" =~ ":$p:" ]]; then
            NEW_PATH="$NEW_PATH:$p"
        fi
    done
    export PATH="$NEW_PATH"
fi
