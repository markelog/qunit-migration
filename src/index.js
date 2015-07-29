import migration from './migration';

import {
  readFileSync as read,
  writeFileSync as write
} from 'fs';

import path from 'path';

import glob from 'glob';

export function paths(ps) {
  let result = [];

  ps.forEach((p) => {
    p = path.join(process.cwd(), p);

    glob.sync(p).forEach((res) => result.push(res));
  });

  return result;
}

export function migrate(ps) {
  ps = Array.isArray(ps) ? ps : [ps];

  paths(ps).forEach((p) => {
    write(
      p,
      migration(
        read(p, 'utf-8')
      )
    );
  });
}
