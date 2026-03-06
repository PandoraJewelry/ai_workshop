#!/usr/bin/env node

/**
 * Tea Store Demo - Cross-Platform Test Runner
 * This script runs all tests for both backend and frontend
 * Works on Windows, macOS, and Linux
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for output (ANSI codes work on modern terminals including Windows 10+)
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

// Get the directory where this script is located
const SCRIPT_DIR = __dirname;

// Track test results
let backendResult = 0;
let frontendUnitResult = 0;
let e2eResult = 0;

// Parse arguments
const args = process.argv.slice(2);
const RUN_E2E = args.includes('--e2e');
const RUN_COVERAGE = args.includes('--coverage');
const RUN_HEADED = args.includes('--headed');
const SHOW_HELP = args.includes('--help');

function log(message, color = '') {
  if (color) {
    console.log(`${color}${message}${colors.reset}`);
  } else {
    console.log(message);
  }
}

function showHelp() {
  console.log('Usage: node test.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --e2e       Run E2E tests (requires services to be running)');
  console.log('  --headed    Run E2E tests in headed mode (visible browser)');
  console.log('  --coverage  Run tests with coverage reports');
  console.log('  --help      Show this help message');
  console.log('');
  console.log('By default, runs backend (pytest) and frontend unit tests (vitest)');
  process.exit(0);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';

    // On Windows, use shell to run commands
    const spawnOptions = {
      cwd: options.cwd || SCRIPT_DIR,
      stdio: 'inherit',
      shell: isWindows,
    };

    const proc = spawn(command, args, spawnOptions);

    proc.on('close', (code) => {
      resolve(code || 0);
    });

    proc.on('error', (err) => {
      console.error(`Failed to start process: ${err.message}`);
      resolve(1);
    });
  });
}

function getPythonPath() {
  const isWindows = process.platform === 'win32';
  const venvPath = path.join(SCRIPT_DIR, 'backend', 'venv');

  if (isWindows) {
    return path.join(venvPath, 'Scripts', 'python.exe');
  }
  return path.join(venvPath, 'bin', 'python');
}

function getNpmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function getNpxCommand() {
  return process.platform === 'win32' ? 'npx.cmd' : 'npx';
}

async function runBackendTests() {
  log('[1/3] Running Backend Tests (pytest)...', colors.yellow);
  console.log('');

  const backendDir = path.join(SCRIPT_DIR, 'backend');
  const venvDir = path.join(backendDir, 'venv');
  const pythonPath = getPythonPath();

  // Check if venv exists
  if (!fs.existsSync(venvDir)) {
    log('  ✗ Backend virtual environment not found', colors.red);
    log('  Run start script first to set up dependencies');
    return 1;
  }

  // Check if python exists in venv
  if (!fs.existsSync(pythonPath)) {
    log('  ✗ Python not found in virtual environment', colors.red);
    return 1;
  }

  // Build pytest arguments
  const pytestArgs = ['-m', 'pytest', 'tests/', '-v'];

  if (RUN_COVERAGE) {
    pytestArgs.push('--cov=app', '--cov-report=term-missing', '--cov-report=html:coverage_html');
  }

  const result = await runCommand(pythonPath, pytestArgs, { cwd: backendDir });

  if (result === 0) {
    log('  ✓ Backend tests passed', colors.green);
  } else {
    log('  ✗ Backend tests failed', colors.red);
  }
  console.log('');

  return result;
}

async function runFrontendUnitTests() {
  log('[2/3] Running Frontend Unit Tests (vitest)...', colors.yellow);
  console.log('');

  const frontendDir = path.join(SCRIPT_DIR, 'frontend');
  const nodeModulesDir = path.join(frontendDir, 'node_modules');
  const npm = getNpmCommand();

  // Check if node_modules exists, install if not
  if (!fs.existsSync(nodeModulesDir)) {
    log('  Installing frontend dependencies...', colors.yellow);
    await runCommand(npm, ['install', '--silent'], { cwd: frontendDir });
  }

  const testScript = RUN_COVERAGE ? 'test:coverage' : 'test';
  const result = await runCommand(npm, ['run', testScript], { cwd: frontendDir });

  if (result === 0) {
    log('  ✓ Frontend unit tests passed', colors.green);
  } else {
    log('  ✗ Frontend unit tests failed', colors.red);
  }
  console.log('');

  return result;
}

async function runE2ETests() {
  log('[3/3] Running E2E Tests (playwright)...', colors.yellow);
  console.log('');

  const nodeModulesDir = path.join(SCRIPT_DIR, 'node_modules');
  const npm = getNpmCommand();
  const npx = getNpxCommand();

  // Ensure root dependencies are installed
  if (!fs.existsSync(nodeModulesDir)) {
    log('  Installing root dependencies...', colors.yellow);
    await runCommand(npm, ['install'], { cwd: SCRIPT_DIR });
  }

  const playwrightArgs = ['playwright', 'test'];
  if (RUN_HEADED) {
    playwrightArgs.push('--headed');
  }

  const result = await runCommand(npx, playwrightArgs, { cwd: SCRIPT_DIR });

  if (result === 0) {
    log('  ✓ E2E tests passed', colors.green);
  } else {
    log('  ✗ E2E tests failed', colors.red);
  }
  console.log('');

  return result;
}

function printSummary() {
  log('========================================', colors.blue);
  log('   Test Summary', colors.blue);
  log('========================================', colors.blue);
  console.log('');

  let overallResult = 0;

  if (backendResult === 0) {
    log('  Backend (pytest):     PASSED', colors.green);
  } else {
    log('  Backend (pytest):     FAILED', colors.red);
    overallResult = 1;
  }

  if (frontendUnitResult === 0) {
    log('  Frontend (vitest):    PASSED', colors.green);
  } else {
    log('  Frontend (vitest):    FAILED', colors.red);
    overallResult = 1;
  }

  if (RUN_E2E) {
    if (e2eResult === 0) {
      log('  E2E (playwright):     PASSED', colors.green);
    } else {
      log('  E2E (playwright):     FAILED', colors.red);
      overallResult = 1;
    }
  } else {
    log('  E2E (playwright):     SKIPPED', colors.yellow);
  }

  console.log('');

  if (overallResult === 0) {
    log('All tests passed!', colors.green);
  } else {
    log('Some tests failed.', colors.red);
  }

  console.log('');
  return overallResult;
}

async function main() {
  if (SHOW_HELP) {
    showHelp();
  }

  log('========================================', colors.blue);
  log('   Tea Store Demo - Test Runner', colors.blue);
  log('========================================', colors.blue);
  console.log('');

  // Run backend tests
  backendResult = await runBackendTests();

  // Run frontend unit tests
  frontendUnitResult = await runFrontendUnitTests();

  // Run E2E tests if requested
  if (RUN_E2E) {
    e2eResult = await runE2ETests();
  } else {
    log('[3/3] Skipping E2E Tests', colors.blue);
    log('  (Run with --e2e flag to include E2E tests)');
    console.log('');
  }

  // Print summary and exit
  const overallResult = printSummary();
  process.exit(overallResult);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
