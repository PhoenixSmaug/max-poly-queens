import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import highsLoader from 'highs';
import './App.css';

const PALETTE = [
  { name: 'Sky Blue', hex: '#bae6fd', dark: '#0284c7' },
  { name: 'Mondrian Red', hex: '#fca5a5', dark: '#dc2626' },
  { name: 'Mondrian Yellow', hex: '#fef08a', dark: '#ca8a04' },
  { name: 'Emerald Green', hex: '#a7f3d0', dark: '#059669' },
  { name: 'Mondrian Blue', hex: '#93c5fd', dark: '#2563eb' },
  { name: 'Tangerine', hex: '#fed7aa', dark: '#ea580c' },
  { name: 'Amethyst Purple', hex: '#e9d5ff', dark: '#7c3aed' },
  { name: 'Mondrian Rose', hex: '#fbcfe8', dark: '#be185d' }
];

const PRESET_LAYOUTS = {
  'Base': [
    '...33..',
    '...3...',
    '..22...',
    '..2....',
    '.11...',
    '.1.BB..',
    'BBBB...',
    '...B...'
  ],
  'Splitter': [
    '........55..',
    '........5...',
    '.......44...',
    '.......4...',
    '......33....',
    '......3.....',
    '...S.SS.....',
    '...SSS......',
    '..22.S66....',
    '..2....677..',
    '.11......788',
    '.1.BB......8',
    'BBBB........',
    '...B........'
  ],
  'Inverter': [
    '...66..',
    '...6...',
    '..55...',
    '..5...',
    '.44....',
    '.4IIIII',
    '...33..',
    '...3...',
    '..22...',
    '..2...',
    '.11...',
    '.1.BB..',
    'BBBB...',
    '...B...'
  ],
  'Turner': [
    '66......',
    '.6......',
    '.55.....',
    '..5.....',
    '..44.I..',
    '...4III.',
    '...II.33',
    '......3.',
    '.....22.',
    '.....2..',
    '....11..',
    '....1.BB',
    '...BBBB.',
    '......B.'
  ],
  '2-Clause': [
    '...B..',
    'BBBB..',
    '.3.BB.',
    '.33...',
    '..4...',
    '..44..',
    '...KKK',
    '..22..',
    '..2...',
    '.11...',
    '.1.AA.',
    'AAAA..',
    '...A..'
  ],
  '3-Clause': [
    '...B.....D...',
    'BBBB.....DDDD',
    '.3.BB...DD.7.',
    '.33.......77.',
    '..4.......8..',
    '..44.KKK.88..',
    '...KKK.KKK...',
    '..22K...KC...',
    '..2......CCC.',
    '.11.......C..',
    '.1.AA.....CC.',
    'AAAA....CC.C.',
    '...A.....CCCC',
    '.........C...'
  ],
  'Left-Offset': [
    '......66',
    '......6.',
    '.....55.',
    '.....5..',
    '....44..',
    '....4...',
    '...OOO.O',
    '....OOOO',
    '...33.O.',
    '...3....',
    '..22....',
    '..2.....',
    '.11.....',
    '.1.BB...',
    'BBBB....',
    '...B....'
  ],
  'Right-Offset': [
    '........66',
    '........6.',
    '.......55.',
    '.......5..',
    '......44..',
    '....O.4...',
    '....OOO...',
    '....O.O...',
    '...33.OO..',
    '...3......',
    '..22......',
    '..2.......',
    '.11.......',
    '.1.BB.....',
    'BBBB......',
    '...B......'
  ],
  'Forward-Offset': [
    '...........11',
    '...........1.',
    '..........11.',
    '..........1..',
    '.........11..',
    '.........1...',
    '........OOO.O',
    '.........OOOO',
    '........11.O.',
    '........1....',
    '.......11....',
    '.......1.....',
    '......OO.....',
    '.....OOO.....',
    '.....OO......',
    '....11O......',
    '....1.O......',
    '...11........',
    '...1.........',
    '..11.........',
    '..1..........',
    '.11..........',
    '.1.BB........',
    'BBBB.........',
    '...B.........'
  ],
  'Full Encoding': [
    '............................11......................................................',
    '............................1.......................................................',
    '...........................11.......................................................',
    '...........................1........................................................',
    '..........................11........................................................',
    '..........................1.........................................................',
    '.......................S.SS.........................................................',
    '.......................SSS..........................................................',
    '......................11.SS1........................................................',
    '......................1....111......................................................',
    '.....................11......111....................................................',
    '.....................1.........111..................................................',
    '....................11...........111................................................',
    '....................1..............111..............................................',
    '.................S.SS................111............................................',
    '.................SSS...................111..........................................',
    '................11.SS1...................111........................................',
    '................1....111...................111......................................',
    '...............11......111...................111....................................',
    '...............1.........111...................111..................................',
    '..............11...........111...................111................................',
    '..............1..............111...................111..............................',
    '...........I.11................111...................111............................',
    '..........IIII...................111...................111..........................',
    '.........II.II.....................111...................111........................',
    '..........1..........................111...................111......................',
    '..........11...........................1SS...................111....................',
    '...........1............................S......................111..................',
    '...........11..........................SSS.......................111................',
    '............1..........................S.S11.......................111..............',
    '............11........................11...111.......................111............',
    '.............1........................1......111.......................111..........',
    '.............11.I....................11........1.........................111........',
    '..............IIII...................1.....................................SSS......',
    '..............II.II.................11......................................S.......',
    '.................1..................1......................................SSS......',
    '................11.................11......................................S.111....',
    '................1..................1......................................11...111..',
    '...............11.................11......................................1......111',
    '...............1................KKK......................................11........1',
    '..............11..................11.....................................1..........',
    '..............1IIIII...............1....................................11..........',
    '................11.................11...................................1...........',
    '................1...................1..................................11...........',
    '...............11...................11.................................1............',
    '...............1................IIIII1................................11............',
    '..............11..................11..................................1.............',
    '..............1....................1.................................11.............',
    '...........I.11....................11................................1..............',
    '..........IIII......................1...............................11..............',
    '.........II.II......................11..............................1...............',
    '..........1..........................1.............................11...............',
    '..........11.........................SS.S..........................1................',
    '...........1..........................SSS.........................11................',
    '...........11.......................1SS.11........................1.................',
    '............1.....................111....1.......................11.................',
    '....B.......11..................111......11......................1..................',
    '.BBBB........1................SS1.........1.....................11..................',
    '..1.BB.......11........1.......S..........11..................KKK...................',
    '..11..........1......111......SSS.......BB.1....................11..................',
    '...1..........11...111......11S.S........BBBB....................1..................',
    '...11..........S.S11......111...11.......B.......................11.................',
    '....1..........SSS......111......1................................1.................',
    '....11..........S.....SS1........11...............................11................',
    '.....1.........1SS.....S..........1................................1................',
    '.....11......111......SSS.........11...............................11...............',
    '......1....111......11S.S..........1................................1...............',
    '......11.SS1......111...11.........11...............................11..............',
    '.......SSS......111......1.......1IIIII..............................1..............',
    '.......S.SS.....1........11......11..................................11........1....',
    '..........1...............I.......1...................................1......111....',
    '..........11...........II.II......11..................................11...111......',
    '...........1...........IIII........1...................................S.S11........',
    '...........11.........11.I.........11.......................11.........SSS..........',
    '............1.........1.............1........................1..........S...........',
    '............11.......11.............11.......................11........1SS..........',
    '.............1.......1...............KKK......................1......111............',
    '.............11.KKK.11..............11........................11...111..............',
    '..............KKK.KKK...............1..........................S.S11................',
    '.............11K...KK..............11..........................SSS..................',
    '.............1......BBB............1............................S...................',
    '............11.......B............11.II...............I........1SS..................',
    '............1........BB............III1...............I......111....................',
    '...........11......BB.B.............I.11.............1I....111......................',
    '...........1........BBBB...............1...........111I..111........................',
    '..........11........B..................11........111..I111..........................',
    '..........1.............................1......111....11............................',
    '.........11.............................11...111....................................',
    '.........1...............................S.111......................................',
    '......S.SS...............................SSS........................................',
    '......SSS....11...........................S.........................................',
    '.....11.SS1..I111....................O...1SS........................................',
    '.....1....111I..1OO..................OOOO1..........................................',
    '....11......1I.OOOOO...................O............................................',
    '....1........I....OO11...............1OOO...........................................',
    '...11........I.......111.O.........111..............................................',
    '...1...................1OO11.....II1................................................',
    '..11....................OO.111...II.................................................',
    '..1....................OO....111..II................................................',
    '.11.....................OO.....11II.................................................',
    '.1.BB............................I..................................................',
    'BBBB................................................................................',
    '...B................................................................................'
  ]
};

