#!/usr/bin/env node
// Simple tag and push script with safety checks

import fs from 'fs';
import path from 'path';
import { runSilent, runResult } from '../../cli/runTask/runHelper.js';
import { colorLog } from '../../cli/log/colorLog.js';
import { parseArgs } from '../../cli/args/parseArgs.js';

// Validate semver format
const isValidSemver = (version) => {
  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
  return semverRegex.test(version);
};

async function main () {
  // Parse command line arguments
  const { skipPublish } = parseArgs(process.argv, {
    aliases: {
      'skip-publish': 'skipPublish',
    },
    defaults: {
      skipPublish: false,
    },
  });

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

  const tag = `v${pkg.version}`;

  // colorLog(`Preparing to push version: ${tag}`, 'cyan');
  colorLog(`Version to be tagged: ${tag}`, 'blue');

  // Check last commit message
  const lastCommitMsg = await runResult('git log -1 --pretty=%s');
  // colorLog(`Last commit: ${lastCommitMsg}`, 'blue');

  if (!lastCommitMsg.toLowerCase().startsWith('version')) {
    colorLog('❌ Error: Last commit message must start with "version"', 'red');
    colorLog(`   Current message: ${lastCommitMsg}`, 'yellow');
    process.exit(1);
  }

  // Check if tag already exists (locally or remotely)
  colorLog(`🔄 Checking if tag ${tag} already exists...`);
  let tagExists = false;
  try {
    await runSilent(`git rev-parse ${tag}`);
    tagExists = true;
  } catch (_error) {
    // Tag doesn't exist locally, check remote
    try {
      const remoteTagOutput = await runResult(`git ls-remote --tags origin ${tag}`);
      if (remoteTagOutput.trim()) {
        tagExists = true;
      }
    } catch (_error) {
      // Tag doesn't exist remotely either
    }
  }

  if (tagExists) {
    colorLog(`❌ Error: Tag ${tag} already exists`, 'red');
    process.exit(1);
  }

  colorLog('✅ Checks passed', 'green');

  // Push commits
  colorLog('🔄 Pushing commits...');
  try {
    await runSilent('git push');
    colorLog('✅ Successfully pushed commits', 'green');
  } catch (_error) {
    colorLog('❌ Error: Failed to push commits', 'red');
    process.exit(1);
  }

  // Create and push tag
  colorLog(`🔄 Creating tag...`);
  try {
    await runSilent(`git tag "${tag}"`);
    colorLog(`✅ Successfully created tag ${tag}`, 'green');
  } catch (_error) {
    colorLog(`❌ Error: Failed to create tag ${tag}`, 'red');
    process.exit(1);
  }

  colorLog('🔄 Pushing tag...');
  try {
    await runSilent(`git push origin "${tag}"`);
    colorLog(`✅ Successfully pushed ${tag}`, 'green');
  } catch (_error) {
    colorLog('❌ Error: Failed to push tag', 'red');
    colorLog(`⚠️ Warning: Tag ${tag} was created locally but not pushed`, 'yellow');
    colorLog(`You may need to manually delete the tag: git tag -d ${tag}`, 'yellow');
    process.exit(1);
  }

  // Publish to npm (unless --skip-publish flag is set)
  if (!skipPublish) {
    colorLog('🔄 Publishing to npm...');
    try {
      await runSilent('npm publish');
      colorLog('✅ Successfully published to npm', 'green');
    } catch (_error) {
      colorLog('❌ Error: Failed to publish to npm', 'red');
      colorLog('⚠️ Tag has been pushed, you may need to manually publish with: npm publish', 'yellow');
      process.exit(1);
    }
  } else {
    colorLog('✅ Tag pushed successfully (npm publish skipped)', 'green');
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
