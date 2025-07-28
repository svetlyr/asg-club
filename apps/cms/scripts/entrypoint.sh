#!/bin/sh

set -e

bun run --filter=cms migrate

exec "$@"
