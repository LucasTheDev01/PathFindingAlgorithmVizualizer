import './style.css'
import { Grid } from './grid'
import { bfs, bfsGenerator, AlgorithmResult } from './algorithms/bfs'
import { Dashboard } from './dashboard'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Pathfinding Algorithm Visualizer</h1>
  <p id="instructions">Click a cell to place START point</p>
  <div class="controls">
    <select id="algo-select">
      <option value="bfs">BFS</option>
    </select>
    <button id="run-btn" disabled>Run</button>
    <button id="clear-grid">Clear Grid</button>
    <button id="clear-path">Clear Path</button>
  </div>
  <div class="mode-controls">
    <label>
      <input type="radio" name="mode" value="instant" checked> Instant
    </label>
    <label>
      <input type="radio" name="mode" value="animated"> Animated
    </label>
    <label>
      Speed: <input type="range" id="speed-slider" min="1" max="100" value="50">
    </label>
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
const speedSlider = document.querySelector<HTMLInputElement>('#speed-slider')!
const modeInputs = document.querySelectorAll<HTMLInputElement>('input[name="mode"]')
const algoSelect = document.querySelector<HTMLSelectElement>('#algo-select')!

const dashboard = new Dashboard('metrics')

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

let isRunning = false

runBtn.addEventListener('click', () => {
  if (isRunning) return
  isRunning = true
  runBtn.disabled = true

  const mode = Array.from(modeInputs).find(r => r.checked)!.value
  const speed = 101 - parseInt(speedSlider.value)
  const algorithm = algoSelect.value

  if (mode === 'animated') {
    runAnimated(speed, algorithm)
  } else {
    runInstant(algorithm)
  }
})

clearGridBtn.addEventListener('click', () => {
  grid.reset()
  clickCount = 0
  instructions.textContent = 'Click a cell to place START point'
  runBtn.disabled = true
})

clearPathBtn.addEventListener('click', () => {
  grid.clearPath()
})

function runInstant(algorithm: string): void {
  grid.clearPath()
  const result = bfs(grid)
  dashboard.addResult(algorithm.toUpperCase(), result)
  drawPath(result.path)
  runBtn.disabled = false
  isRunning = false
}

function runAnimated(speed: number, algorithm: string): void {
  grid.clearPath()

  const generator = bfsGenerator(grid)
  let result: AlgorithmResult | undefined

  function step() {
    const next = generator.next()
    if (next.done) {
      result = next.value
      dashboard.addResult(algorithm.toUpperCase(), result!)
      grid.clearPath()
      drawPath(result!.path)
      runBtn.disabled = false
      isRunning = false
      return
    }

    renderWithOverlay(next.value.visited, next.value.path)
    setTimeout(step, speed)
  }

  step()
}

function renderWithOverlay(visited: { x: number; y: number }[], path: { x: number; y: number }[]): void {
  grid.render()
  const ctx = canvas.getContext('2d')!
  const cellSize = 20

  ctx.fillStyle = 'rgba(136, 136, 255, 0.5)'
  for (const { x, y } of visited) {
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
  }

  ctx.fillStyle = 'rgba(255, 136, 136, 0.7)'
  for (const { x, y } of path) {
    const cell = grid.getCell(x, y)
    if (cell && cell.type !== 'start' && cell.type !== 'end') {
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
    }
  }
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