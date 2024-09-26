/**
 * 判断是否为绝对路径
 * @deprecated TODO: 有待完善
 */
function isAbsolutePath(path) {
  // Unix/Linux 绝对路径
  const unixPattern = /^\/.*/; // 以 / 开头
  // Windows 绝对路径
  const windowsPattern = /^[a-zA-Z]:\\/; // 以驱动器字母和冒号开头
  return unixPattern.test(path) || windowsPattern.test(path);
}

/**
 * 判断是否为相对路径
 * @deprecated TODO: 有待完善
 */
function isRelativePath(path) {
    // Unix/Linux 相对路径
    const unixPattern = /^(?!\/)(?!$).+/; // 不以 / 开头且至少有一个字符
    // Windows 相对路径
    const windowsPattern = /^(?![a-zA-Z]:\\)(?!$).+/; // 不以驱动器字母和冒号开头且至少有一个字符
    return !isAbsolutePath(path) && (unixPattern.test(path) || windowsPattern.test(path));
}

const _pathTest = (str) => {
  console.log(str, '\n', isAbsolutePath(str), '\n', isRelativePath(str), '\n', isAbsolutePath(str) ? '绝对路径' : isRelativePath(str) ? '相对路径' : '不是路径');
}

const _ = () => {
  _pathTest('/home/user/file.txt');
  _pathTest('documents/file.txt');
  _pathTest('C:\\Users\\User\\file.txt');
  _pathTest('Documents\\file.txt');
  _pathTest('');
  _pathTest('/');
  _pathTest('.');
  _pathTest('..');
  _pathTest('folder/');
  _pathTest('C:\\');
  _pathTest('C:');
  _pathTest('\\\\server\\share');
  _pathTest('./file.txt');
  _pathTest('../file.txt');
}

export {
  isAbsolutePath,
  isRelativePath
};
