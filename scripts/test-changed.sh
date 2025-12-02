#!/bin/bash

# Script to test only files that have changed (simulates CI behavior locally)
# Usage: ./scripts/test-changed.sh [base-branch|--staged|--unstaged]
# Examples:
#   ./scripts/test-changed.sh              # Check unstaged changes (default)
#   ./scripts/test-changed.sh --staged     # Check staged changes only
#   ./scripts/test-changed.sh main         # Check all changes vs main branch

set -e

MODE="${1:---unstaged}"

# Determine which files to check based on mode
if [ "$MODE" = "--staged" ]; then
  echo "🔍 Finding staged files..."
  CHANGED_FILES=$(git diff --cached --name-only | grep -E '^src/.*\.(ts|tsx)$' | grep -v '\.test\.(ts|tsx)$' || true)
elif [ "$MODE" = "--unstaged" ]; then
  echo "🔍 Finding unstaged changes..."
  CHANGED_FILES=$(git diff --name-only | grep -E '^src/.*\.(ts|tsx)$' | grep -v '\.test\.(ts|tsx)$' || true)
  # Also check for untracked files in src/
  UNTRACKED=$(git ls-files --others --exclude-standard | grep -E '^src/.*\.(ts|tsx)$' | grep -v '\.test\.(ts|tsx)$' || true)
  if [ -n "$UNTRACKED" ]; then
    CHANGED_FILES="$CHANGED_FILES"$'\n'"$UNTRACKED"
  fi
else
  # Treat as branch name
  BASE_BRANCH="$MODE"
  echo "🔍 Finding changed files compared to $BASE_BRANCH..."
  CHANGED_FILES=$(git diff --name-only "$BASE_BRANCH"...HEAD | grep -E '^src/.*\.(ts|tsx)$' | grep -v '\.test\.(ts|tsx)$' || true)
fi

if [ -z "$CHANGED_FILES" ]; then
  echo "📭 No source files changed."
  echo "✅ Type checking..."
  npx tsc --noEmit
  echo "✨ All checks passed!"
  exit 0
fi

echo "📝 Changed source files:"
echo "$CHANGED_FILES" | sed 's/^/  - /'

TEST_FILES=""

# Find corresponding test files
for file in $CHANGED_FILES; do
  # Remove src/ prefix and extension
  base_path="${file#src/}"
  base_path="${base_path%.ts}"
  base_path="${base_path%.tsx}"

  # Check for corresponding test file
  test_file="src/${base_path}.test.ts"
  if [ -f "$test_file" ]; then
    TEST_FILES="$TEST_FILES $test_file"
  fi

  # Also check for .test.tsx
  test_file_tsx="src/${base_path}.test.tsx"
  if [ -f "$test_file_tsx" ]; then
    TEST_FILES="$TEST_FILES $test_file_tsx"
  fi
done

if [ -z "$TEST_FILES" ]; then
  echo "⚠️  No test files found for changed files"
  echo "✅ Type checking..."
  npx tsc --noEmit
  exit 0
fi

echo ""
echo "🧪 Running tests for changed files:"
echo "$TEST_FILES" | xargs -n1 | sed 's/^/  - /'
echo ""

# Run tests
bun test $TEST_FILES

echo ""
echo "✅ Type checking..."
npx tsc --noEmit

echo ""
echo "✨ All checks passed!"
