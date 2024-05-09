import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const envPath = join(__dirname, 'ENV');
const DEFAULT_PATH = ''

const _getPath = () => {
  try {
    return readFileSync(join(envPath, 'path'), 'utf8').trim();
  } catch (err) {
    console.error(err);
    return DEFAULT_PATH;
  }
};

const _setPath = (newPath: string) => {
  try {
    writeFileSync(join(envPath, 'path'), newPath);
  } catch (err) {
    console.error(err);
  }
};

export { _getPath, _setPath }
