import { join } from 'node:path';

import { _getPath, _setPath } from "./path";
import { _addRB } from "./add";
import { _listRB } from "./list";

const RB_PATH = _getPath()
const date = new Date();
const today = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
const filePath = join(RB_PATH, `${today}.md`);

const addRB = (content) => _addRB(filePath, content)
const listRB = () => _listRB(filePath)
const setPath = (path) => _setPath(path)

export {
  setPath,
  addRB,
  listRB
}
