export type TreeNode = {
  value: number;
  height: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

export type PositionedTreeNode = {
  value: number;
  x: number;
  y: number;
};

export type TreeConnection = {
  from: number;
  to: number;
};

function createNode(value: number): TreeNode {
  return { value, height: 1, left: null, right: null };
}

function height(node: TreeNode | null) {
  return node?.height ?? 0;
}

function updateHeight(node: TreeNode) {
  node.height = 1 + Math.max(height(node.left), height(node.right));
  return node;
}

export function insertBst(root: TreeNode | null, value: number): TreeNode {
  if (!root) return createNode(value);
  if (value < root.value) root.left = insertBst(root.left, value);
  else if (value > root.value) root.right = insertBst(root.right, value);
  return updateHeight(root);
}

function rotateRight(root: TreeNode): TreeNode {
  const nextRoot = root.left!;
  const transferred = nextRoot.right;
  nextRoot.right = root;
  root.left = transferred;
  updateHeight(root);
  return updateHeight(nextRoot);
}

function rotateLeft(root: TreeNode): TreeNode {
  const nextRoot = root.right!;
  const transferred = nextRoot.left;
  nextRoot.left = root;
  root.right = transferred;
  updateHeight(root);
  return updateHeight(nextRoot);
}

export function insertAvl(root: TreeNode | null, value: number): TreeNode {
  if (!root) return createNode(value);
  if (value < root.value) root.left = insertAvl(root.left, value);
  else if (value > root.value) root.right = insertAvl(root.right, value);
  else return root;

  updateHeight(root);
  const balance = height(root.left) - height(root.right);

  if (balance > 1 && value < root.left!.value) return rotateRight(root);
  if (balance < -1 && value > root.right!.value) return rotateLeft(root);
  if (balance > 1 && value > root.left!.value) {
    root.left = rotateLeft(root.left!);
    return rotateRight(root);
  }
  if (balance < -1 && value < root.right!.value) {
    root.right = rotateRight(root.right!);
    return rotateLeft(root);
  }
  return root;
}

export function inorderValues(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...inorderValues(root.left), root.value, ...inorderValues(root.right)];
}

export function searchTree(root: TreeNode | null, target: number): boolean {
  let current = root;
  while (current) {
    if (current.value === target) return true;
    current = target < current.value ? current.left : current.right;
  }
  return false;
}

export function positionTree(root: TreeNode | null) {
  const nodes: PositionedTreeNode[] = [];
  let inorderIndex = 0;

  function visit(node: TreeNode | null, depth: number) {
    if (!node) return;
    visit(node.left, depth + 1);
    nodes.push({ value: node.value, x: 60 + inorderIndex * 90, y: 45 + depth * 78 });
    inorderIndex += 1;
    visit(node.right, depth + 1);
  }

  visit(root, 0);
  return {
    nodes,
    width: Math.max(300, 120 + Math.max(0, nodes.length - 1) * 90),
    height: Math.max(150, 100 + Math.max(0, ...nodes.map((node) => node.y))),
  };
}

export function treeConnections(root: TreeNode | null): TreeConnection[] {
  const connections: TreeConnection[] = [];
  function visit(node: TreeNode | null) {
    if (!node) return;
    if (node.left) connections.push({ from: node.value, to: node.left.value });
    if (node.right) connections.push({ from: node.value, to: node.right.value });
    visit(node.left);
    visit(node.right);
  }
  visit(root);
  return connections;
}
