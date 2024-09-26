import { existsSync, readFileSync } from 'node:fs'
import { EOL } from 'node:os'

import { _log } from '../../utils'
import { _countWords } from '../countWords'

const _listRB = (filePath) => {
  if (!filePath.trim()) throw new Error('>> Failed to list <<\nPath not set\nEND__: >> Failed to list <<');
  if (existsSync(filePath)) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const lines = content.split(/\r?\n/g)
      const result = lines.map(row => {
        const rowArray = row.split(/\:\:/g)
        if (rowArray.length === 1) {
          return ['__:__', rowArray[0]]
        }
        return [rowArray[0], rowArray.slice(1).join('::')]
      })
      const lineCount = result.length
      const wordCount = _countWords(result.map(arr => arr.slice(1).join(' ')).join(' '))
      return { result, lineCount, wordCount }
    } catch (err) {
      throw new Error(`>> Failed to list <<\n${err}\nEND__: >> Failed to list <<`);
    }
  } else {
    throw new Error('>> Failed to list <<\nNo file for today\nEND__: >> Failed to list <<')
  }
};

export { _listRB }
