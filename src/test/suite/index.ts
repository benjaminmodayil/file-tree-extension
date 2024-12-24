import * as path from 'path';
import Mocha = require('mocha');
import glob = require('glob');

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 10000, // Increased timeout for filesystem operations
  });

  const testsRoot = path.resolve(__dirname, '.');

  return new Promise((resolve, reject) => {
    glob('**/**.test.js', { cwd: testsRoot }, (err: Error | null, files: string[]) => {
      if (err) {
        return reject(err);
      }

      files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        mocha.run((failures: number) => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`));
          } else {
            resolve();
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  });
}
