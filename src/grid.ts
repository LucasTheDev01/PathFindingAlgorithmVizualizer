export type CellType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path'

export interface Cell {
  x: number
  y: number
  type: CellType
}

export class Grid {
  private cells: Cell[][]
  private cellSize: number

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
}