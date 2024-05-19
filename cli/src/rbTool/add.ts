import { existsSync, appendFileSync, writeFileSync } from 'node:fs'
import { EOL } from 'node:os'

const _addRB = (filePath, content: string) => {
  const date = new Date();
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const text = `${time}::${content}`;

  try {
    if (existsSync(filePath)) {
      appendFileSync(filePath, `${EOL}${text}`);
    } else {
      writeFileSync(filePath, text);
    }
  } catch (err) {
    throw new Error(`>> Failed to add <<\n${err}\nEND__: >> Failed to add <<`);
  }
}


export { _addRB }
