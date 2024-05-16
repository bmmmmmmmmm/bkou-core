import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const envPath = join(__dirname, 'ENV');

const _getPath = () => {
  try {
    return readFileSync(join(envPath, 'path'), 'utf8').trim();
  } catch (err) {
    throw new Error(`>> Failed to get path <<\n${err}\n>> Failed to get path <<`);
  }
};

const _setPath = (newPath: string) => {
  try {
    mkdirSync(dirname(join(envPath, 'path')), { recursive: true });
    writeFileSync(join(envPath, 'path'), newPath);
  } catch (err) {
    throw new Error(`>> Failed to set path <<\n${err}\n>> Failed to set path <<`);
  }
};

export { _getPath, _setPath }
