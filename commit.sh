#!/bin/sh

if [ -z "$(git status --porcelain)" ]; then 
  git config user.name github-actions
  git config user.email github-actions@github.com
  git add .
  git commit -m "Generated new readme"
  git push
else 
  echo "Nothing to commit all clean"
fi