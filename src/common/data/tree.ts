import { getRandomInt } from './number';

type TreeNode = {
  val: any,
  children: TreeNode[] | null,
} | null;

const getRandomTree = (_depth?: number, _breadth?: number): TreeNode => {
  const depth = _depth || getRandomInt(1, 5);
  const breadth = _breadth || getRandomInt(1, 5);
  if (depth === 0) return null;
  const node: TreeNode = {
    val: getRandomInt(0, 10),
    children: null,
  }
  if (breadth > 0) {
    node.children = [];
    for (let i = 0; i < breadth; i++) {
      node.children.push(getRandomTree(depth - 1, breadth))
    }
  }
  return node;
}

//    A
// B  C  D
// EF GH IJ
//                A
// A              BCD
// AB             EFCD
// ABE            FCD
// ABEF           D
// ABEFC          GHD
// ABEFCG         HD
// ABEFCGH        D
// ABEFCGHD       IJ
// ABEFCGHDI      J
// ABEFCGHDIJ
const _DFS = (root: TreeNode, func: (node: TreeNode) => void) => {
  const stack: TreeNode[] = [root];
  let node: TreeNode = null;
  // eslint-disable-next-line no-cond-assign
  while (node = stack.shift()) {
    func(node)
    node.children && stack.unshift(...node.children)
  }
}

//    A
// B  C  D
// EF GH IJ
//                A
// A              BCD
// AB             CDEF
// ABC            DEFGH
// ABCD           EFGHIJ
// ABCDE          FGHIJ
// ABCDEF         GHIJ
// ABCDEFG        HIJ
// ABCDEFGH       IJ
// ABCDEFGHI      J
// ABCDEFGHIJ
const _BFS = (root: TreeNode, func: (node: TreeNode) => void) => {
  const queue: TreeNode[] = [root];
  let node: TreeNode = null;
  // eslint-disable-next-line no-cond-assign
  while (node = queue.shift()) {
    func(node);
    node.children && queue.push(...node.children)
  }
}

export {
  type TreeNode,
  getRandomTree,
}
