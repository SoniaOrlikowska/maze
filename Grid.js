//"use strict";
//import Cell from "./Cell.js";
class Grid {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.prepare_grid();
    this.configure_cells();
   
    this.size = this.size();
    this.start = this.get_cell(0,0);
   

 
  }
  prepare_grid() {
    this.grid = new Array(this.rows);
    for (let i = 0; i < this.rows; i += 1) {
      this.grid[i] = new Array(this.columns);
      for (let j = 0; j < this.columns; j += 1) {
        this.grid[i][j] = new Cell(i, j);
      }
    }
  }
  get_averagePathLength(start) {  
    let sum = 0;
    let path_counter = 0;
    let cell_gen = this.each_cell();
    let averagePathLength = 0
    while (true) {
      let cell = cell_gen.next().value;
      if (!cell) break;
      if (cell.get_links().length == 1) {
        path_counter++;
        let distanceArray = start.distances()[0];
        let deadend_distance = distanceArray.cells[cell.get_id()];
        sum += deadend_distance;
      }
    }
    //averagePathLength = sum / path_counter;
    //return averagePathLength.toFixed(3);
   
    return sum / path_counter;
  }
  create_more_links(ratio) {
    let cells_with_additional_links = this.listOfCells_to_change(ratio);
    cells_with_additional_links.forEach((element) => {
      if (
        element.row != 0 &&
        element.row != this.rows &&
        element.column != 0 &&
        element.column != this.columns
      ) {
        if (element.north != null) element.link(element.north);
      }
    });
  }
  create_some_directions(ratio) {
    //kompletnie porąbana metoda ale działa
    let directed_cells = new Array();
    let totalMazeCellNumbers = this.rows * this.columns;
    let numberOfCellToEdit = Math.round(ratio * totalMazeCellNumbers);
    let cells_to_be_directed = this.listOfCells_to_change(ratio);
   
    cells_to_be_directed.forEach((element) => {    
      let cell_links = element.get_links();
      if (cell_links.length > 1) {
         let key = this.get_random_elementFromArray(cell_links);
        element.unlink_onedirection(this.getcell(key));
      }
    });
  }
  listOfCells_to_change(ratio) {
    let totalMazeCellNumbers = this.rows * this.columns;
    let numberOfCellToEdit = Math.round(ratio * totalMazeCellNumbers);
    let cells_toBe_changed = new Array();
    let cells_toBe_changed_without_duplicates = new Array();

    for (let index = 0; index < numberOfCellToEdit; index++) {
      let cell = this.get_random_cell();
      if (cells_toBe_changed.length == 0) cells_toBe_changed.push(cell);
      else {
        cells_toBe_changed.push(cell);
      }
      cells_toBe_changed_without_duplicates = [...new Set(cells_toBe_changed)];
    }
    return cells_toBe_changed_without_duplicates;
  }
  configure_cells() {
    for (let i = 0; i < this.rows; i += 1) {
      for (let j = 0; j < this.columns; j += 1) {
        let cell = this.get_cell(i, j);
        if (cell == null) continue;
        let row = cell.row;
        let col = cell.column;
        if (row > 0) cell.north = this.get_cell(row - 1, col);
        if (row < this.rows - 1) cell.south = this.get_cell(row + 1, col);
        if (col > 0) cell.west = this.get_cell(row, col - 1);
        if (col < this.columns - 1) cell.east = this.get_cell(row, col + 1);
      }
    }
  }
  get_cell(row, column) {
    if (row < 0 || row > this.rows - 1) return null;
    if (column < 0 || column > this.columns - 1) return null;
    return this.grid[row][column];
  }
  getcell(cellString) {
    let cell_id_array = cellString.split("#");
    let x = cell_id_array[0];
    let y = cell_id_array[1];

    return this.grid[x][y];
  }
  get_random_elementFromArray(array) {
    let len = array.length;
    let i = Math.round(Math.random() * (len - 1 - 0) + 0);
    return array[i];
  }
  get_random_cell() {
    let row = Math.floor(Math.random() * this.rows);
    let column = Math.floor(Math.random() * this.grid[row].length);

    return this.get_cell(row, column);
  }
  size() {
    return this.rows * this.columns;
  }
  *each_row() {
    for (let i = 0; i < this.rows; i += 1) {
      yield this.grid[i];
    }
  }
  *each_cell() {
    let row_gen = this.each_row();
    for (let i = 0; i < this.rows; i += 1) {
      let row = row_gen.next().value;
      for (let j = 0; j < row.length; j += 1) {
        if (row[j]) yield row[j];
      }
    }
  }
  contents_of(cell) {
    return " ";
  }
  // set_maze_paths(paths){
  // 	this.maze_paths.push(paths);
  // }
  // get_maze_paths(){
  // 	return this.maze_paths;
  // }

  clear_solution() {
    let cell_gen = this.each_cell();
    while (true) {
      let cell = cell_gen.next().value;
      if (!cell) break;
      cell.set_visited(false);
      cell.set_solution(false);
    }
    return this;
  }
  toString() {
    let output = "";
    output += "+" + "---+".repeat(this.columns) + "\n";
    let row_gen = this.each_row();
    while (true) {
      let row = row_gen.next().value;
      if (!row) break;

      let top = "|";
      let bottom = "+";

      for (let j = 0; j < row.length; j += 1) {
        let cell = row[j];
        if (!cell) cell = new Cell(-1, -1);

        let body = "   ";
        let east_boundary = cell.east && cell.isLinked(cell.east) ? " " : "|";
        top += body + east_boundary;

        let south_boundary =
          cell.south && cell.isLinked(cell.south) ? "   " : "---";
        let corner = "+";
        bottom += south_boundary + corner;
      }
      output += top + "\n";
      output += bottom + "\n";
    }
    return output;
  }
  toStringDistance() {
    let output = "";
    output += "+" + "---+".repeat(this.columns) + "\n";
    let row_gen = this.each_row();
    while (true) {
      let row = row_gen.next().value;
      if (!row) break;
      let top = "|";
      let bottom = "+";
      for (let j = 0; j < row.length; j += 1) {
        let cell = row[j];
        // let body = '   '
        let body = ` ${this.contents_of(cell)} `;
        let east_boundary = cell.east && cell.isLinked(cell.east) ? " " : "|";
        top += body + east_boundary;
        let south_boundary =
          cell.south && cell.isLinked(cell.south) ? "   " : "---";
        let corner = "+";
        bottom += south_boundary + corner;
      }
      output += top + "\n";
      output += bottom + "\n";
    }
    return output;
  }
  

  to_img(ctx, cellSize) {
    //ctx.strokeStyle = `rgb(100, 149, 237)`
    ctx.strokeStyle = `black`;

    let cell_gen = this.each_cell();
    while (true) {
      let cell = cell_gen.next().value;
      if (!cell) break;

      let x1 = cell.column * cellSize;
      let y1 = cell.row * cellSize;
      let x2 = (cell.column + 1) * cellSize;
      let y2 = (cell.row + 1) * cellSize;

      if (!cell.north) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.stroke();
      }
      if (!cell.west) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y2);
        ctx.stroke();
      }
      if ((cell.east && !cell.isLinked(cell.east)) || !cell.east) {
        ctx.moveTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      if ((cell.south && !cell.isLinked(cell.south)) || !cell.south) {
        ctx.moveTo(x1, y2);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  }
  calculate_degree() {
    let cell_gen = this.each_cell();
    let deadends_array = new Array();
    let forks_array = new Array();
    let intersections_array = new Array();
    let cross_array = new Array();
    let numberOfNodes = this.rows * this.columns;
    while (true) {
      let cell = cell_gen.next().value;
      if (!cell) break;
      let degree = cell.get_links().length.toString();
      switch (degree) {
        case "1":
          deadends_array.push(cell.get_id());
          const key1 = "deadend";
          cell[key1] = true;
          const k1 = "degree";
          cell[k1] = 1;
          break;
        case "2":
          forks_array.push(cell.get_id());
          const key2 = "fork";
          cell[key2] = true;
          const k2 = "degree";
          cell[k2] = 2;
          break;
        case "3":
          intersections_array.push(cell.get_id());
          const key3 = "intersection";
          cell[key3] = true;
          const k3 = "degree";
          cell[k3] = 3;
          break;
        case "4":
          cross_array.push(cell.get_id());
          const key4 = "cross";
          cell[key4] = true;
          const k4 = "degree";
          cell[k4] = 1;
          break;
      }
    }
    return [deadends_array, forks_array, intersections_array, cross_array];
  }

  draw_img_density(ctx, cellSize) {
    let cell_gen = this.each_cell();
    //let i = 0;
    while (true) {
      let cell = cell_gen.next().value;
      if(!cell) break;

      if (cell.deadend == true) {
        //ctx.globalAlpha = 0.5;
        ctx.fillStyle = `rgb(248,236, 54)`;
        ctx.fillRect(
          cell.column * cellSize + 1,
          cell.row * cellSize + 1,
          cellSize,
          cellSize
        );
      }

      if (cell.fork == true) {
        //ctx.globalAlpha = 0.3;
        ctx.fillStyle = "white";
        //ctx.fillStyle = `rgb(255,255,255`;
        ctx.fillRect(
          cell.column * cellSize + 1,
          cell.row * cellSize + 1,
          cellSize,
          cellSize
        );
      }

      if (cell.intersection == true) {
        //ctx.globalAlpha = 0.5;
        ctx.fillStyle = `rgb(223,76,247)`;
        ctx.fillRect(
          cell.column * cellSize + 1,
          cell.row * cellSize + 1,
          cellSize,
          cellSize
        );
      }
      if (cell.cross == true) {
        //ctx.globalAlpha = 0.5;
        ctx.fillStyle = `rgb(10,20,240)`;
        ctx.fillRect(
          cell.column * cellSize + 1,
          cell.row * cellSize + 1,
          cellSize,
          cellSize
        );
      }
    }
  }

  draw_img_solution(ctx, cellSize, color, start, end) {
    let cell_gen = this.each_cell();
    //let i = 0;
    let cell = start;
    while (cell != end) {
      cell = cell_gen.next().value;
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = color;
      //ctx.fillStyle = `rgba(0,0,255,${(i+1)/100})`;
      //i++;
      const key = "solution";
      if (cell[key] == true) {
        ctx.fillRect(
          cell.column * cellSize + 1,
          cell.row * cellSize + 1,
          cellSize,
          cellSize
        );
      } else {
      }
    }
  }

  toString2() {
    let output = "";
    output += "+" + "---+".repeat(this.columns) + "\n";
    let row_gen = this.each_row();
    while (true) {
      let row = row_gen.next().value;
      if (!row) break;

      let top = "|";
      let bottom = "+";

      for (let j = 0; j < row.length; j += 1) {
        let cell = row[j];

        let body = " ";
        const key = "solution";
        if (cell[key] === true) {
          body = " > ";
          //}else{body = ` ${this.contents_of(cell)} `}
        } else {
          body = "   ";
        }

        let east_boundary = cell.east && cell.isLinked(cell.east) ? " " : "|";
        top += body + east_boundary;

        let south_boundary =
          cell.south && cell.isLinked(cell.south) ? "   " : "---";
        let corner = "+";
        bottom += south_boundary + corner;
      }

      output += top + "\n";
      output += bottom + "\n";
    }
    return output;
  }
  getNeigbours(cell_id, goal_id) {
    let current_cell = super.getcell(cell_id);
    let neighbours_ids = current_cell.get_links();
    let neighbours_arr = new Array();

    neighbours_ids.forEach((neighbour_id) => {
      let g = current_cell.g_score + 1;
      let h = this.calculate_manhattanDistance(neighbour_id, goal_id);
      let f = g + h;
      let neighbour_details = {
        id: neighbour_id,
        g_value: g,
        h_value: h,
        f_value: f,
      };
      neighbours_arr.push(neighbour_details);
    });
    return neighbours_arr;
  }
  getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue) return key;
    }
  }
}
