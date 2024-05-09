import { existsSync, readFileSync } from 'node:fs'
import { countWords } from '../countWords';

const _listRB = (filePath) => {
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const result = lines.map(line => line.split('::')[1]).join('\n');
    const count = countWords(result)
    console.log(`${result}\n============\nTotal words: ${count}`)
  } else {
    console.log('No file for today');
  }
};

export { _listRB }
