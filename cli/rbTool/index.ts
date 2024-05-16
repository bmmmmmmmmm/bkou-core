import { join } from 'node:path';

import { _log } from '../utils';
import { _getPath, _setPath } from "./path";
import { _addRB } from "./add";
import { _listRB } from "./list";

const RB_PATH = _getPath()
const date = new Date();
const today = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
const filePath = join(RB_PATH, `${today}.md`);

const addRB = (content) => {
  try {
    _addRB(filePath, content)
    _log(`Added to ${today} => ${content}`)
  } catch (err) {
    _log(err, 'red')
  }
}
const listRB = () => {
  try {
    const { result, count } = _listRB(filePath)
    _log([result, `Total words: ${count}`])
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
