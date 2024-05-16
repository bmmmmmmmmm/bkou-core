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
      return [true, { result, count }]
    } catch (err) {
      return [false, err]
    }
  } else {
    return [false, 'No file for today']
  }
};

export { _listRB }
