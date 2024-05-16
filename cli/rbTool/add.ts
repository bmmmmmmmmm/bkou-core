import { existsSync, appendFileSync, writeFileSync } from 'node:fs'
import { EOL } from 'node:os'

const _addRB = async (filePath, content: string) => {
  const date = new Date();
  const text = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}::${content}${EOL}`;

  if (existsSync(filePath)) {
    appendFileSync(filePath, text);
  } else {
    writeFileSync(filePath, text);
  }
}


export { _addRB }
