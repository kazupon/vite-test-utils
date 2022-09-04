#!/bin/bash

set -xe

if [[ ! -z ${PNPM_INSTALL} ]] ; then
  # Restore all git changes
  git restore --source=HEAD --staged --worktree -- package.json pnpm-lock.yaml
  # Install pnpm
  pnpm install --no-frozen-lockfile
fi

# Check edge release
if [[ ! -z ${EDGE_RELEASE} ]] ; then
  npx jiti ./scripts/bump-edge
fi

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
