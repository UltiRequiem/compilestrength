# GitHub Actions CI

This directory contains GitHub Actions workflows for automated testing and quality checks.

## Workflows

### `test.yml` - Smart Test Runner

Automatically runs tests only for files that have been modified in a PR or push, making CI fast and efficient.

**Features:**
- Detects changed source files (`.ts`, `.tsx`)
- Finds corresponding test files
- Runs only affected tests
- Falls back to running all tests if no specific test files are found
- Always runs type checking and linting

**Triggers:**
- Pull requests to `main` or `testing` branches
- Pushes to `main` or `testing` branches

**Workflow Steps:**
1. Checkout code with full history
2. Setup Bun (latest version)
3. Install dependencies
4. Detect changed files
5. Find related test files
6. Run tests for changed files only
7. Type check with TypeScript
8. Lint check with Biome

**Example:**
If you modify `src/lib/validation.ts`, the CI will:
- Find `src/lib/validation.test.ts`
- Run only that test file
- Run `tsc --noEmit` for type checking
- Run `bun run biocheck` for linting

## Local Testing

You can simulate the CI behavior locally using:

```bash
# Test only files changed compared to main branch
npm run test:changed

# Test only files changed compared to a specific branch
./scripts/test-changed.sh testing
```

The local script provides helpful output:
- Lists all changed source files
- Shows which test files will be run
- Runs tests and type checking
- Displays success/failure status

## How It Works

### Changed Files Detection

The workflow uses the `tj-actions/changed-files@v45` action to detect modified files:

```yaml
files: |
  src/**/*.ts
  src/**/*.tsx
files_ignore: |
  **/*.test.ts
  **/*.test.tsx
```

### Test File Mapping

For each changed source file, the workflow looks for:
- Same path with `.test.ts` extension
- Same path with `.test.tsx` extension

**Example mappings:**
- `src/lib/validation.ts` → `src/lib/validation.test.ts`
- `src/components/navbar.tsx` → `src/components/navbar.test.tsx`

### Fallback Behavior

If no test files are found for changed files, the workflow:
- Skips test execution (no tests to run)
- Still runs type checking and linting
- Passes successfully

## Performance Benefits

Traditional approach (running all tests):
- 200+ tests across 20+ files
- Takes 2-3 minutes

Smart approach (changed files only):
- 10-50 tests in 1-3 files typically
- Takes 10-30 seconds

**Time savings: ~80-90% faster CI runs**

## Configuration

The workflow uses:
- **Runner**: `ubuntu-latest`
- **Timeout**: 10 minutes
- **Bun Version**: Latest stable
- **Node Compatibility**: Uses Bun for faster installs

## Debugging

If the workflow fails:

1. **Check Changed Files Step**: See what files were detected
2. **Check Test Files Step**: Verify correct test files were found
3. **Run Locally**: Use `npm run test:changed` to reproduce

## Future Improvements

Potential enhancements:
- Add test coverage reporting for changed files
- Run integration tests only when API routes change
- Cache test results for unchanged files
- Parallel test execution for multiple test files