const getPresetColor = (char) => {
  if (char >= '1' && char <= '9') {
    return '#fed7aa'; 
  }
  if (char === 'A' || char === 'B' || char === 'C' || char === 'D') {
    return '#93c5fd'; 
  }
  if (char === 'K') {
    return '#fef08a'; 
  }
  if (char === 'I') {
    return '#e9d5ff'; 
  }
  if (char === 'S') {
    return '#a7f3d0'; 
  }
  if (char === 'O') {
    return '#fca5a5'; 
  }
  return '#bae6fd'; 
};

const getDarkVariant = (colorHex) => {
  const match = PALETTE.find(item => item.hex === colorHex);
  return match ? match.dark : '#1e293b';
};

// ─── Orientation Helper Functions ────────────────────────────────────────────
const rotate90 = (matrix) => {
  const H = matrix.length;
  const W = matrix[0].length;
  const rotated = Array.from({ length: W }, () => Array(H).fill(false));
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      rotated[c][H - 1 - r] = matrix[r][c];
    }
  }
  return rotated;
};

const flipHorizontal = (matrix) => {
  return matrix.map(row => [...row].reverse());
};

const getUniqueOrientations = (matrix) => {
  if (!matrix || matrix.length === 0) return [];
  const orientations = [];
  const seen = new Set();
  let current = matrix;
  for (let i = 0; i < 4; i++) {
    const key1 = JSON.stringify(current);
    if (!seen.has(key1)) {
      seen.add(key1);
      orientations.push(current);
    }
    const flipped = flipHorizontal(current);
    const key2 = JSON.stringify(flipped);
    if (!seen.has(key2)) {
      seen.add(key2);
      orientations.push(flipped);
    }
    current = rotate90(current);
  }
  return orientations;
};

