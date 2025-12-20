#!/usr/bin/env node
// Simple version bump script
// Auto-detect branch: master/main -> normal version, others -> prerelease with branch name

import fs from 'fs';
import path from 'path';
import { runSilent, runResult } from '../../cli/runTask/runHelper.js';
// import { colorLog } from '../../cli/log/colorLog.js';
import { Logger } from '../../cli/log/logKit.js';

// Validate semver format
const isValidSemver = (version) => {
  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
  return semverRegex.test(version);
};

async function main () {
  // Get current git branch
  const currentBranch = await runResult('git rev-parse --abbrev-ref HEAD');
  Logger.info(`Current branch: ${currentBranch}`);

  // Check if it's a main branch
  const mainBranches = process.env.MAIN_BRANCHES?.split(',') || ['master', 'main'];
  const isMainBranch = mainBranches.includes(currentBranch);

  // Check if there are uncommitted changes
  try {
    const status = await runResult('git status --porcelain');
    if (status.length > 0) {
      Logger.error('Error: Working directory not clean. Please commit or stash changes first.');
      Logger.warn(`Changes:\n ${status}`);
      process.exit(1);
    }
  } catch (_error) {
    Logger.error('Error: Failed to check git status');
    process.exit(1);
  }

  // Check local branch is in sync with remote
  // try {
  //   await runSilent('git fetch');
  //   const localCommit = await runResult('git rev-parse HEAD');
  //   const remoteCommit = await runResult(`git rev-parse origin/${currentBranch}`);
  //   if (localCommit !== remoteCommit) {
  //     Logger.warn('Warning: Local branch is not in sync with remote');
  //   }
  // } catch (_error) {
  //   // Remote branch might not exist, ignore
  // }

  // Read package.json
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    Logger.error('Error: package.json not found');
    process.exit(1);
  }

  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (_error) {
    Logger.error('Error: Failed to parse package.json');
    process.exit(1);
  }

  if (!pkg.version) {
    Logger.error('Error: version field not found in package.json');
    process.exit(1);
  }

  if (!isValidSemver(pkg.version)) {
    Logger.error(`Error: Invalid semver format: ${pkg.version}`);
    process.exit(1);
  }

  Logger.info(`Current version: ${pkg.version}`);

  // Bump version based on branch
  try {
    if (isMainBranch) {
      // Main branch: normal patch version bump
      await runSilent('npm version patch --no-git-tag-version');
    } else {
      // Feature/dev branch: prerelease version with branch name
      const branchName = currentBranch.replace(/[^a-zA-Z0-9]/g, '-'); // sanitize branch name
      const currentPreid = pkg.version.match(/-([^.]+)\.\d+$/)?.[1];

      if (currentPreid === branchName) {
        // Already has the same branch prerelease, just increment
        await runSilent('npm version prerelease --no-git-tag-version');
      } else {
        // New branch or different prerelease, set new preid
        await runSilent(`npm version prerelease --preid=${branchName} --no-git-tag-version`);
      }
    }
  } catch (_error) {
    Logger.error('Error: Failed to bump version');
    process.exit(1);
  }

  // Read new version
  let newPkg;
  try {
    newPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (_error) {
    Logger.error('Error: Failed to read updated package.json');
    process.exit(1);
  }

  if (!isValidSemver(newPkg.version)) {
    Logger.error(`Error: New version has invalid semver format: ${newPkg.version}`);
    process.exit(1);
  }

  Logger.info(`New version: ${newPkg.version}`);

  // Git commit
  try {
    await runSilent('git add package.json package-lock.json');
    await runSilent([`git`, `commit`, `-m`, `version: ${newPkg.name}@${newPkg.version}`]);
  } catch (_error) {
    Logger.error(['Error: Failed to commit changes', 'You may need to manually revert package.json changes']);
    process.exit(1);
  }

  Logger.success('Version bumped and committed');
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
