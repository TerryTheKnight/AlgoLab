
import SortingLab from "./features/sorting/SortingLab";
import GraphLab from "./features/graph/GraphLab";
import ComplexityLab from "./features/complexity/ComplexityLab";
import ExperimentsLab from "./features/complexity/ExperimentsLab";
import AlgorithmLibrary from "./features/library/AlgorithmLibrary";
import StructuresLab from "./features/structures/StructuresLab";
import SearchLab from "./features/search/SearchLab";
import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import { motion } from "motion/react";
import {
  Network,
  Search,
  Plus,
  ArrowUpRight,
  Play,
  Clock3,
  Layers3,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const algorithms = [
  {
    name: "Merge Sort",
    category: "DIVIDE AND CONQUER",
    description: "Understand divide and conquer through interactive execution.",
    complexity: "O(n log n)",
    color: "purple",
    page: "Sorting Lab",
  },
  {
    name: "Dijkstra's Algorithm",
    category: "GRAPH ALGORITHMS",
    description: "Discover shortest paths through weighted graphs.",
    complexity: "O((V+E) log V)",
    color: "blue",
    page: "Graph Lab",
  },
  {
    name: "Binary Search",
    category: "SEARCHING",
    description: "Explore efficient searching through repeated division.",
    complexity: "O(log n)",
    color: "cyan",
    page: "Search Lab",
  },
];

function AlgorithmCard({ algorithm, index, onOpen }: {
  algorithm: typeof algorithms[number];
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.article
      className={`algorithm-card ${algorithm.color}`}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="card-top">
        <span className="category">{algorithm.category}</span>
        <ArrowUpRight size={19} />
      </div>

      <div className="algorithm-symbol">
        <Layers3 size={29} />
      </div>

      <h3>{algorithm.name}</h3>
      <p>{algorithm.description}</p>

      <div className="card-footer">
        <span>TIME COMPLEXITY</span>
        <strong>{algorithm.complexity}</strong>
      </div>
    </motion.article>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  return (
    <div className="app-shell">
      <Sidebar 
      activePage={activePage}
      onNavigate={setActivePage}
      />

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            WORKSPACE <ChevronRight size={14} /> {activePage.toUpperCase()}
          </div>

          <div className="topbar-actions">
            <button className="icon-button" aria-label="Open Search Lab" onClick={() => setActivePage("Search Lab")}><Search /></button>
            <div className="avatar">T</div>
          </div>
        </header>

        {activePage === "Sorting Lab" ? (
          <SortingLab />
        ) : activePage === "Graph Lab" ? (
          <GraphLab />
        ) : activePage === "Complexity Lab" ? (
          <ComplexityLab />
        ) : activePage === "Experiments" ? (
          <ExperimentsLab />
        ) : activePage === "Algorithm Library" ? (
          <AlgorithmLibrary onNavigate={setActivePage} />
        ) : activePage === "Structures Lab" ? (
          <StructuresLab />
        ) : activePage === "Search Lab" ? (
          <SearchLab />
        ) : (
          <>
        

        <motion.section
          className="welcome-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="welcome-copy">
            <div className="eyebrow">
              <Sparkles size={14} /> THE ALGORITHM TEACHING STUDIO
            </div>

            <h1>
              Understand
              <br />
              <span>the algorithm.</span>
            </h1>

            <p>
              Explore algorithms through interactive visualizations,
              computational analysis, and hands-on experimentation.
            </p>

            <button className="primary-button" onClick={() => setActivePage("Algorithm Library")}>
              <Plus size={18} />
              Explore algorithms
            </button>
          </div>

          <div className="hero-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="hero-core">
              <Network size={55} strokeWidth={1.2} />
            </div>
            <div className="floating-node node-one" />
            <div className="floating-node node-two" />
            <div className="floating-node node-three" />
            <div className="hero-caption">
              <span>VISUAL THINKING</span>
              <strong>01 / EXPLORE</strong>
            </div>
          </div>
        </motion.section>

        <section className="section-heading">
          <div>
            <span className="section-eyebrow">YOUR TEACHING WORKSPACE</span>
            <h2>Explore algorithms</h2>
            <p>Choose a concept and bring it to life.</p>
          </div>

          <button className="text-button" onClick={() => setActivePage("Algorithm Library")}>
            View library <ArrowUpRight size={16} />
          </button>
        </section>

        <section className="algorithm-grid">
          {algorithms.map((algorithm, index) => (
            <AlgorithmCard
              key={algorithm.name}
              algorithm={algorithm}
              index={index}
              onOpen={() => setActivePage(algorithm.page)}
            />
          ))}
        </section>

        <section className="section-heading recent-heading">
          <div>
            <span className="section-eyebrow">CONTINUE TEACHING</span>
            <h2>Teaching workspace</h2>
            <p>Your next demonstration starts here.</p>
          </div>
        </section>

        <motion.div
          className="workspace-card"
          whileHover={{ borderColor: "rgba(166, 130, 255, 0.5)" }}
        >
          <div className="workspace-icon">
            <Play size={24} />
          </div>

          <div className="workspace-info">
            <h3>Visualization Studio</h3>
            <p>Launch an interactive algorithm demonstration.</p>
          </div>

          <div className="workspace-meta">
            <Clock3 size={15} />
            READY TO LAUNCH
          </div>

          <button className="launch-button" onClick={() => setActivePage("Sorting Lab")}>
            Open studio <ArrowUpRight size={17} />
          </button>
        </motion.div>

        <footer className="footer">
          ALGOLAB <span>·</span> UNDERSTAND. VISUALIZE. ANALYZE. OPTIMIZE.
        </footer> 
          </>
        )}
      </main>
    </div>
  );
}

export default App;
