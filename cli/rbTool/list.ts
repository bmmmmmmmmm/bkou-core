import { existsSync, readFileSync } from 'node:fs'
import { EOL } from 'node:os'

import { _log } from '../utils'
import { countWords } from '../countWords'

const _listRB = (filePath) => {
  if (existsSync(filePath)) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const result = lines.map(line => line.split('::')[1]).join(EOL);
      const count = countWords(result)
      return { result, count }
    } catch (err) {
      throw new Error(`>> Failed to list <<\n${err}\n>> Failed to list <<`);
    }
  } else {
    throw new Error('>> Failed to list <<\nNo file for today\n>> Failed to list <<')
  }
};

export { _listRB }
