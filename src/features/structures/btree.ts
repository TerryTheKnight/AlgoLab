export type BTreeNode = {
  keys: number[];
  children: BTreeNode[];
  leaf: boolean;
};

function cloneNode(node: BTreeNode): BTreeNode {
  return {
    keys: [...node.keys],
    leaf: node.leaf,
    children: node.children.map(cloneNode),
  };
}

function splitChild(parent: BTreeNode, childIndex: number) {
  const child = parent.children[childIndex];
  const right: BTreeNode = {
    keys: child.keys.splice(2),
    children: child.leaf ? [] : child.children.splice(2),
    leaf: child.leaf,
  };
  const median = child.keys.pop()!;
  parent.keys.splice(childIndex, 0, median);
  parent.children.splice(childIndex + 1, 0, right);
}

function insertNonFull(node: BTreeNode, value: number) {
  let childIndex = node.keys.length - 1;
  if (node.leaf) {
    while (childIndex >= 0 && value < node.keys[childIndex]) childIndex -= 1;
    node.keys.splice(childIndex + 1, 0, value);
    return;
  }

  while (childIndex >= 0 && value < node.keys[childIndex]) childIndex -= 1;
  childIndex += 1;
  if (node.children[childIndex].keys.length === 3) {
    splitChild(node, childIndex);
    if (value > node.keys[childIndex]) childIndex += 1;
  }
  insertNonFull(node.children[childIndex], value);
}

export function searchBTree(root: BTreeNode | null, value: number): boolean {
  let current = root;
  while (current) {
    let index = 0;
    while (index < current.keys.length && value > current.keys[index]) index += 1;
    if (current.keys[index] === value) return true;
    if (current.leaf) return false;
    current = current.children[index];
  }
  return false;
}

export function insertBTree(root: BTreeNode | null, value: number): BTreeNode {
  if (!Number.isFinite(value)) throw new Error("B-tree keys must be finite numbers.");
  const nextRoot = root ? cloneNode(root) : { keys: [], children: [], leaf: true };
  if (searchBTree(nextRoot, value)) return nextRoot;

  if (nextRoot.keys.length === 3) {
    const newRoot: BTreeNode = { keys: [], children: [nextRoot], leaf: false };
    splitChild(newRoot, 0);
    insertNonFull(newRoot, value);
    return newRoot;
  }
  insertNonFull(nextRoot, value);
  return nextRoot;
}

export function inorderBTree(root: BTreeNode | null): number[] {
  if (!root) return [];
  if (root.leaf) return [...root.keys];
  const values: number[] = [];
  for (let index = 0; index < root.keys.length; index += 1) {
    values.push(...inorderBTree(root.children[index]), root.keys[index]);
  }
  values.push(...inorderBTree(root.children[root.keys.length]));
  return values;
}

export function btreeLevels(root: BTreeNode | null): BTreeNode[][] {
  if (!root) return [];
  const levels: BTreeNode[][] = [];
  let currentLevel = [root];
  while (currentLevel.length > 0) {
    levels.push(currentLevel);
    currentLevel = currentLevel.flatMap((node) => node.children);
  }
  return levels;
}
