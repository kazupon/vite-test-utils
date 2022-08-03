#!/bin/bash

set -xe

# Restore all git changes
git restore --source=HEAD --staged --worktree -- package.json pnpm-lock.yaml

# Install pnpm
pnpm install

# Build packages
pnpm build

# Bump versions to edge
npx jiti ./scripts/bump-edge

# Update token
if [[ ! -z ${NPM_TOKEN} ]] ; then
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> ~/.npmrc
  echo "registry=https://registry.npmjs.org/" >> ~/.npmrc
  echo "always-auth=true" >> ~/.npmrc
  npm whoami
fi

# Release packages
echo "Publishing"
npm publish
