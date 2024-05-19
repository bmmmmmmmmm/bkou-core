import { _log } from '../utils';
import { _getPath, _setPath } from "./path";
import { _addRB } from "./add";
import { _listRB } from "./list";

const addRB = (content) => {
  try {
    const filePath = _getPath()
    _addRB(filePath, content)
    _log(`RB added => ${content}`)
  } catch (err) {
    _log(err, 'red')
  }
}
const listRB = () => {
  try {
    const filePath = _getPath()
    const { result, lineCount, wordCount } = _listRB(filePath)
    _log([...result.map(([time, row]) => `${time} => ${row}`), '================', `Total lines: ${lineCount}`, `Total words: ${wordCount}`])
  } catch (err) {
    _log(err, 'red')
  }
}
const setPath = (path) => {
  try {
    _setPath(path)
    _log(`Path set to ${path}`)
  } catch (err) {
    _log(err, 'red')
  }
}

export {
  setPath,
  addRB,
  listRB
}
