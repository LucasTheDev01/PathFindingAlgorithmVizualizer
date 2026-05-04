import './style.css'
import { Grid } from './grid'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Pathfinding Algorithm Visualizer</h1>
  <canvas id="grid-canvas"></canvas>
`

const canvas = document.querySelector<HTMLCanvasElement>('#grid-canvas')!
const grid = new Grid(canvas, 30, 30)
grid.render()