<template>
  <div class="minesweeper-container">
    <div class="controls">
      <button @click="changeGridSize(10, 10)">10x10 Grid</button>
      <button @click="changeGridSize(50, 50)">50x50 Grid</button>
      <span>Mines: {{ mineCount }}</span>
    </div>
    <div class="minesweeper-grid" :style="gridStyle">
      <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
        <div
            v-for="(cell, colIndex) in row"
            :key="`${rowIndex}-${colIndex}`"
            class="cell"
            :class="{ 'revealed': cell.isRevealed, 'flagged': cell.isFlagged }"
            @click="revealCell(rowIndex, colIndex)"
            @contextmenu.prevent="flagCell(rowIndex, colIndex)"
        >
          {{ getCellContent(cell) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      grid: [],
      rows: 10,
      cols: 10,
      mineCount: 0,
      gameOver: false
    };
  },
  computed: {
    gridStyle() {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${this.cols}, 20px)`,
        gridTemplateRows: `repeat(${this.rows}, 20px)`
      };
    }
  },
  methods: {
    initializeGrid(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.mineCount = Math.floor(rows * cols * 0.15); // 15% of cells are mines
      this.grid = [];
      this.gameOver = false;

      // Create empty grid
      for (let i = 0; i < rows; i++) {
        this.grid.push([]);
        for (let j = 0; j < cols; j++) {
          this.grid[i].push({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0
          });
        }
      }

      // Place mines
      let minesPlaced = 0;
      while (minesPlaced < this.mineCount) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!this.grid[row][col].isMine) {
          this.grid[row][col].isMine = true;
          minesPlaced++;
        }
      }

      // Calculate neighbor mines
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (!this.grid[i][j].isMine) {
            this.grid[i][j].neighborMines = this.countNeighborMines(i, j);
          }
        }
      }
    },
    countNeighborMines(row, col) {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const newRow = row + i;
          const newCol = col + j;
          if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
            if (this.grid[newRow][newCol].isMine) count++;
          }
        }
      }
      return count;
    },
    revealCell(row, col) {
      if (this.gameOver || this.grid[row][col].isRevealed || this.grid[row][col].isFlagged) return;

      this.grid[row][col].isRevealed = true;

      if (this.grid[row][col].isMine) {
        this.gameOver = true;
        alert('Game Over! You hit a mine!');
        return;
      }

      if (this.grid[row][col].neighborMines === 0) {
        this.revealNeighbors(row, col);
      }

      if (this.checkWin()) {
        this.gameOver = true;
        alert('Congratulations! You won!');
      }
    },
    revealNeighbors(row, col) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const newRow = row + i;
          const newCol = col + j;
          if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
            if (!this.grid[newRow][newCol].isRevealed && !this.grid[newRow][newCol].isFlagged) {
              this.revealCell(newRow, newCol);
            }
          }
        }
      }
    },
    flagCell(row, col) {
      if (this.gameOver || this.grid[row][col].isRevealed) return;
      this.grid[row][col].isFlagged = !this.grid[row][col].isFlagged;
    },
    getCellContent(cell) {
      if (!cell.isRevealed) return cell.isFlagged ? '🚩' : '';
      if (cell.isMine) return '💣';
      return cell.neighborMines > 0 ? cell.neighborMines : '';
    },
    changeGridSize(rows, cols) {
      this.initializeGrid(rows, cols);
    },
    checkWin() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          if (!this.grid[i][j].isMine && !this.grid[i][j].isRevealed) {
            return false;
          }
        }
      }
      return true;
    }
  },
  mounted() {
    this.initializeGrid(this.rows, this.cols);
  }
};
</script>

<style scoped>
.minesweeper-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controls {
  margin-bottom: 10px;
}

.minesweeper-grid {
  border: 1px solid #ccc;
}

.cell {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
}

.cell.revealed {
  background-color: #eee;
}

.cell.flagged {
  background-color: #ffd700;
}
</style>
