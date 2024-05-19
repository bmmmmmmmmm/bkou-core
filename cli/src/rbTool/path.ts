import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const envPath = join(__dirname, 'ENV');

const _getPath = () => {
  try {
    const readPathRes = readFileSync(join(envPath, 'path'), 'utf8').trim();
    const date = new Date();
    const today = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const filePath = join(readPathRes, `${today}.md`);
    return filePath;
  } catch (err) {
    throw new Error(`>> Failed to get path <<\n${err}\nEND__: >> Failed to get path <<`);
  }
};

const _setPath = (newPath: string) => {
  try {
    mkdirSync(dirname(join(envPath, 'path')), { recursive: true });
    writeFileSync(join(envPath, 'path'), newPath);
  } catch (err) {
    throw new Error(`>> Failed to set path <<\n${err}\nEND__: >> Failed to set path <<`);
  }
};

export { _getPath, _setPath }
