import { existsSync, readFileSync } from 'node:fs'
import { EOL } from 'node:os'

import { _log } from '../utils'
import { _countWords } from '../countWords'

const _listRB = (filePath) => {
  if (existsSync(filePath)) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const result = lines.map(line => line.split('::')[1]).join(EOL);
      const count = _countWords(result)
      return { result, count }
    } catch (err) {
      throw new Error(`>> Failed to list <<\n${err}\nEND__: >> Failed to list <<`);
    }
  } else {
    throw new Error('>> Failed to list <<\nNo file for today\nEND__: >> Failed to list <<')
  }
};

export { _listRB }
