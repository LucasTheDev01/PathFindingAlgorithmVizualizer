export type CellType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path'

export interface Cell {
  x: number
  y: number
  type: CellType
}

export type PlacementState = 'place-start' | 'place-end' | 'draw-walls' | 'idle'

export class Grid {
  private cells: Cell[][]
  private cellSize: number
  private startPos: { x: number; y: number } | null = null
  private endPos: { x: number; y: number } | null = null

  constructor(
    private canvas: HTMLCanvasElement,
    public width: number,
    public height: number
  ) {
    this.cellSize = 20
    this.canvas.width = width * this.cellSize
    this.canvas.height = height * this.cellSize

    this.cells = []
    for (let x = 0; x < width; x++) {
      this.cells[x] = []
      for (let y = 0; y < height; y++) {
        this.cells[x][y] = { x, y, type: 'empty' }
      }
    }

    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('click', this.handleClick.bind(this))
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  private isDrawing = false
  private isErasing = false

  private handleClick(event: MouseEvent): void {
    const { x, y } = this.getCellFromEvent(event)

    if (!this.startPos) {
      this.setStart(x, y)
    } else if (!this.endPos) {
      this.setEnd(x, y)
    }
  }

  private handleMouseDown(event: MouseEvent): void {
    const { x, y } = this.getCellFromEvent(event)
    if (this.startPos && this.endPos) {
      this.isDrawing = true
      this.isErasing = event.button === 2
      if (this.isErasing) {
        this.removeWall(x, y)
      } else {
        this.addWall(x, y)
      }
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.isDrawing) {
      const { x, y } = this.getCellFromEvent(event)
      if (this.isErasing) {
        this.removeWall(x, y)
      } else {
        this.addWall(x, y)
      }
    }
  }

  private handleMouseUp(): void {
    this.isDrawing = false
  }

  private getCellFromEvent(event: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / this.cellSize)
    const y = Math.floor((event.clientY - rect.top) / this.cellSize)
    return { x, y }
  }

  private setStart(x: number, y: number): void {
    if (this.startPos) {
      this.cells[this.startPos.x][this.startPos.y].type = 'empty'
    }
    this.startPos = { x, y }
    this.cells[x][y].type = 'start'
    this.render()
  }

  private setEnd(x: number, y: number): void {
    if (this.endPos) {
      this.cells[this.endPos.x][this.endPos.y].type = 'empty'
    }
    this.endPos = { x, y }
    this.cells[x][y].type = 'end'
    this.render()
  }

  private addWall(x: number, y: number): void {
    if (this.isValidCell(x, y)) {
      const cell = this.cells[x][y]
      if (cell.type !== 'start' && cell.type !== 'end' && cell.type !== 'wall') {
        cell.type = 'wall'
        this.render()
      }
    }
  }

  private removeWall(x: number, y: number): void {
    if (this.isValidCell(x, y)) {
      const cell = this.cells[x][y]
      if (cell.type === 'wall') {
        cell.type = 'empty'
        this.render()
      }
    }
  }

  isValidCell(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  render(): void {
    const ctx = this.canvas.getContext('2d')!
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const cell = this.cells[x][y]
        ctx.fillStyle = this.getCellColor(cell.type)
        ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
        ctx.strokeStyle = '#ccc'
        ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
      }
    }
  }

  private getCellColor(type: CellType): string {
    switch (type) {
      case 'empty': return '#fff'
      case 'wall': return '#333'
      case 'start': return '#0f0'
      case 'end': return '#f00'
      case 'visited': return '#88f'
      case 'path': return '#f88'
    }
  }

  getCell(x: number, y: number): Cell | undefined {
    return this.cells[x]?.[y]
  }

  isWall(x: number, y: number): boolean {
    return this.cells[x]?.[y]?.type === 'wall'
  }

  getStartPos(): { x: number; y: number } | null {
    return this.startPos
  }

  getEndPos(): { x: number; y: number } | null {
    return this.endPos
  }
}