import { Grid } from '../grid'

export interface AlgorithmResult {
  path: { x: number; y: number }[]
  nodesVisited: number
  executionTime: number
  pathLength: number
  memoryEstimate: number
  found: boolean
}

export interface AlgorithmStep {
  visited: { x: number; y: number }[]
  path: { x: number; y: number }[]
}

function heuristic(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

export function greedyBestFirst(grid: Grid): AlgorithmResult {
  const start = grid.getStartPos()
  const end = grid.getEndPos()

  if (!start || !end) {
    return {
      path: [],
      nodesVisited: 0,
      executionTime: 0,
      pathLength: 0,
      memoryEstimate: 0,
      found: false
    }
  }

  const startTime = performance.now()

  interface Node {
    x: number
    y: number
    h: number
    path: { x: number; y: number }[]
  }

  const openSet: Node[] = []
  const visited = new Set<string>()

  openSet.push({
    x: start.x,
    y: start.y,
    h: heuristic(start.x, start.y, end.x, end.y),
    path: [start]
  })
  visited.add(`${start.x},${start.y}`)

  let nodesVisited = 0
  let peakMemory = 0

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }
  ]

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.h - b.h)
    const current = openSet.shift()!
    nodesVisited++

    peakMemory = Math.max(peakMemory, openSet.length + visited.size)

    if (current.x === end.x && current.y === end.y) {
      const endTime = performance.now()
      return {
        path: current.path,
        nodesVisited,
        executionTime: endTime - startTime,
        pathLength: current.path.length,
        memoryEstimate: peakMemory,
        found: true
      }
    }

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
        openSet.push({
          x: nx,
          y: ny,
          h: heuristic(nx, ny, end.x, end.y),
          path: [...current.path, { x: nx, y: ny }]
        })
      }
    }
  }

  const endTime = performance.now()
  return {
    path: [],
    nodesVisited,
    executionTime: endTime - startTime,
    pathLength: 0,
    memoryEstimate: peakMemory,
    found: false
  }
}

export function* greedyBestFirstGenerator(grid: Grid): Generator<AlgorithmStep, AlgorithmResult, unknown> {
  const start = grid.getStartPos()
  const end = grid.getEndPos()

  if (!start || !end) {
    return {
      path: [],
      nodesVisited: 0,
      executionTime: 0,
      pathLength: 0,
      memoryEstimate: 0,
      found: false
    }
  }

  const startTime = performance.now()

  interface Node {
    x: number
    y: number
    h: number
    path: { x: number; y: number }[]
  }

  const openSet: Node[] = []
  const visited = new Set<string>()

  openSet.push({
    x: start.x,
    y: start.y,
    h: heuristic(start.x, start.y, end.x, end.y),
    path: [start]
  })
  visited.add(`${start.x},${start.y}`)

  let nodesVisited = 0
  let peakMemory = 0
  const visitedCells: { x: number; y: number }[] = []

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }
  ]

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.h - b.h)
    const current = openSet.shift()!
    nodesVisited++
    visitedCells.push({ x: current.x, y: current.y })

    peakMemory = Math.max(peakMemory, openSet.length + visited.size)

    yield {
      visited: [...visitedCells],
      path: current.path
    }

    if (current.x === end.x && current.y === end.y) {
      const endTime = performance.now()
      return {
        path: current.path,
        nodesVisited,
        executionTime: endTime - startTime,
        pathLength: current.path.length,
        memoryEstimate: peakMemory,
        found: true
      }
    }

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
        openSet.push({
          x: nx,
          y: ny,
          h: heuristic(nx, ny, end.x, end.y),
          path: [...current.path, { x: nx, y: ny }]
        })
      }
    }
  }

  const endTime = performance.now()
  return {
    path: [],
    nodesVisited,
    executionTime: endTime - startTime,
    pathLength: 0,
    memoryEstimate: peakMemory,
    found: false
  }
}