// ─── Canvas Grid Renderer ────────────────────────────────────────────────────
const GridCanvas = React.memo(React.forwardRef(({
  grid, gridSize, cellSize,
  queenMap,
  currentTool, bounds,
  activeStamp, hoveredCell,
  onMouseDown, onMouseEnter, onMouseLeave,
  onRightClick,
}, externalRef) => {
  const canvasRef = useRef(null);

  const setRef = useCallback((el) => {
    canvasRef.current = el;
    if (typeof externalRef === 'function') externalRef(el);
    else if (externalRef) externalRef.current = el;
  }, [externalRef]);
  const totalSize = cellSize * gridSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, totalSize, totalSize);

    const stampPreview = new Map();
    if (activeStamp && hoveredCell) {
      const pRows = activeStamp.length;
      const pCols = activeStamp[0].length;
      for (let ri = 0; ri < pRows; ri++) {
        for (let ci = 0; ci < pCols; ci++) {
          const color = activeStamp[ri][ci];
          if (color) {
            stampPreview.set(`${hoveredCell.r + ri},${hoveredCell.c + ci}`, color);
          }
        }
      }
    }

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const x = c * cellSize;
        const y = r * cellSize;
        const cellVal = grid[r][c];
        const hasQueen = queenMap[r][c];
        const previewColor = stampPreview.get(`${r},${c}`);

        let bg;
        if (cellVal) {
          bg = hasQueen ? getDarkVariant(cellVal) : cellVal;
        } else if (previewColor) {
          bg = previewColor;
        } else {
          bg = '#ffffff';
        }
        ctx.fillStyle = bg;
        ctx.fillRect(x, y, cellSize, cellSize);

        if (currentTool === 'select' && bounds &&
            r >= bounds.minR && r <= bounds.maxR &&
            c >= bounds.minC && c <= bounds.maxC) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.18)';
          ctx.fillRect(x, y, cellSize, cellSize);

          ctx.strokeStyle = '#2563eb';
          ctx.lineWidth = 2;
          ctx.beginPath();
          if (r === bounds.minR) { ctx.moveTo(x, y); ctx.lineTo(x + cellSize, y); }
          if (r === bounds.maxR) { ctx.moveTo(x, y + cellSize); ctx.lineTo(x + cellSize, y + cellSize); }
          if (c === bounds.minC) { ctx.moveTo(x, y); ctx.lineTo(x, y + cellSize); }
          if (c === bounds.maxC) { ctx.moveTo(x + cellSize, y); ctx.lineTo(x + cellSize, y + cellSize); }
          ctx.stroke();
        }

        if (previewColor) {
          ctx.strokeStyle = 'rgba(0,0,0,0.35)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
        }

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cellSize, cellSize);

        if (hasQueen) {
          const fontSize = Math.max(8, Math.floor(cellSize * 0.75));
          ctx.font = `${fontSize}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('♛', x + cellSize / 2, y + cellSize / 2 + 1);
        }
      }
    }
  }, [grid, gridSize, cellSize, queenMap, currentTool, bounds, activeStamp, hoveredCell, totalSize]);

  const getCellFromEvent = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const c = Math.floor(x / cellSize);
    const r = Math.floor(y / cellSize);
    if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) return { r, c };
    return null;
  }, [cellSize, gridSize]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return; // Ignore right-clicks or middle-clicks for cell placement
    const cell = getCellFromEvent(e);
    if (cell) onMouseDown(cell.r, cell.c);
  }, [getCellFromEvent, onMouseDown]);

  const handleMouseMove = useCallback((e) => {
    const cell = getCellFromEvent(e);
    if (cell) onMouseEnter(cell.r, cell.c);
    else onMouseLeave();
  }, [getCellFromEvent, onMouseEnter, onMouseLeave]);

  const handleMouseLeave = useCallback(() => {
    onMouseLeave();
  }, [onMouseLeave]);

  const handleContextMenu = useCallback((e) => {
    if (activeStamp) {
      e.preventDefault();
      onRightClick();
    }
  }, [activeStamp, onRightClick]);

  return (
    <canvas
      ref={setRef}
      width={totalSize}
      height={totalSize}
      style={{ display: 'block', cursor: 'crosshair' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
    />
  );
}));

export default function App() {
  const [solver, setSolver] = useState(null);
  const [loadingSolver, setLoadingSolver] = useState(true);
  
  const [gridSize, setGridSize] = useState(30);
  const [sliderValue, setSliderValue] = useState(30);
  const [grid, setGrid] = useState(() => 
    Array.from({ length: 30 }, () => Array(30).fill(false))
  );

  const [currentTool, setCurrentTool] = useState('paint'); 
  const [selectedColor, setSelectedColor] = useState('#bae6fd');
  const [history, setHistory] = useState([]);
  
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [isSelectingDrag, setIsSelectingDrag] = useState(false);

  const [activeStamp, setActiveStamp] = useState(null);
  const [stampOrientations, setStampOrientations] = useState([]);
  const [stampOrientationIndex, setStampOrientationIndex] = useState(0);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [clipboard, setClipboard] = useState(null);

  const fileInputRef = useRef(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [drawMode, setDrawMode] = useState(true);

  const [solutions, setSolutions] = useState([]);
  const [optimalCount, setOptimalCount] = useState(null);
  const [currentSolIdx, setCurrentSolIdx] = useState(0);
  const [hasMoreSolutions, setHasMoreSolutions] = useState(false);
  
  const [isSolving, setIsSolving] = useState(false);
  const cancelSolveRef = useRef(false);
  
  const [errorMsg, setErrorMsg] = useState(null);
  const [warningMsg, setWarningMsg] = useState(null);

  const [showMobileWarning, setShowMobileWarning] = useState(false);

  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    if (isMobile) {
      setShowMobileWarning(true);
    }
  }, []);

  useEffect(() => {
    highsLoader({
      locateFile: (file) => `${import.meta.env.BASE_URL}${file}`,
    })
      .then((instantiatedSolver) => {
        setSolver(instantiatedSolver);
        setLoadingSolver(false);
      })
      .catch((err) => {
        console.error("HiGHS load failure:", err);
        setLoadingSolver(false);
        setErrorMsg("Failed to load WebAssembly solver. Verify internet connectivity.");
      });
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDown) {
        setIsMouseDown(false);
        setGrid([...gridRef.current]);
        clearSolutions();
      }
      setIsSelectingDrag(false);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isMouseDown]);

  const saveHistory = (currentGrid) => {
    setHistory((prev) => [...prev, JSON.parse(JSON.stringify(currentGrid))].slice(-50));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousGrid = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    const previousSize = previousGrid.length;
    setGridSize(previousSize);
    setSliderValue(previousSize);
    setGrid(previousGrid);
    clearSolutions();
  };

  const handleClear = () => {
    saveHistory(grid);
    setGrid(Array.from({ length: gridSize }, () => Array(gridSize).fill(false)));
    clearSolutions();
  };

  const clearSolutions = () => {
    setSolutions([]);
    setOptimalCount(null);
    setCurrentSolIdx(0);
    setHasMoreSolutions(false);
    setErrorMsg(null);
    setWarningMsg(null);
  };

  const resizeGrid = (newSize) => {
    const delta = newSize - gridSize;
    const offset = Math.floor(delta / 2);

    const newGrid = Array.from({ length: newSize }, (_, r) =>
      Array.from({ length: newSize }, (_, c) => {
        const oldR = r - offset;
        const oldC = c - offset;
        if (oldR >= 0 && oldR < gridSize && oldC >= 0 && oldC < gridSize) {
          return grid[oldR][oldC];
        }
        return false;
      })
    );

    setGrid(newGrid);
    setGridSize(newSize);
    setSliderValue(newSize);
    clearSolutions();
  };

  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value, 10));
  };

  const handleSliderRelease = () => {
    if (sliderValue === gridSize) return;
    resizeGrid(sliderValue);
  };

  const selectGadget = (presetName) => {
    const lines = PRESET_LAYOUTS[presetName];
    if (!lines) return;

    const pRows = lines.length;
    const pCols = Math.max(...lines.map(l => l.length));
    const stampMatrix = Array.from({ length: pRows }, (_, r) =>
      Array.from({ length: pCols }, (_, c) => {
        const char = lines[r][c];
        return (char && char !== '.' && char !== ' ') ? getPresetColor(char) : false;
      })
    );

    const uniqueOrients = getUniqueOrientations(stampMatrix);
    setStampOrientations(uniqueOrients);
    setStampOrientationIndex(0);
    setActiveStamp(uniqueOrients[0]);
    setCurrentTool('paint'); 
  };

  const handleRightClick = useCallback(() => {
    if (stampOrientations.length <= 1) return;
    const nextIdx = (stampOrientationIndex + 1) % stampOrientations.length;
    setStampOrientationIndex(nextIdx);
    setActiveStamp(stampOrientations[nextIdx]);
  }, [stampOrientations, stampOrientationIndex]);

  const getConnectivityStats = (currentGrid) => {
    let startCell = null;
    let activeCount = 0;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (currentGrid[r][c]) {
          activeCount++;
          if (!startCell) startCell = { r, c };
        }
      }
    }
    if (activeCount === 0) return { connected: true, activeCount: 0 };

    const visited = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
    const queue = [startCell];
    visited[startCell.r][startCell.c] = true;
    let reachedCount = 0;

    while (queue.length > 0) {
      const { r, c } = queue.shift();
      reachedCount++;

      const neighbors = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dr, dc] of neighbors) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
          if (currentGrid[nr][nc] && !visited[nr][nc]) {
            visited[nr][nc] = true;
            queue.push({ r: nr, c: nc });
          }
        }
      }
    }
    return {
      connected: reachedCount === activeCount,
      activeCount
    };
  };

  const selectionBoundingBox = () => {
    if (!selectionStart || !selectionEnd) return null;
    return {
      minR: Math.min(selectionStart.r, selectionEnd.r),
      maxR: Math.max(selectionStart.r, selectionEnd.r),
      minC: Math.min(selectionStart.c, selectionEnd.c),
      maxC: Math.max(selectionStart.c, selectionEnd.c)
    };
  };

  const activeStats = useMemo(() => getConnectivityStats(grid), [grid, gridSize]);
  const cellSizeComputed = useMemo(() => Math.max(3, Math.min(45, Math.floor(750 / gridSize))), [gridSize]);
  const bounds = useMemo(() => selectionBoundingBox(), [selectionStart, selectionEnd]);

  const canvasElRef = useRef(null);

  const paintCellOnCanvas = useCallback((r, c, colorValue, cs) => {
    const canvas = canvasElRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const x = c * cs;
    const y = r * cs;
    ctx.fillStyle = colorValue || '#ffffff';
    ctx.fillRect(x, y, cs, cs);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x, y, cs, cs);
  }, []);

  const handleCellMouseDown = useCallback((r, c) => {
    if (activeStamp) {
      saveHistory(grid);
      const nextGrid = JSON.parse(JSON.stringify(grid));
      const pRows = activeStamp.length;
      const pCols = activeStamp[0].length;

      for (let ri = 0; ri < pRows; ri++) {
        for (let ci = 0; ci < pCols; ci++) {
          const stampVal = activeStamp[ri][ci];
          if (stampVal) {
            const targetR = r + ri;
            const targetC = c + ci;
            if (targetR < gridSize && targetC < gridSize) {
              nextGrid[targetR][targetC] = stampVal;
            }
          }
        }
      }
      setGrid(nextGrid);
      clearSolutions();
      return;
    }

    if (currentTool === 'select') {
      setIsSelectingDrag(true);
      setSelectionStart({ r, c });
      setSelectionEnd({ r, c });
    } else {
      saveHistory(grid);
      setIsMouseDown(true);
      const isCurrentColor = grid[r][c] === selectedColor;
      const nextValue = isCurrentColor ? false : selectedColor;
      setDrawMode(nextValue);

      gridRef.current[r][c] = nextValue;
      paintCellOnCanvas(r, c, nextValue, cellSizeComputed);
    }
  }, [activeStamp, grid, gridSize, currentTool, selectedColor, cellSizeComputed, paintCellOnCanvas]);

  const handleCellMouseEnter = useCallback((r, c) => {
    if (activeStamp) {
      setHoveredCell({ r, c });
      return;
    }

    if (currentTool === 'select' && isSelectingDrag) {
      setSelectionEnd({ r, c });
    } else if (currentTool === 'paint' && isMouseDown) {
      if (gridRef.current[r][c] === drawMode) return;

      gridRef.current[r][c] = drawMode;
      paintCellOnCanvas(r, c, drawMode, cellSizeComputed);
    }
  }, [activeStamp, currentTool, isSelectingDrag, isMouseDown, drawMode, cellSizeComputed, paintCellOnCanvas]);

  const getActiveTilesList = (currentGrid) => {
    const list = [];
    let idx = 1;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (currentGrid[r][c]) {
          list.push({ r, c, idx });
          idx++;
        }
      }
    }
    return list;
  };

  const queenMap = useMemo(() => {
    const matrix = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
    if (solutions.length === 0) return matrix;
    const currentSol = solutions[currentSolIdx];
    const queenSet = new Set(currentSol);
    
    let idx = 1;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c]) {
          if (queenSet.has(idx)) {
            matrix[r][c] = true;
          }
          idx++;
        }
      }
    }
    return matrix;
  }, [solutions, currentSolIdx, grid, gridSize]);

  const handleFlipHorizontal = () => {
    const bounds = selectionBoundingBox();
    if (!bounds) return;
    saveHistory(grid);

    const { minR, maxR, minC, maxC } = bounds;
    const nextGrid = JSON.parse(JSON.stringify(grid));

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        const mirrorC = maxC - (c - minC);
        nextGrid[r][c] = grid[r][mirrorC];
      }
    }
    setGrid(nextGrid);
    clearSolutions();
  };

  const handleFlipVertical = () => {
    const bounds = selectionBoundingBox();
    if (!bounds) return;
    saveHistory(grid);

    const { minR, maxR, minC, maxC } = bounds;
    const nextGrid = JSON.parse(JSON.stringify(grid));

    for (let r = minR; r <= maxR; r++) {
      const mirrorR = maxR - (r - minR);
      for (let c = minC; c <= maxC; c++) {
        nextGrid[r][c] = grid[mirrorR][c];
      }
    }
    setGrid(nextGrid);
    clearSolutions();
  };

  const handleRotateCW = () => {
    const bounds = selectionBoundingBox();
    if (!bounds) return;
    saveHistory(grid);

    const { minR, maxR, minC, maxC } = bounds;
    const H = maxR - minR + 1;
    const W = maxC - minC + 1;

    const nextGrid = JSON.parse(JSON.stringify(grid));

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        nextGrid[r][c] = false;
      }
    }

    for (let i = 0; i < W; i++) {
      for (let j = 0; j < H; j++) {
        const targetR = minR + i;
        const targetC = minC + j;
        if (targetR < gridSize && targetC < gridSize) {
          nextGrid[targetR][targetC] = grid[maxR - j][minC + i];
        }
      }
    }

    setGrid(nextGrid);
    setSelectionStart({ r: minR, c: minC });
    setSelectionEnd({ r: minR + W - 1, c: minC + H - 1 });
    clearSolutions();
  };

  const handleDeleteSelection = () => {
    const bounds = selectionBoundingBox();
    if (!bounds) return;
    saveHistory(grid);

    const { minR, maxR, minC, maxC } = bounds;
    const nextGrid = JSON.parse(JSON.stringify(grid));

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        nextGrid[r][c] = false;
      }
    }
    setGrid(nextGrid);
    setSelectionStart(null);
    setSelectionEnd(null);
    clearSolutions();
  };

  const handleCopy = () => {
    const bounds = selectionBoundingBox();
    if (!bounds) return;
    const { minR, maxR, minC, maxC } = bounds;
    const H = maxR - minR + 1;
    const W = maxC - minC + 1;

    const matrix = Array.from({ length: H }, (_, r) =>
      Array.from({ length: W }, (_, c) => grid[minR + r][minC + c])
    );
    setClipboard(matrix);
  };

  const handleCut = () => {
    const bounds = selectionBoundingBox();
    if (!bounds) return;
    const { minR, maxR, minC, maxC } = bounds;
    const H = maxR - minR + 1;
    const W = maxC - minC + 1;

    const matrix = Array.from({ length: H }, (_, r) =>
      Array.from({ length: W }, (_, c) => grid[minR + r][minC + c])
    );
    setClipboard(matrix);

    saveHistory(grid);
    const nextGrid = JSON.parse(JSON.stringify(grid));
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        nextGrid[r][c] = false;
      }
    }
    setGrid(nextGrid);
    setSelectionStart(null);
    setSelectionEnd(null);
    clearSolutions();
  };

  const handleSaveGrid = () => {
    const tilesByColor = {};
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const color = grid[r][c];
        if (color) {
          if (!tilesByColor[color]) {
            tilesByColor[color] = [];
          }
          tilesByColor[color].push([r, c]);
        }
      }
    }
    
    const exportData = {
      gridSize,
      tiles: tilesByColor
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `queen-solver-grid-${gridSize}x${gridSize}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadGrid = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (!importedData.gridSize || !importedData.tiles) {
          setErrorMsg("Invalid file format. Please upload a valid exported layout file.");
          return;
        }

        const size = parseInt(importedData.gridSize, 10);
        if (isNaN(size) || size < 6 || size > 250) {
          setErrorMsg("Invalid grid size in the imported file.");
          return;
        }

        saveHistory(grid);
        const nextGrid = Array.from({ length: size }, () => Array(size).fill(false));

        Object.entries(importedData.tiles).forEach(([color, coords]) => {
          if (Array.isArray(coords)) {
            coords.forEach(([r, c]) => {
              if (r < size && c < size) {
                nextGrid[r][c] = color;
              }
            });
          }
        });

        setGridSize(size);
        setSliderValue(size);
        setGrid(nextGrid);
        clearSolutions();
      } catch (err) {
        console.error("Layout load error:", err);
        setErrorMsg("Error parsing layout file.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCancelSolve = () => {
    cancelSolveRef.current = true;
  };

  const solveBoard = async () => {
    if (!solver) return;
    setIsSolving(true);
    cancelSolveRef.current = false;
    setErrorMsg(null);
    setWarningMsg(null);

    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const activeTiles = getActiveTilesList(grid);
      const numVars = activeTiles.length;
      if (numVars === 0) {
        setErrorMsg("Please paint/select active tiles on the grid before solving.");
        setIsSolving(false);
        return;
      }

      const cellToVar = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
      activeTiles.forEach(t => {
        cellToVar[t.r][t.c] = t.idx;
      });

      const { connected } = getConnectivityStats(grid);

      const segments = [];
      const seenSegments = new Set();
      const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

      for (const [dr, dc] of directions) {
        for (const tile of activeTiles) {
          const { r, c } = tile;
          const prevR = r - dr;
          const prevC = c - dc;
          const prevExists = prevR >= 0 && prevR < gridSize && prevC >= 0 && prevC < gridSize && !!grid[prevR][prevC];

          if (!prevExists) {
            const segment = [];
            let currR = r;
            let currC = c;
            while (currR >= 0 && currR < gridSize && currC >= 0 && currC < gridSize && !!grid[currR][currC]) {
              segment.push(cellToVar[currR][currC]);
              currR += dr;
              currC += dc;
            }

            if (segment.length > 1) {
              segment.sort((a, b) => a - b);
              const segmentKey = segment.join(',');
              if (!seenSegments.has(segmentKey)) {
                seenSegments.add(segmentKey);
                segments.push(segment);
              }
            }
          }
        }
      }

      const foundSolutions = [];
      let maxQueens = null;
      const forbiddenCuts = [];
      const maxSearchLimit = 21;
      let reachedLimitFlag = false;

      for (let iter = 0; iter < maxSearchLimit; iter++) {
        if (cancelSolveRef.current) {
          setWarningMsg("Process cancelled by user. Showing partial placements.");
          break;
        }

        let lp = "Maximize\n obj: ";
        lp += activeTiles.map(t => `x${t.idx}`).join(" + ") + "\n";
        lp += "Subject To\n";

        let constraintId = 1;
        for (const seg of segments) {
          lp += ` seg${constraintId}: ` + seg.map(idx => `x${idx}`).join(" + ") + " <= 1\n";
          constraintId++;
        }

        for (const prevSolution of forbiddenCuts) {
          lp += ` cut${constraintId}: ` + prevSolution.map(idx => `x${idx}`).join(" + ") + ` <= ${prevSolution.length - 1}\n`;
          constraintId++;
        }

        lp += "Bounds\n";
        for (const t of activeTiles) {
          lp += ` 0 <= x${t.idx} <= 1\n`;
        }

        lp += "Binaries\n";
        for (const t of activeTiles) {
          lp += ` x${t.idx}\n`;
        }
        lp += "End\n";

        const res = solver.solve(lp);
        if (!res || res.Status !== "Optimal") {
          break;
        }

        const objectiveValueRounded = Math.round(res.ObjectiveValue);
        if (maxQueens === null) {
          maxQueens = objectiveValueRounded;
        } else if (objectiveValueRounded < maxQueens) {
          break;
        }

        const currentQueens = [];
        for (const t of activeTiles) {
          const colState = res.Columns[`x${t.idx}`];
          if (colState && Math.round(colState.Primal) === 1) {
            currentQueens.push(t.idx);
          }
        }

        if (currentQueens.length === 0 && maxQueens > 0) {
          break;
        }

        foundSolutions.push(currentQueens);
        forbiddenCuts.push(currentQueens);

        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      if (foundSolutions.length === 0) {
        if (cancelSolveRef.current) {
          setErrorMsg("Calculation was cancelled.");
        } else {
          setErrorMsg("No optimal configurations could be calculated.");
        }
        setSolutions([]);
        setOptimalCount(null);
        setCurrentSolIdx(0);
      } else {
        let finalSolutionsList = foundSolutions;
        if (foundSolutions.length >= maxSearchLimit) {
          finalSolutionsList = foundSolutions.slice(0, 20);
          reachedLimitFlag = true;
        }

        setSolutions(finalSolutionsList);
        setOptimalCount(maxQueens);
        setCurrentSolIdx(0);
        setHasMoreSolutions(reachedLimitFlag);

        if (!connected && !cancelSolveRef.current) {
          setWarningMsg("Note: The selected cells are not 4-connected (not a single polyomino).");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred during optimization.");
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="app-wrapper">
      {showMobileWarning && (
        <div className="modal-overlay">
          <div className="modal">
            <p style={{ margin: '0 0 20px 0', fontSize: '0.88rem', color: '#64748b' }}>
              This website is designed for mouse use. For the best experience, please visit on a desktop device.
            </p>
            <div className="modal-buttons">
              <button className="confirm" onClick={() => setShowMobileWarning(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="title-area">
          <h1>Max Queen Solver</h1>
        </div>

        {/* Parameter and Stats Bar */}
        <div className="defect-bar">
          <span className="defect-label">Polyomino Size:</span>
          <span className="defect-value defect-grey">{activeStats.activeCount}</span>
          <span className="defect-separator">|</span>
          <span className="defect-label">Max Queens:</span>
          <span className="defect-value defect-grey">{optimalCount !== null ? optimalCount : "—"}</span>
          <span className="defect-separator">|</span>
          <span className="defect-label">Different Solutions:</span>
          <span className="defect-value defect-grey">
            {solutions.length > 0 ? (hasMoreSolutions ? "20+" : solutions.length) : "—"}
          </span>
        </div>

        {/* Top Controls Panel */}
        <div className="top-controls-panel">
          
          {/* Row 1: Slider and Palette */}
          <div className="controls-row row-1">
            <div className="slider-area">
              <span className="slider-label">Grid Dimensions: {sliderValue}x{sliderValue}</span>
              <input
                id="grid-size-slider"
                type="range"
                min="10"
                max="250"
                step="10"
                value={sliderValue}
                disabled={isSolving}
                onChange={handleSliderChange}
                onMouseUp={handleSliderRelease}
                onTouchEnd={handleSliderRelease}
              />
            </div>

            <div className="palette-container">
              <span className="palette-label">Tile Color:</span>
              <div className="swatches">
                {PALETTE.map((item) => (
                  <button
                    key={item.hex}
                    className={`swatch ${selectedColor === item.hex ? 'active' : ''}`}
                    style={{ backgroundColor: item.hex }}
                    onClick={() => {
                      setSelectedColor(item.hex);
                      setActiveStamp(null);
                      setStampOrientations([]);
                      setStampOrientationIndex(0);
                    }}
                    title={item.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Tool, Gadget */}
          <div className="controls-row row-2">
            <div className="inner-flex-group">
              <span className="preset-label">Active Tool:</span>
              <div className="tool-selector-block">
                <button 
                  className={`tool-btn ${currentTool === 'paint' && !activeStamp ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTool('paint');
                    setActiveStamp(null);
                    setStampOrientations([]);
                    setStampOrientationIndex(0);
                  }}
                  disabled={isSolving}
                >
                  Paint Tool
                </button>
                <button 
                  className={`tool-btn ${currentTool === 'select' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTool('select');
                    setActiveStamp(null);
                    setStampOrientations([]);
                    setStampOrientationIndex(0);
                  }}
                  disabled={isSolving}
                >
                  Select Tool
                </button>
              </div>
            </div>

            <div className="inner-flex-group">
              <div className="preset-container">
                <span className="preset-label">Load Gadget:</span>
                <select
                  className="preset-select"
                  disabled={isSolving}
                  onChange={(e) => {
                    if (e.target.value) {
                      selectGadget(e.target.value);
                      e.target.value = ''; 
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Select Gadget...</option>
                  {Object.keys(PRESET_LAYOUTS).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: Action Buttons */}
          <div className="controls-row row-3">
            <div className="primary-actions">
              {!isSolving ? (
                <button 
                  className="action-btn primary-btn" 
                  onClick={solveBoard}
                >
                  Calculate Placements
                </button>
              ) : (
                <button 
                  className="action-btn cancel-btn" 
                  onClick={handleCancelSolve}
                  title="Cancel calculations"
                >
                  <span className="spinner-small" />
                  Cancel Process
                </button>
              )}
            </div>

            <div className={`solution-inline-controls ${solutions.length === 0 ? 'disabled' : ''}`}>
              <button 
                className="sol-btn" 
                disabled={solutions.length === 0 || currentSolIdx === 0 || isSolving}
                onClick={() => setCurrentSolIdx(prev => prev - 1)}
                title="Previous Configuration"
              >
                &lt;
              </button>
              
              <span className="solution-info">
                {solutions.length > 0 ? `${currentSolIdx + 1} / ${solutions.length}${hasMoreSolutions ? '+' : ''}` : '- / -'}
              </span>

              <button 
                className="sol-btn" 
                disabled={solutions.length === 0 || currentSolIdx === solutions.length - 1 || isSolving}
                onClick={() => setCurrentSolIdx(prev => prev + 1)}
                title="Next Configuration"
              >
                &gt;
              </button>
            </div>

            <div className="utility-actions">
              <button 
                className="action-btn" 
                onClick={handleSaveGrid} 
                disabled={isSolving} 
                title="Export current layout to a file"
              >
                Save Layout
              </button>
              <button 
                className="action-btn" 
                onClick={() => fileInputRef.current.click()} 
                disabled={isSolving} 
                title="Import layout from a file"
              >
                Load Layout
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".json,.txt" 
                onChange={handleLoadGrid} 
              />

              <button 
                className="action-btn"
                onClick={handleUndo}
                disabled={history.length === 0 || isSolving}
                title="Undo Last Action"
              >
                Undo
              </button>

              <button 
                className="action-btn text-danger"
                disabled={isSolving}
                onClick={handleClear}
                title="Reset Grid"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Row 4: Selection Actions Panel */}
          {currentTool === 'select' && (
            <div className={`controls-row row-4 selection-actions-panel ${!bounds ? 'no-bounds' : ''}`}>
              <button 
                className="action-btn" 
                disabled={!clipboard || isSolving} 
                onClick={() => {
                  const uniqueOrients = getUniqueOrientations(clipboard);
                  setStampOrientations(uniqueOrients);
                  setStampOrientationIndex(0);
                  setActiveStamp(uniqueOrients[0]);
                  setCurrentTool('paint');
                }}
              >
                Paste
              </button>
              <button className="action-btn" disabled={!bounds || isSolving} onClick={handleCopy}>Copy</button>
              <button className="action-btn" disabled={!bounds || isSolving} onClick={handleCut}>Cut</button>
              <button className="action-btn" disabled={!bounds || isSolving} onClick={handleFlipHorizontal}>Flip Horizontal</button>
              <button className="action-btn" disabled={!bounds || isSolving} onClick={handleFlipVertical}>Flip Vertical</button>
              <button className="action-btn" disabled={!bounds || isSolving} onClick={handleRotateCW}>Rotate 90°</button>
              <button className="action-btn text-danger" disabled={!bounds || isSolving} onClick={handleDeleteSelection}>Erase Bounding Box</button>
            </div>
          )}

        </div>

        {/* Board Design Section */}
        <div className="game-area">
          <div className="board-container">
            <div className="grid-container">
              <GridCanvas
                ref={canvasElRef}
                grid={grid}
                gridSize={gridSize}
                cellSize={cellSizeComputed}
                queenMap={queenMap}
                currentTool={currentTool}
                bounds={bounds}
                activeStamp={activeStamp}
                hoveredCell={hoveredCell}
                onMouseDown={handleCellMouseDown}
                onMouseEnter={handleCellMouseEnter}
                onMouseLeave={() => setHoveredCell(null)}
                onRightClick={handleRightClick}
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions">
          <h3>Instructions</h3>
          <ul>
            <li>Click individual grid cells to add them to your polyomino, or hold down and drag the mouse to select multiple tiles. Switch to <strong>Select Tool</strong> to outline a rectangular selection to flip, rotate, copy, cut, or erase those cells.</li>
            <li>Select from the <strong>Load Gadget</strong> dropdown or click <strong>Paste</strong> to enter Stamp Mode, showing a visual preview under your cursor to click and stamp copies of configurations onto any board location. While placing a stamp, right-click to cycle through the unique orientations.</li>
            <li>The solver will find all optimal configurations to place the maximum number of non-attacking queens on the painted polyomino board. The selected tile colors are purely for visual design and do not affect the solver's calculations.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}