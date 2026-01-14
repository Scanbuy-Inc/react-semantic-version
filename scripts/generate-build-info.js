const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getVersionFromGitTags() {
  try {
    // Get the latest git tag
    const latestTag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf8'
    }).trim();

    // Remove 'v' prefix if present (v1.0.0 → 1.0.0)
    // Get current commit SHA
    return latestTag.replace(/^v/, '');

  } catch (error) {
    console.warn('Could not read git tags, using fallback version');
    // Fallback to package.json if no tags exist
    const packageJson = require('../package.json');
    return packageJson.version;
  }
}

function generateBuildInfo() {
  try {
    // Get version from git tags
    const buildNumber = getVersionFromGitTags();

    console.log("Build NUmber", buildNumber);

    // Use Amplify environment variables for build info
    const buildId = process.env.AWS_BRANCH || 'local';
    const buildDate = new Date().toISOString();
    const environment = process.env.AWS_BRANCH === 'main' || process.env.AWS_BRANCH === 'master' ? 'prod' :
                       process.env.AWS_BRANCH === 'develop' ? 'dev' :
                       process.env.AWS_BRANCH || 'local';

    // Create simple build info
    const buildInfo = {
      buildNumber,
      buildId,
      environment,
      buildDate,
      buildDateString: new Date().toLocaleString(),
      awsBranch: process.env.AWS_BRANCH,
      awsCommitId: process.env.AWS_COMMIT_ID,
      awsJobId: process.env.AWS_JOB_ID,
      awsAppId: process.env.AWS_APP_ID
    };

    // Write to VersionInfo.js for React import
    const buildInfoContent = `export const versionInfo = ${JSON.stringify(buildInfo, null, 2)};
`;

    const outputPath = path.join('src', 'components', 'VersionInfo.js');
    const outputDir = path.dirname(outputPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, buildInfoContent);

    console.log('Amplify build info generated:', buildInfo);
    console.log(`Written to: ${outputPath}`);

  } catch (error) {
    console.error('Error generating build info:', error);
    // Don't exit with error - let build continue
    console.warn('Using fallback build info');

    // Fallback build info
    const packageJson = require('../package.json');
    const fallbackInfo = {
      buildNumber: packageJson.version,
      buildId: 'local',
      environment: 'local',
      buildDate: new Date().toISOString(),
      buildDateString: new Date().toLocaleString()
    };

    const buildInfoContent = `export const versionInfo = ${JSON.stringify(fallbackInfo, null, 2)};
`;

    const outputPath = path.join('src', 'components', 'VersionInfo.js');
    const outputDir = path.dirname(outputPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, buildInfoContent);
  }
}

generateBuildInfo();
