import { Grid } from './grid'

export interface GeneratorOptions {
  density: number
}

export function generateRandomMap(grid: Grid, options: GeneratorOptions): void {
  const { density } = options

  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      const cell = grid.getCell(x, y)
      if (cell && cell.type !== 'start' && cell.type !== 'end') {
        if (Math.random() < density / 100) {
          cell.type = 'wall'
        } else {
          cell.type = 'empty'
        }
      }
    }
  }
  grid.render()
}

export function generateMaze(grid: Grid): void {
  const width = grid.width
  const height = grid.height

  const maze: boolean[][] = []
  for (let x = 0; x < width; x++) {
    maze[x] = []
    for (let y = 0; y < height; y++) {
      maze[x][y] = true
    }
  }

  function carve(x: number, y: number): void {
    maze[x][y] = false

    const directions = [
      [0, -2], [2, 0], [0, 2], [-2, 0]
    ].sort(() => Math.random() - 0.5)

    for (const [dx, dy] of directions) {
      const nx = x + dx
      const ny = y + dy
      if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && maze[nx][ny]) {
        maze[x + dx / 2][y + dy / 2] = false
        carve(nx, ny)
      }
    }
  }

  carve(1, 1)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const cell = grid.getCell(x, y)
      if (cell && cell.type !== 'start' && cell.type !== 'end') {
        cell.type = maze[x][y] ? 'wall' : 'empty'
      }
    }
  }
  grid.render()
}

export function generateClusteredMap(grid: Grid, density: number): void {
  const width = grid.width
  const height = grid.height

  const noise: number[][] = []
  for (let x = 0; x < width; x++) {
    noise[x] = []
    for (let y = 0; y < height; y++) {
      const scale = 0.1
      const noiseVal = Math.sin(x * scale) * Math.cos(y * scale) +
        Math.sin(x * scale * 2.3) * Math.cos(y * scale * 2.3) * 0.5
      noise[x][y] = (noiseVal + 1.5) / 3
    }
  }

  const threshold = 1 - (density / 100)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const cell = grid.getCell(x, y)
      if (cell && cell.type !== 'start' && cell.type !== 'end') {
        cell.type = noise[x][y] > threshold ? 'wall' : 'empty'
      }
    }
  }
  grid.render()
}

export function generateWithConnectivity(grid: Grid, density: number): void {
  generateRandomMap(grid, { density })

  const start = grid.getStartPos()
  const end = grid.getEndPos()
  if (!start || !end) return

  const visited = new Set<string>()
  const queue = [start]
  visited.add(`${start.x},${start.y}`)

  const directions = [
    { dx: 0, dy: -1 }, { dx: 1, dy: 0 },
    { dx: 0, dy: 1 }, { dx: -1, dy: 0 }
  ]

  while (queue.length > 0) {
    const current = queue.shift()!
    if (current.x === end.x && current.y === end.y) return

    for (const { dx, dy } of directions) {
      const nx = current.x + dx
      const ny = current.y + dy
      const key = `${nx},${ny}`
      if (
        grid.isValidCell(nx, ny) &&
        !visited.has(key) &&
        !grid.isWall(nx, ny)
      ) {
        visited.add(key)
        queue.push({ x: nx, y: ny })
      }
    }
  }

  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      const key = `${x},${y}`
      const cell = grid.getCell(x, y)
      if (cell && !visited.has(key) && cell.type !== 'start' && cell.type !== 'end') {
        cell.type = 'empty'
      }
    }
  }
  grid.render()
}