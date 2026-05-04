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

export function aStar(grid: Grid): AlgorithmResult {
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
    g: number
    h: number
    f: number
    path: { x: number; y: number }[]
  }

  const openSet: Node[] = []
  const closedSet = new Set<string>()

  openSet.push({
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristic(start.x, start.y, end.x, end.y),
    f: heuristic(start.x, start.y, end.x, end.y),
    path: [start]
  })

  let nodesVisited = 0
  let peakMemory = 0

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }
  ]

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f)
    const current = openSet.shift()!
    const currentKey = `${current.x},${current.y}`

    if (closedSet.has(currentKey)) continue
    closedSet.add(currentKey)
    nodesVisited++

    peakMemory = Math.max(peakMemory, openSet.length + closedSet.size)

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
      const neighborKey = `${nx},${ny}`

      if (
        grid.isValidCell(nx, ny) &&
        !closedSet.has(neighborKey) &&
        !grid.isWall(nx, ny)
      ) {
        const g = current.g + 1
        const h = heuristic(nx, ny, end.x, end.y)
        const f = g + h

        const existing = openSet.find(n => n.x === nx && n.y === ny)
        if (!existing || g < existing.g) {
          if (existing) {
            existing.g = g
            existing.h = h
            existing.f = f
            existing.path = [...current.path, { x: nx, y: ny }]
          } else {
            openSet.push({
              x: nx,
              y: ny,
              g,
              h,
              f,
              path: [...current.path, { x: nx, y: ny }]
            })
          }
        }
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

export function* aStarGenerator(grid: Grid): Generator<AlgorithmStep, AlgorithmResult, unknown> {
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
    g: number
    h: number
    f: number
    path: { x: number; y: number }[]
  }

  const openSet: Node[] = []
  const closedSet = new Set<string>()

  openSet.push({
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristic(start.x, start.y, end.x, end.y),
    f: heuristic(start.x, start.y, end.x, end.y),
    path: [start]
  })

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
    openSet.sort((a, b) => a.f - b.f)
    const current = openSet.shift()!
    const currentKey = `${current.x},${current.y}`

    if (closedSet.has(currentKey)) continue
    closedSet.add(currentKey)
    nodesVisited++
    visitedCells.push({ x: current.x, y: current.y })

    peakMemory = Math.max(peakMemory, openSet.length + closedSet.size)

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
      const neighborKey = `${nx},${ny}`

      if (
        grid.isValidCell(nx, ny) &&
        !closedSet.has(neighborKey) &&
        !grid.isWall(nx, ny)
      ) {
        const g = current.g + 1
        const h = heuristic(nx, ny, end.x, end.y)
        const f = g + h

        const existing = openSet.find(n => n.x === nx && n.y === ny)
        if (!existing || g < existing.g) {
          if (existing) {
            existing.g = g
            existing.h = h
            existing.f = f
            existing.path = [...current.path, { x: nx, y: ny }]
          } else {
            openSet.push({
              x: nx,
              y: ny,
              g,
              h,
              f,
              path: [...current.path, { x: nx, y: ny }]
            })
          }
        }
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