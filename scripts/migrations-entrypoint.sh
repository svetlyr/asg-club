#!/bin/sh
set -e

echo "Starting database migrations for target: ${MIGRATION_TARGET:-all}"

case "$MIGRATION_TARGET" in
  "cms")
    echo "Running Payload CMS migrations"
    bun run --filter=cms migrate
    ;;

  "server")
    echo "Running Elysia Server migrations"
    bun run --filter=server db:migrate
    ;;

  "all")
    echo "Running all migrations..."
    echo "Running Payload CMS migrations"
    bun run --filter=cms payload:migrate
    echo "Running Elysia Server migrations"
    bun run --filter=server db:migrate
    ;;

  *)
    echo "Error: Invalid MIGRATION_TARGET specified: '$MIGRATION_TARGET'."
    echo "Valid options are 'cms', 'server', or 'all'."
    exit 1
    ;;
esac

echo "All specified migrations completed successfully!"
