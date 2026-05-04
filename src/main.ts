import './style.css'
import { Grid } from './grid'
import { bfs, AlgorithmResult } from './algorithms/bfs'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Pathfinding Algorithm Visualizer</h1>
  <p id="instructions">Click a cell to place START point</p>
  <div class="controls">
    <button id="run-btn" disabled>Run BFS</button>
    <button id="clear-grid">Clear Grid</button>
    <button id="clear-path">Clear Path</button>
  </div>
  <canvas id="grid-canvas"></canvas>
  <div id="metrics"></div>
`

const canvas = document.querySelector<HTMLCanvasElement>('#grid-canvas')!
const grid = new Grid(canvas, 30, 30)
grid.render()

const instructions = document.querySelector<HTMLParagraphElement>('#instructions')!
const runBtn = document.querySelector<HTMLButtonElement>('#run-btn')!
const clearGridBtn = document.querySelector<HTMLButtonElement>('#clear-grid')!
const clearPathBtn = document.querySelector<HTMLButtonElement>('#clear-path')!
const metricsDiv = document.querySelector<HTMLDivElement>('#metrics')!

let clickCount = 0
canvas.addEventListener('click', () => {
  clickCount++
  if (clickCount === 1) {
    instructions.textContent = 'Click a cell to place END point'
  } else if (clickCount === 2) {
    instructions.textContent = 'Left click & drag to draw walls, right click & drag to erase'
    runBtn.disabled = false
  }
})

runBtn.addEventListener('click', () => {
  const result = bfs(grid)
  displayMetrics(result)
  drawPath(result.path)
})

clearGridBtn.addEventListener('click', () => {
  resetGrid()
  instructions.textContent = 'Click a cell to place START point'
  clickCount = 0
  runBtn.disabled = true
  metricsDiv.innerHTML = ''
})

clearPathBtn.addEventListener('click', () => {
  clearPath()
  metricsDiv.innerHTML = ''
})

function displayMetrics(result: AlgorithmResult): void {
  metricsDiv.innerHTML = `
    <h3>Results</h3>
    <p>Execution Time: ${result.executionTime.toFixed(2)} ms</p>
    <p>Nodes Visited: ${result.nodesVisited}</p>
    <p>Path Length: ${result.pathLength}</p>
    <p>Memory Estimate: ${result.memoryEstimate}</p>
    <p>Path Found: ${result.found ? 'Yes' : 'No'}</p>
  `
}

function drawPath(path: { x: number; y: number }[]): void {
  for (const { x, y } of path) {
    const cell = grid.getCell(x, y)
    if (cell && cell.type !== 'start' && cell.type !== 'end') {
      cell.type = 'path'
    }
  }
  grid.render()
}

function clearPath(): void {
  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      const cell = grid.getCell(x, y)
      if (cell && (cell.type === 'visited' || cell.type === 'path')) {
        cell.type = 'empty'
      }
    }
  }
  grid.render()
}

function resetGrid(): void {
  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      const cell = grid.getCell(x, y)
      if (cell) {
        cell.type = 'empty'
      }
    }
  }
  grid.render()
}