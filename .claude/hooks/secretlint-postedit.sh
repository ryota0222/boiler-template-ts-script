#!/bin/bash
set -o pipefail

INPUT=$(cat)
FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty')

[ -z "$FILE_PATH" ] && exit 0
[ -f "$FILE_PATH" ] || exit 0

cd "$CLAUDE_PROJECT_DIR" || exit 0

if [ ! -x node_modules/.bin/secretlint ]; then
  echo "secretlint が未インストールのため、シークレット検査をスキップしました。'npm install' を実行してください。" >&2
  exit 0
fi

RESULT=$(node_modules/.bin/secretlint "$FILE_PATH" 2>&1)
STATUS=$?

if [ "$STATUS" -ne 0 ]; then
  {
    echo "$FILE_PATH にシークレットの可能性がある文字列が検出されました。検出された値を <REDACTED> などのプレースホルダに置換してください。"
    printf '%s\n' "$RESULT"
  } >&2
  exit 2
fi

exit 0
