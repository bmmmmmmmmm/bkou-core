#!/usr/bin/env node
// Simple version bump script
// Auto-detect branch: master/main -> normal version, others -> prerelease with branch name

import fs from 'fs';
import path from 'path';
import { runSilent, runResult } from '../../cli/runTask/runHelper.js';
import { colorLog } from '../../cli/log/colorLog.js';

// Validate semver format
const isValidSemver = (version) => {
  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
  return semverRegex.test(version);
};

async function main () {
  // Get current git branch
  const currentBranch = await runResult('git rev-parse --abbrev-ref HEAD');
  colorLog(`Current branch: ${currentBranch}`, 'blue');

  // Check if it's a main branch
  const mainBranches = process.env.MAIN_BRANCHES?.split(',') || ['master', 'main'];
  const isMainBranch = mainBranches.includes(currentBranch);

  // Check if there are uncommitted changes
  try {
    const status = await runResult('git status --porcelain');
    if (status.length > 0) {
      colorLog('❌ Error: Working directory not clean. Please commit or stash changes first.', 'red');
      // colorLog(['Changes:', ...status], 'yellow');
      colorLog(`Changes:\n ${status}`, 'yellow');
      process.exit(1);
    }
  } catch (_error) {
    colorLog('❌ Error: Failed to check git status', 'red');
    process.exit(1);
  }

  // Check local branch is in sync with remote
  // try {
  //   await runSilent('git fetch');
  //   const localCommit = await runResult('git rev-parse HEAD');
  //   const remoteCommit = await runResult(`git rev-parse origin/${currentBranch}`);
  //   if (localCommit !== remoteCommit) {
  //     colorLog('⚠ Warning: Local branch is not in sync with remote', 'yellow');
  //   }
  // } catch (_error) {
  //   // Remote branch might not exist, ignore
  // }

  // Read package.json
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    colorLog('❌ Error: package.json not found', 'red');
    process.exit(1);
  }

  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (_error) {
    colorLog('❌ Error: Failed to parse package.json', 'red');
    process.exit(1);
  }

  if (!pkg.version) {
    colorLog('❌ Error: version field not found in package.json', 'red');
    process.exit(1);
  }

  if (!isValidSemver(pkg.version)) {
    colorLog(`❌ Error: Invalid semver format: ${pkg.version}`, 'red');
    process.exit(1);
  }

  colorLog(`Current version: ${pkg.version}`, 'blue');

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
    colorLog('❌ Error: Failed to bump version', 'red');
    process.exit(1);
  }

  // Read new version
  let newPkg;
  try {
    newPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (_error) {
    colorLog('❌ Error: Failed to read updated package.json', 'red');
    process.exit(1);
  }

  if (!isValidSemver(newPkg.version)) {
    colorLog(`❌ Error: New version has invalid semver format: ${newPkg.version}`, 'red');
    process.exit(1);
  }

  colorLog(`==> New version: ${newPkg.version}`, 'blue');

  // Git commit
  try {
    await runSilent('git add package.json package-lock.json');
    await runSilent([`git`, `commit`, `-m`, `version: ${newPkg.name}@${newPkg.version}`]);
    colorLog('✅ Version bumped and committed', 'cyan');
  } catch (_error) {
    colorLog('❌ Error: Failed to commit changes', 'red');
    colorLog('You may need to manually revert package.json changes', 'yellow');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
