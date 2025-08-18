import * as migration_20250809_221504 from './20250809_221504';

export const migrations = [
  {
    up: migration_20250809_221504.up,
    down: migration_20250809_221504.down,
    name: '20250809_221504'
  },
];
