#!/usr/bin/env node
// Simple tag and push script with safety checks

import fs from 'fs';
import path from 'path';
import { runSilent, runResult } from '../../cli/runTask/runHelper.js';
// import { colorLog } from '../../cli/log/colorLog.js';
import { Logger } from '../../cli/log/logKit.js';
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

  const tag = `v${pkg.version}`;

  Logger.info(`Preparing to push version: ${tag}`);

  // Check last commit message
  const lastCommitMsg = await runResult('git log -1 --pretty=%s');

  if (!lastCommitMsg.toLowerCase().startsWith('version')) {
    Logger.error('Error: Last commit message must start with "version"');
    Logger.warn(`Current message: ${lastCommitMsg}`);
    process.exit(1);
  }

  // Check if tag already exists (locally or remotely)
  Logger.loading(`Checking if tag ${tag} already exists...`);
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
    Logger.error(`Tag ${tag} already exists`);
    process.exit(1);
  }

  Logger.success('All checks passed');

  // Push commits
  Logger.loading('Pushing commits...');
  try {
    await runSilent('git push');
    Logger.success('Successfully pushed commits');
  } catch (_error) {
    Logger.error('Error: Failed to push commits');
    process.exit(1);
  }

  // Create and push tag
  Logger.loading(`Creating tag...`);
  try {
    await runSilent(`git tag "${tag}"`);
    Logger.success(`Successfully created tag ${tag}`);
  } catch (_error) {
    Logger.error(`Error: Failed to create tag ${tag}`);
    process.exit(1);
  }

  Logger.loading('Pushing tag...');
  try {
    await runSilent(`git push origin "${tag}"`);
    Logger.success(`Successfully pushed tag ${tag}`);
  } catch (_error) {
    Logger.error('Error: Failed to push tag');
    Logger.warn(`Warning: Tag ${tag} was created locally but not pushed`);
    Logger.warn(`You may need to manually delete the tag: git tag -d ${tag}`);
    process.exit(1);
  }

  // Publish to npm (unless --skip-publish flag is set)
  if (!skipPublish) {
    Logger.loading('Publishing to npm...');
    try {
      await runSilent('npm publish');
      Logger.success('Successfully published to npm');
    } catch (_error) {
      Logger.error('Error: Failed to publish to npm');
      Logger.warn('Tag has been pushed, you may need to manually publish with: npm publish');
      process.exit(1);
    }
  } else {
    Logger.success('Tag pushed successfully (npm publish skipped)');
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
