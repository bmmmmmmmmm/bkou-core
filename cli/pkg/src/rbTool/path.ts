import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { _isAbsolutePath } from '../../utils';

const ENV_PATH = join(__dirname, 'ENV');

const _getRbPathENV = () => {
  try {
    const rbPathENV = readFileSync(join(ENV_PATH, 'path'), 'utf8').trim();
    return rbPathENV
  } catch (err) {
    throw new Error(`>> Failed to get rbPath ENV <<\n${err}\nEND__: >> Failed to get rbPath ENV <<`);
  }
}

const _getRbPathTD = () => {
  try {
    const rbPathENV = _getRbPathENV();
    const date = new Date();
    const today = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const rbPathTD = join(rbPathENV, `${today}.md`);
    return rbPathTD;
  } catch (err) {
    throw new Error(`>> Failed to get rbPath TD <<\n${err}\nEND__: >> Failed to get rbPath TD <<`);
  }
};

const _setRbPathENV = (newPath: string) => {
  try {
    if (!_isAbsolutePath(newPath)) throw new Error(`'${newPath}' is not absolute path`);
    mkdirSync(dirname(join(ENV_PATH, 'path')), { recursive: true });
    writeFileSync(join(ENV_PATH, 'path'), newPath);
  } catch (err) {
    throw new Error(`>> Failed to set rbPath ENV <<\n${err}\nEND__: >> Failed to set rbPath ENV <<`);
  }
};

export { _getRbPathENV, _getRbPathTD, _setRbPathENV }
