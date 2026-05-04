# Pathfinding Algorithm Visualizer - PRD

## Problem Statement

The user wants to build a pathfinding algorithm visualizer that serves as a performance comparison tool. Users should be able to draw or randomly generate grid maps, run different pathfinding algorithms on them, and compare metrics across multiple runs via a dashboard.

## Solution

A web-based (TypeScript + HTML5 Canvas) application that allows users to create grid maps, run classic grid pathfinding algorithms (BFS, DFS, Dijkstra, A*, Greedy Best-First), view animated or instant execution, and compare metrics (execution time, nodes visited, path length, memory usage, path found) across multiple runs in a dashboard.

## User Stories

1. As a user, I want to adjust grid width and height via UI inputs, so I can test algorithms on different map sizes
2. As a user, I want to click cells to place start and end points, so I can define the problem for the algorithm
3. As a user, I want to click and drag to draw wall obstacles, so I can create custom maps
4. As a user, I want to generate random maps with configurable obstacle density, so I can quickly create test maps
5. As a user, I want to generate maze-like maps using structured algorithms (recursive division), so I can test on more complex layouts
6. As a user, I want to generate clustered obstacle maps using noise-like patterns, so I can simulate organic terrain
7. As a user, I want random map generation to guarantee connectivity between start and end, so I avoid unsolvable maps
8. As a user, I want to select an algorithm from a dropdown/buttons, so I can choose which algorithm to run
9. As a user, I want to run algorithms with animated step-by-step visualization, so I can observe how the algorithm explores the grid
10. As a user, I want to run algorithms instantly to see final results, so I can quickly compare algorithm speed
11. As a user, I want a speed slider to control animation speed, so I can slow down for analysis or speed up for quick results
12. As a user, I want to see execution time in milliseconds after running an algorithm, so I can compare speed
13. As a user, I want to see the number of nodes visited after running an algorithm, so I can compare algorithmic efficiency
14. As a user, I want to see path length in cells after running an algorithm, so I can compare path quality
15. As a user, I want to see memory usage after running an algorithm, so I can compare space efficiency
16. As a user, I want to see whether a path was found (yes/no), so I know if the algorithm succeeded
17. As a user, I want all run results to be stored in a metrics dashboard, so I can compare multiple runs over time
18. As a user, I want a clear grid button to reset all cells to empty, so I can start fresh
19. As a user, I want a clear path button to remove algorithm results but keep walls, so I can rerun on same map
20. As a user, I want to see algorithm name and timestamp for each stored run, so I can identify each result
21. As a user, I want a clear history button to reset the metrics dashboard, so I can start fresh comparisons

## Implementation Decisions

### Modules to Build

1. **Grid/Map Module**
   - Manages 2D array of cell states (empty, wall, start, end, visited, path)
   - Provides methods to get/set cell, check bounds, calculate neighbors
   - Exposes: `getCell(x, y)`, `setCell(x, y, state)`, `getNeighbors(x, y)`, `reset()`, `clearWalls()`

2. **Pathfinding Algorithms Module**
   - Contains implementations of BFS, DFS, Dijkstra, A*, Greedy Best-First
   - Each algorithm returns: path (array of positions), nodes visited count, execution time, memory estimate
   - Algorithms emit step events for animation
   - Exposes: `bfs(grid, start, end)`, `dfs(grid, start, end)`, `dijkstra(grid, start, end)`, `aStar(grid, start, end)`, `greedyBestFirst(grid, start, end)`

3. **Visualization/Canvas Module**
   - Handles rendering grid cells, walls, start/end markers, visited cells, final path
   - Manages animation loop with configurable speed
   - Exposes: `render(grid)`, `animate(steps, speed)`, `clear()`

4. **Metrics Dashboard Module**
   - Stores all run results in a list
   - Displays metrics in a table/list view
   - Exposes: `addResult(metrics)`, `getResults()`, `clearHistory()`

5. **Random Map Generator Module**
   - Implements four generation strategies: uniform density, maze (recursive division), clustered (noise-based), connectivity-guaranteed
   - Exposes: `generateRandom(grid, options)`, `generateMaze(grid)`, `generateClustered(grid, density)`, `ensureConnectivity(grid, start, end)`

6. **UI Controls Module**
   - Manages algorithm selector, run button, clear buttons, speed slider, grid size inputs
   - Handles user input events and delegates to appropriate modules

### Technical Decisions

- **Stack**: TypeScript + HTML5 Canvas + Vite (build tooling)
- **Grid representation**: 2D array of cell objects with type and state
- **Animation**: RequestAnimationFrame-based loop with configurable delay between steps
- **Metrics storage**: In-memory array (could persist to localStorage if needed later)
- **Cell weights**: Uniform (all passable cells have cost = 1)

## Testing Decisions

- **Good test definition**: Test external behavior—algorithm outputs (path, nodes visited, found status) for given inputs, not implementation details like internal data structures
- **Prior art**: Standard algorithm testing patterns—use known test cases with expected outputs
- **Modules to test**:
  - Pathfinding Algorithms Module (high priority—core functionality)
  - Random Map Generator Module (high priority—ensures maps are valid)
  - Grid/Map Module (medium priority—foundational)

## Out of Scope

- Weighted cells (terrain with different costs)
- Other algorithm categories (continuous space, advanced algorithms like JPS, Theta*)
- Export/import functionality
- Save/load map layouts
- Keyboard shortcuts
- Zoom/pan for large grids
- Mobile/touch interactions

## Further Notes

- Start with a default grid size (e.g., 30x30) for the initial state
- Default start/end positions: top-left and bottom-right corners
- Memory estimation: track peak size of frontier data structure (approximation acceptable)
- The four random generation options may be implemented incrementally—density first, then maze, clustered, connectivity