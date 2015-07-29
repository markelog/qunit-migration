import migration from './migration';

import {
  readFileSync as read,
  writeFileSync as write
} from 'fs';

import path from 'path';

export function paths(ps) {
  return ps.map((p) => {
    return path.join(__dirname, '..', p);
  });
}

export default function reader(ps) {
  paths(ps).forEach(function(p) {
    write(
      p,
      migration(
        read(p, 'utf-8')
      )
    );
  });
}
