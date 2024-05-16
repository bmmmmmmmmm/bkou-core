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
  const [ success, info ] = _addRB(filePath, content)
  if (success) {
    _log(`${info} :: Added to ${today} => ${content}`)
  } else {
    _log(['Failed to add', info], 'red')
  }
}
const listRB = () => {
  const [ success, info ] = _listRB(filePath)
  if (success) {
    const { result, count } = info
    _log([result, `Total words: ${count}`])
  } else {
    _log(['Failed to list', info], 'red')
  }
}
const setPath = (path) => {
  const [ success, info ] = _setPath(path)
  if (success) {
    _log(`Path set to ${info}`)
  } else {
    _log(['Failed to set path', info], 'red')
  }
}

export {
  setPath,
  addRB,
  listRB
}
