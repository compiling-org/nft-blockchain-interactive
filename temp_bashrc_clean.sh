# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files for examples

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# don't put duplicate lines or lines starting with space in the history.
# See bash(1) for more options
HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=1000
HISTFILESIZE=2000

# enable programmable completion (you don't need to enable this in /etc/bash.bashrc)
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi

# NVM sourcing - moved here to ensure it's applied before custom PATH reconstruction
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Ensure core Linux dirs are present in PATH and filter out raw Windows mounts
if [ -n "$PATH" ]; then
  CLEAN_PATH=""
  IFS=":" read -ra PATH_ARRAY <<< "$PATH"
  for p in "${PATH_ARRAY[@]}"; do
    case "$p" in
      /mnt/*)  ;;
      "")       ;;
      *)
        case ":$CLEAN_PATH:" in
          *":$p:"*) ;;
          *) CLEAN_PATH="${CLEAN_PATH:+$CLEAN_PATH:}$p" ;;
        esac
        ;;
    esac
  done
  PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$CLEAN_PATH"
  export PATH
fi
