import { useMemo, useState } from "react";
import {
  inorderValues,
  insertAvl,
  insertBst,
  positionTree,
  searchTree,
  treeConnections,
} from "./trees";
import type { TreeNode } from "./trees";
import { btreeLevels, inorderBTree, insertBTree, searchBTree } from "./btree";
import type { BTreeNode } from "./btree";

type StructureMode = "stack" | "queue" | "linked-list" | "bst" | "avl" | "btree";

const modeLabels: Record<StructureMode, string> = {
  stack: "Stack",
  queue: "Queue",
  "linked-list": "Linked list",
  bst: "Binary search tree",
  avl: "AVL tree",
  btree: "B-tree",
};

function readValue(input: string) {
  const value = Number(input);
  return Number.isFinite(value) ? value : null;
}

function StructuresLab() {
  const [mode, setMode] = useState<StructureMode>("stack");
  const [stack, setStack] = useState([14, 9, 22]);
  const [queue, setQueue] = useState([5, 12, 18]);
  const [linkedList, setLinkedList] = useState([8, 15, 23]);
  const [bstValues, setBstValues] = useState([20, 10, 35, 5, 14, 30, 42]);
  const [avlValues, setAvlValues] = useState([20, 10, 35, 5, 14, 30, 42]);
  const [btreeValues, setBtreeValues] = useState([18, 7, 25, 3, 11, 20, 31]);
  const [input, setInput] = useState("17");
  const [message, setMessage] = useState("Choose an operation to see how the structure changes.");
  const [searchedValue, setSearchedValue] = useState<number | null>(null);
  const [traversal, setTraversal] = useState<number[]>([]);

  const tree = useMemo(() => {
    if (mode === "btree") return null;
    const values = mode === "avl" ? avlValues : bstValues;
    const insert = mode === "avl" ? insertAvl : insertBst;
    return values.reduce<TreeNode | null>((root, value) => insert(root, value), null);
  }, [avlValues, bstValues, mode]);
  const btree = useMemo(
    () => btreeValues.reduce<BTreeNode | null>((root, value) => insertBTree(root, value), null),
    [btreeValues],
  );
  const treeLayout = positionTree(tree);
  const positionsByValue = new Map(treeLayout.nodes.map((node) => [node.value, node]));
  const treeOrder = mode === "btree" ? inorderBTree(btree) : inorderValues(tree);

  function applyStackAction(action: "push" | "pop") {
    if (action === "pop") {
      if (stack.length === 0) return setMessage("The stack is empty; there is nothing to pop.");
      const removed = stack[stack.length - 1];
      setStack((values) => values.slice(0, -1));
      setMessage(`Pop removes ${removed} from the top. The last value added is removed first.`);
      return;
    }
    const value = readValue(input);
    if (value === null) return setMessage("Enter a finite number before pushing.");
    if (stack.length >= 12) return setMessage("The stack view supports up to 12 values.");
    setStack((values) => [...values, value]);
    setMessage(`Push adds ${value} to the top of the stack.`);
  }

  function applyQueueAction(action: "enqueue" | "dequeue") {
    if (action === "dequeue") {
      if (queue.length === 0) return setMessage("The queue is empty; there is nothing to dequeue.");
      const removed = queue[0];
      setQueue((values) => values.slice(1));
      setMessage(`Dequeue removes ${removed} from the front. The first value added leaves first.`);
      return;
    }
    const value = readValue(input);
    if (value === null) return setMessage("Enter a finite number before enqueuing.");
    if (queue.length >= 12) return setMessage("The queue view supports up to 12 values.");
    setQueue((values) => [...values, value]);
    setMessage(`Enqueue adds ${value} at the back of the queue.`);
  }

  function applyListAction(action: "prepend" | "append" | "remove") {
    const value = readValue(input);
    if (value === null) return setMessage("Enter a finite number for the list operation.");
    if (action === "remove") {
      if (!linkedList.includes(value)) return setMessage(`${value} is not in the linked list.`);
      setLinkedList((values) => {
        const index = values.indexOf(value);
        return [...values.slice(0, index), ...values.slice(index + 1)];
      });
      setMessage(`Remove the first node containing ${value} and link its neighbors together.`);
      return;
    }
    if (linkedList.length >= 12) return setMessage("The linked-list view supports up to 12 nodes.");
    setLinkedList((values) => action === "prepend" ? [value, ...values] : [...values, value]);
    setMessage(`${action === "prepend" ? "Prepend" : "Append"} creates a node containing ${value} and updates the list links.`);
  }

  function insertTreeValue() {
    const value = readValue(input);
    if (value === null) return setMessage("Enter a finite number to insert.");
    if (treeValues().includes(value)) return setMessage(`${value} is already in this tree; duplicate values are ignored.`);
    if (treeOrder.length >= 12) return setMessage("The tree view supports up to 12 nodes.");
    if (mode === "avl") setAvlValues((values) => [...values, value]);
    else if (mode === "btree") setBtreeValues((values) => [...values, value]);
    else setBstValues((values) => [...values, value]);
    setTraversal([]);
    setMessage(mode === "avl"
      ? `Insert ${value}; the AVL tree rebalances with rotations when needed.`
      : mode === "btree"
        ? `Insert ${value}; a full B-tree node splits and promotes its median key.`
        : `Insert ${value} by following smaller values left and larger values right.`);
  }

  function treeValues() {
    if (mode === "avl") return avlValues;
    if (mode === "btree") return btreeValues;
    return bstValues;
  }

  function handleSearch() {
    const value = readValue(input);
    if (value === null) return setMessage("Enter a finite number to search for.");
    const found = mode === "btree" ? searchBTree(btree, value) : searchTree(tree, value);
    setSearchedValue(found ? value : null);
    setMessage(found ? `Found ${value} by following the tree ordering.` : `${value} is not present in the tree.`);
  }

  function handleTraversal() {
    const order = treeOrder;
    setTraversal(order);
    setMessage(`In-order traversal visits values in sorted order: ${order.join(" → ") || "empty tree"}.`);
  }

  function resetSelectedStructure() {
    if (mode === "stack") setStack([]);
    if (mode === "queue") setQueue([]);
    if (mode === "linked-list") setLinkedList([]);
    if (mode === "bst") setBstValues([]);
    if (mode === "avl") setAvlValues([]);
    if (mode === "btree") setBtreeValues([]);
    setTraversal([]);
    setSearchedValue(null);
    setMessage(`${modeLabels[mode]} cleared.`);
  }

  function changeMode(nextMode: StructureMode) {
    setMode(nextMode);
    setTraversal([]);
    setSearchedValue(null);
    setMessage(`${modeLabels[nextMode]} selected. Choose an operation to begin.`);
  }

  function handleEnter() {
    if (mode === "bst" || mode === "avl") {
      insertTreeValue();
    } else if (mode === "stack") {
      applyStackAction("push");
    } else if (mode === "queue") {
      applyQueueAction("enqueue");
    } else {
      applyListAction("append");
    }
  }

  return (
    <div className="structures-lab">
      <header className="structures-heading">
        <span className="section-eyebrow">DATA STRUCTURE PLAYGROUND</span>
        <h1>Structures Lab</h1>
        <p>Perform operations and inspect how each structure organizes its values.</p>
      </header>

      <div className="structure-mode-tabs" role="tablist" aria-label="Data structure">
        {(Object.keys(modeLabels) as StructureMode[]).map((item) => (
          <button key={item} role="tab" aria-selected={mode === item} className={mode === item ? "active" : ""} onClick={() => changeMode(item)}>{modeLabels[item]}</button>
        ))}
      </div>

      <section className="structure-workspace">
        <div className="structure-control-row">
          <label>
            Value
            <input type="number" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") handleEnter(); }} />
          </label>
          {mode === "stack" && <><button onClick={() => applyStackAction("push")}>Push</button><button onClick={() => applyStackAction("pop")}>Pop</button></>}
          {mode === "queue" && <><button onClick={() => applyQueueAction("enqueue")}>Enqueue</button><button onClick={() => applyQueueAction("dequeue")}>Dequeue</button></>}
          {mode === "linked-list" && <><button onClick={() => applyListAction("prepend")}>Add at head</button><button onClick={() => applyListAction("append")}>Add at tail</button><button onClick={() => applyListAction("remove")}>Remove value</button></>}
          {(mode === "bst" || mode === "avl") && <><button onClick={insertTreeValue}>Insert</button><button onClick={handleSearch}>Search</button><button onClick={handleTraversal}>In-order traversal</button></>}
          <button className="structure-clear-button" onClick={resetSelectedStructure}>Clear</button>
        </div>

        <p className="structure-message" aria-live="polite">{message}</p>

        <div className="structure-visual" aria-label={`${modeLabels[mode]} visualization`}>
          {mode === "stack" && (
            <div className="stack-visual">
              <span className="structure-end-label">TOP</span>
              {[...stack].reverse().map((value, index) => (
                <div className={`stack-block ${index === 0 ? "top" : ""}`} key={`${index}-${value}`}>{value}</div>
              ))}
              {stack.length === 0 && <span className="structure-empty">Stack is empty</span>}
              <span className="structure-end-label">BOTTOM</span>
            </div>
          )}

          {mode === "queue" && (
            <div className="queue-visual">
              <span className="structure-end-label">FRONT</span>
              <div className="queue-track">
                {queue.map((value, index) => <div className={`queue-block ${index === 0 ? "front" : ""}`} key={`${index}-${value}`}>{value}</div>)}
                {queue.length === 0 && <span className="structure-empty">Queue is empty</span>}
              </div>
              <span className="structure-end-label">BACK</span>
            </div>
          )}

          {mode === "linked-list" && (
            <div className="linked-list-visual">
              <span className="structure-end-label">HEAD</span>
              {linkedList.map((value, index) => (
                <div className="linked-list-entry" key={`${index}-${value}`}>
                  <div className="linked-list-node"><strong>{value}</strong><span>next →</span></div>
                  <span className="linked-list-arrow">→</span>
                </div>
              ))}
              <span className="linked-list-null">{linkedList.length === 0 ? "empty" : "null"}</span>
            </div>
          )}

          {(mode === "bst" || mode === "avl") && (
            <div className="tree-visual-wrap">
              {tree ? (
                <svg className="structure-tree-svg" viewBox={`0 0 ${treeLayout.width} ${treeLayout.height}`} role="img" aria-label={`${modeLabels[mode]} tree diagram`}>
                  {treeConnections(tree).map((connection) => {
                    const from = positionsByValue.get(connection.from)!;
                    const to = positionsByValue.get(connection.to)!;
                    return <line className="structure-tree-edge" key={`${connection.from}-${connection.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
                  })}
                  {treeLayout.nodes.map((node) => (
                    <g className={`structure-tree-node ${searchedValue === node.value ? "found" : ""} ${traversal.includes(node.value) ? "traversed" : ""}`} key={node.value}>
                      <circle cx={node.x} cy={node.y} r="23" />
                      <text x={node.x} y={node.y + 5} textAnchor="middle">{node.value}</text>
                    </g>
                  ))}
                </svg>
              ) : <span className="structure-empty">Tree is empty</span>}
              {mode === "avl" && <span className="tree-note">AVL balance factor at every node stays between −1 and 1.</span>}
            </div>
          )}

          {mode === "btree" && (
            <div className="btree-visual-wrap">
              {btree ? (
                btreeLevels(btree).map((level, depth) => (
                  <div className="btree-level" key={depth}>
                    {level.map((node, index) => (
                      <div className="btree-node" key={`${depth}-${index}`}>
                        {node.keys.map((key) => (
                          <span className={`${searchedValue === key ? "found" : ""} ${traversal.includes(key) ? "traversed" : ""}`} key={key}>{key}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                ))
              ) : <span className="structure-empty">Tree is empty</span>}
              <span className="tree-note">B-tree with minimum degree 2: each node holds up to three sorted keys; full nodes split during insertion.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StructuresLab;
