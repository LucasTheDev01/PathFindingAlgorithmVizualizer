import { AlgorithmResult } from './algorithms/bfs'

export interface DashboardResult extends AlgorithmResult {
  id: number
  algorithm: string
  timestamp: Date
}

export class Dashboard {
  private results: DashboardResult[] = []
  private idCounter = 0
  private container: HTMLElement

  constructor(containerId: string) {
    const container = document.getElementById(containerId)
    if (!container) throw new Error(`Container ${containerId} not found`)
    this.container = container
    this.render()
  }

  addResult(algorithm: string, result: AlgorithmResult): void {
    this.results.push({
      ...result,
      id: ++this.idCounter,
      algorithm,
      timestamp: new Date()
    })
    this.render()
  }

  clear(): void {
    this.results = []
    this.render()
  }

  getResults(): DashboardResult[] {
    return [...this.results]
  }

  render(): void {
    if (this.results.length === 0) {
      this.container.innerHTML = `
        <div class="dashboard">
          <div class="dashboard-header">
            <h3>Metrics Dashboard</h3>
            <button id="clear-history">Clear History</button>
          </div>
          <p class="no-results">No runs yet</p>
        </div>
      `
      this.setupClearButton()
      return
    }

    const rows = this.results.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.algorithm}</td>
        <td>${r.timestamp.toLocaleTimeString()}</td>
        <td>${r.executionTime.toFixed(2)} ms</td>
        <td>${r.nodesVisited}</td>
        <td>${r.pathLength}</td>
        <td>${r.memoryEstimate}</td>
        <td>${r.found ? 'Yes' : 'No'}</td>
      </tr>
    `).join('')

    this.container.innerHTML = `
      <div class="dashboard">
        <div class="dashboard-header">
          <h3>Metrics Dashboard</h3>
          <button id="clear-history">Clear History</button>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Algorithm</th>
                <th>Time</th>
                <th>Exec Time</th>
                <th>Nodes</th>
                <th>Path</th>
                <th>Memory</th>
                <th>Found</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `

    this.setupClearButton()
  }

  private setupClearButton(): void {
    const btn = document.getElementById('clear-history')
    if (btn) {
      btn.addEventListener('click', () => this.clear())
    }
  }
}