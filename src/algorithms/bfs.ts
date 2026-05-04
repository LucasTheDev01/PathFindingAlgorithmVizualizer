import { Grid } from '../grid'

export interface AlgorithmResult {
  path: { x: number; y: number }[]
  nodesVisited: number
  executionTime: number
  pathLength: number
  memoryEstimate: number
  found: boolean
}

export function bfs(grid: Grid): AlgorithmResult {
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

  const queue: { x: number; y: number; path: { x: number; y: number }[] }[] = []
  const visited = new Set<string>()

  queue.push({ x: start.x, y: start.y, path: [start] })
  visited.add(`${start.x},${start.y}`)

  let nodesVisited = 0
  let peakMemory = 0

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }
  ]

  while (queue.length > 0) {
    const current = queue.shift()!
    nodesVisited++

    peakMemory = Math.max(peakMemory, queue.length + visited.size)

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
        queue.push({
          x: nx,
          y: ny,
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