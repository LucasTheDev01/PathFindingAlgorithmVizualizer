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

export function dijkstra(grid: Grid): AlgorithmResult {
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
    cost: number
    path: { x: number; y: number }[]
  }

  const heap: Node[] = []
  const visited = new Set<string>()

  heap.push({ x: start.x, y: start.y, cost: 0, path: [start] })

  let nodesVisited = 0
  let peakMemory = 0

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }
  ]

  while (heap.length > 0) {
    heap.sort((a, b) => a.cost - b.cost)
    const current = heap.shift()!
    const key = `${current.x},${current.y}`

    if (visited.has(key)) continue
    visited.add(key)
    nodesVisited++

    peakMemory = Math.max(peakMemory, heap.length + visited.size)

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
      const nkey = `${nx},${ny}`

      if (
        grid.isValidCell(nx, ny) &&
        !visited.has(nkey) &&
        !grid.isWall(nx, ny)
      ) {
        heap.push({
          x: nx,
          y: ny,
          cost: current.cost + 1,
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

export function* dijkstraGenerator(grid: Grid): Generator<AlgorithmStep, AlgorithmResult, unknown> {
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
    cost: number
    path: { x: number; y: number }[]
  }

  const heap: Node[] = []
  const visited = new Set<string>()

  heap.push({ x: start.x, y: start.y, cost: 0, path: [start] })

  let nodesVisited = 0
  let peakMemory = 0
  const visitedCells: { x: number; y: number }[] = []

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }
  ]

  while (heap.length > 0) {
    heap.sort((a, b) => a.cost - b.cost)
    const current = heap.shift()!
    const key = `${current.x},${current.y}`

    if (visited.has(key)) continue
    visited.add(key)
    nodesVisited++
    visitedCells.push({ x: current.x, y: current.y })

    peakMemory = Math.max(peakMemory, heap.length + visited.size)

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
      const nkey = `${nx},${ny}`

      if (
        grid.isValidCell(nx, ny) &&
        !visited.has(nkey) &&
        !grid.isWall(nx, ny)
      ) {
        heap.push({
          x: nx,
          y: ny,
          cost: current.cost + 1,
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