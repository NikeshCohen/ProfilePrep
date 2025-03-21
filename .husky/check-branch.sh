#!/bin/sh

# fetch latest updates from the remote
git fetch origin

# get the current branch name
current_branch=$(git symbolic-ref --short HEAD)

# check if the current branch is up to date with 'main'
if [[ $(git rev-list --left-right --count origin/main...$current_branch | awk '{print $1}') -gt 0 ]]; then
  printf "\nYour branch is behind 'main'.\nPlease pull the latest changes before committing.\n"
  exit 1
fi

printf "\n💃 Branch is up to date with 'main'.\n"