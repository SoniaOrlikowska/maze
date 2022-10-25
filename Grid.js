"use strict"
//import Cell from "./Cell.js"
//export default class Grid {
	class Grid{
	constructor(rows, columns) {
		this.rows = rows
		this.columns = columns
		this.prepare_grid()
		this.configure_cells()
		this.maze_paths = []
	}

	prepare_grid() {
		this.grid = new Array(this.rows)
		for (let i = 0; i < this.rows; i += 1) {
			this.grid[i] = new Array(this.columns)
			for (let j = 0; j < this.columns; j += 1) {
				this.grid[i][j] = new Cell(i, j)
			}
		}
	}
	create_more_links(){
		let cell_gen = this.each_cell();
		while(true){
			let cell = cell_gen.next().value;
			if(!cell) break;
			if(cell.row == 2 ) cell.link(cell.north);
			if(cell.column == 2) cell.link(cell.east);
			if(cell.column == 1) cell.link(cell.west);
			
		}
	}

	configure_cells() {
		for (let i = 0; i < this.rows; i += 1) {
			for (let j = 0; j < this.columns; j += 1) {
				let cell = this.get_cell(i, j)
				if (cell == null) continue
				let row = cell.row
				let col = cell.column
				if (row > 0) 		   cell.north = this.get_cell(row-1, col)
				if (row < this.rows-1) cell.south = this.get_cell(row+1, col)
				if (col > 0) 		   cell.west  = this.get_cell(row, col-1)
				if (col < this.columns-1) cell.east  = this.get_cell(row, col+1)
			}
		}
	}

	get_cell(row, column) {
		if (row < 0 || row > this.rows - 1) 		 return null
		if (column < 0 || column > this.columns - 1) return null
		return this.grid[row][column]
	}

	getcell(cellString){
		let cell_id_array = cellString.split("#");
		let x = cell_id_array[0];
		let y = cell_id_array[1];
  
		return this.grid[x][y];
	  }

	get_random_cell() {
		let row = Math.floor(Math.random() * this.rows)
		let column = Math.floor(Math.random() * this.grid[row].length)

		return this.get_cell(row, column)
	}

	size() {
		return this.rows * this.columns
	}

	* each_row() {
		for (let i = 0; i < this.rows; i += 1) {
			yield this.grid[i]
		}
	}

	* each_cell() {
		let row_gen = this.each_row()
		for (let i = 0; i < this.rows; i += 1) {
			let row = row_gen.next().value;
			for (let j = 0; j < row.length; j += 1) {
				if (row[j]) yield row[j]
			}
		}
		
	}

	contents_of(cell) {
		return ' '
	}

	set_maze_paths(paths){
		this.maze_paths.push(paths);
	}
	get_maze_paths(){
		return this.maze_paths;
	}

	toString() {
		let output = ''
		output += '+' + '---+'.repeat(this.columns) + '\n'
		let row_gen = this.each_row()
		while (true) {
			let row = row_gen.next().value
			if (!row) break

			let top = '|'
			let bottom = '+'

			for (let j = 0; j < row.length; j += 1) {
				let cell = row[j]
				if (!cell) cell = new Cell(-1, -1)

				let body = '   '
				let east_boundary = (cell.east && cell.isLinked(cell.east)) ? ' ' : '|'
				top += body + east_boundary

				let south_boundary = (cell.south && cell.isLinked(cell.south)) ? '   ' : '---'
				let corner = '+'
				bottom += south_boundary + corner
			}
			output += top + '\n'
			output += bottom + '\n'
		}
		return output
	}
	clear_solution(){
		let cell_gen = this.each_cell()
		while (true) {
			let cell = cell_gen.next().value
			if(!cell) break	
			cell.set_visited(false);
			cell.set_solution(false);
			
		}
		return this;
	}
	toStringDistance() {
		let output = ''
		output += '+' + '---+'.repeat(this.columns) + '\n'
		let row_gen = this.each_row()
		while (true) {
			let row = row_gen.next().value
			if (!row) break

			let top = '|'
			let bottom = '+'

			for (let j = 0; j < row.length; j += 1) {
				let cell = row[j]
				
				// let body = '   '
				let body = ` ${this.contents_of(cell)} `
				let east_boundary = (cell.east && cell.isLinked(cell.east)) ? ' ' : '|'
				top += body + east_boundary

				let south_boundary = (cell.south && cell.isLinked(cell.south)) ? '   ' : '---'
				let corner = '+'
				bottom += south_boundary + corner
			}

			output += top + '\n'
			output += bottom + '\n'
		}
		return output
	}


	to_img(ctx, cellSize) {
		//ctx.strokeStyle = `rgb(100, 149, 237)`
		ctx.strokeStyle = `black`

		let cell_gen = this.each_cell();
		while (true) {
			let cell = cell_gen.next().value
			if (!cell) break

			let x1 = cell.column * cellSize
			let y1 = cell.row * cellSize
			let x2 = (cell.column + 1) * cellSize
			let y2 = (cell.row + 1) * cellSize

			if (!cell.north) {
				ctx.moveTo(x1, y1)
				ctx.lineTo(x2, y1)
				ctx.stroke()
			}
			if (!cell.west) {
				ctx.moveTo(x1, y1)
				ctx.lineTo(x1, y2)	
				ctx.stroke()
			}
			if ((cell.east && !cell.isLinked(cell.east)) || !cell.east) {
				ctx.moveTo(x2, y1)
				ctx.lineTo(x2, y2)
				ctx.stroke()
			}
			if ((cell.south && !cell.isLinked(cell.south)) || !cell.south) {
				ctx.moveTo(x1, y2)
				ctx.lineTo(x2, y2)
				ctx.stroke()
			}
		}
	}
	calculate_degree(){
		let cell_gen = this.each_cell();
		let deadends_array = new Array();
		let forks_array = new Array();
		let intersections_array = new Array();
		let cross_array = new Array();
		let numberOfNodes = this.rows * this.columns;
		while(true){
			let cell = cell_gen.next().value;
			if (!cell) break
			let degree = cell.get_links().length.toString();
			switch (degree){
				case '1':
					deadends_array.push(cell.get_id());
					const key1 = "deadend"
        			cell[key1] = true;
					break;
				case '2':
					forks_array.push(cell.get_id());
					const key2 = "fork"
					cell[key2] = true;
					break;	
				case '3':
					intersections_array.push(cell.get_id());
					const key3 = "intersection"
					cell[key3] = true;
					break;	
				case '4':
					cross_array.push(cell.get_id());
					const key4 = "cross"
					cell[key4] = true;
					break;		
			}
		}
	
	return [deadends_array, forks_array, intersections_array, cross_array];

	}

	draw_img_density(ctx,cellSize){
		let cell_gen = this.each_cell();
		//let i = 0;
		while (true) {
			let cell = cell_gen.next().value
			if(cell.deadend == true){
				//ctx.globalAlpha = 0.5;
			    ctx.fillStyle = `rgb(248,236, 54)`;
				ctx.fillRect(cell.column*cellSize + 1,cell.row*cellSize + 1,cellSize,cellSize);
			}

			if(cell.fork == true){
			    //ctx.globalAlpha = 0.3;
				ctx.fillStyle = "white";
			   //ctx.fillStyle = `rgb(255,255,255`;
				ctx.fillRect(cell.column*cellSize + 1,cell.row*cellSize + 1,cellSize,cellSize);
			}

			if(cell.intersection == true){
				//ctx.globalAlpha = 0.5;
			    ctx.fillStyle =`rgb(223,76,247)`
				ctx.fillRect(cell.column*cellSize + 1,cell.row*cellSize + 1,cellSize,cellSize);
			}
			if(cell.cross == true){
				//ctx.globalAlpha = 0.5;
			    ctx.fillStyle =`rgb(10,20,240)`
				ctx.fillRect(cell.column*cellSize + 1,cell.row*cellSize + 1,cellSize,cellSize);
			}
		}
	}

	draw_img_solution(ctx,cellSize,color,start,end){
		let cell_gen = this.each_cell();
		//let i = 0;
		let cell = start;
		while (cell != end) {
			cell = cell_gen.next().value
			ctx.globalAlpha = 0.3;
			ctx.fillStyle =color;
			//ctx.fillStyle = `rgba(0,0,255,${(i+1)/100})`;
			//i++;
			const key = "solution";
			if(cell[key] == true){
				ctx.fillRect(cell.column*cellSize + 1,cell.row*cellSize + 1,cellSize,cellSize);
			}else{
				
			}
		}
	}

	toString2() {
		let output = ''
		output += '+' + '---+'.repeat(this.columns) + '\n'
		let row_gen = this.each_row()
		while (true) {
			let row = row_gen.next().value
			if (!row) break

			let top = '|'
			let bottom = '+'

			for (let j = 0; j < row.length; j += 1) {
				let cell = row[j]
				
				let body = ' '
				const key = "solution";
				//console.log(cell.solution);
				//console.log(cell.solution === true);
				//console.log("----------------------------");
				
				if(cell[key] === true){ 
					body = " > ";
				//}else{body = ` ${this.contents_of(cell)} `}
				}else{body = "   "}
				
				let east_boundary = (cell.east && cell.isLinked(cell.east)) ? ' ' : '|'
				top += body + east_boundary

				let south_boundary = (cell.south && cell.isLinked(cell.south)) ? '   ' : '---'
				let corner = '+'
				bottom += south_boundary + corner
			}

			output += top + '\n'
			output += bottom + '\n'
		}
		return output
	}


	getNeigbours(cell_id, goal_id){
		let current_cell = super.getcell(cell_id);
		let neighbours_ids = current_cell.get_links();
		let neighbours_arr = new Array();
		
		neighbours_ids.forEach(neighbour_id => {
			let g = current_cell.g_score + 1;
			let h = this.calculate_manhattanDistance(neighbour_id,goal_id);
			let f = g + h;
			let neighbour_details = {
				id : neighbour_id,
				g_value : g,
				h_value : h,
				f_value : f
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
	  calculate_manhattanDistance(neighbour_id, goal_id) {
		let adjacent_coordinates = neighbour_id.split("#");
		let adjacent_x = adjacent_coordinates[0];
		let adjacent_y = adjacent_coordinates[1];
	
		let goal_coordinates = goal_id.split("#");
		let goal_x = goal_coordinates[0];
		let goal_y = goal_coordinates[1];
	
		let heuristic_distance =
		  Math.abs(goal_x - adjacent_x) + Math.abs(goal_y - adjacent_y);
	
		return heuristic_distance;
	  }
	  find_lowest_f_value_cell(list){
		 let fvalue_array = list.map(cell => cell.f_score);
		 let minimal_fscore = Math.min(...fvalue_array);
		 let element_minimal_fvalue = list.find(element => element.f_score == minimal_fscore);
		 return element_minimal_fvalue;
	  }
	
	  isNeighbour_in_both_lists(openlist,closelist,neighbour){
		return openlist.filter(element => element.id === neighbour.id).length > 0 && closelist.filter(element => element.id === neighbour.id).length > 0;
	  }
	
	  is_in_either_lists(openlist,closelist,id){
		if(closelist.find(element => element.get_id() == id ) == undefined && openlist.find(element => element.get_id() == id ) == undefined){ 
			   return true;}else{
				   return false;
			   }
	}
	removeElement(array, value){
		return array.filter(function(element){
			return element != value;
		});
	}
	retreive_astar_path(start, end){
		let startTime  = performance.now();
		let current = end; 
		let start_cell = start;
		let path = [];
		let parrent_id = null;
		let parentCell = null;
		let endTime = 0;
	
		end.set_solution(true);
	
		while(current != start_cell){
		path.push(current);
		parrent_id = current.parent;
		let array_of_ids = parrent_id.get_id().split("#",2);
		const [x, y] = array_of_ids;
		parentCell = this.get_cell(x,y);
		this.get_cell(x,y).set_solution(true);
		current = parentCell;
		}
		let exTime2 = endTime - startTime;
		return exTime2;
	  }
	
	  start_astar_solver(start,end) {
		let startTime  = performance.now();
		let openlist = new Array;
		let closelist = new Array();
		let start_cell = start;
		let goal_cell = end;
		let finished = false;
	
		start_cell.set_g_score(0);
		start_cell.set_f_score(this.calculate_manhattanDistance(start_cell.get_id(),goal_cell.get_id()));
		openlist.push(start_cell);
	
		while(!finished){
			let current_cell = this.find_lowest_f_value_cell(openlist);
			let neighbours_id = current_cell.get_links();
			if(current_cell == goal_cell){
				finished = true;
				closelist.push(current_cell);
			}else{
				neighbours_id.forEach(id => {
					if(this.is_in_either_lists(closelist,openlist,id)){
						let g_score = current_cell.g_score + 1;
						let f_score = this.calculate_manhattanDistance(id, goal_cell.get_id());
						this.getcell(id).set_g_score(g_score);
						this.getcell(id).set_f_score(f_score);
						this.getcell(id).set_parent(current_cell);
						openlist.push(this.getcell(id));
					}
				} );
				closelist.push(current_cell);
				let newopenlist = this.removeElement(openlist,current_cell);
				openlist = [...newopenlist];
			  }
		   }
		   let endTime = performance.now();
		   let exTime1 = endTime - startTime;
			   return exTime1;
		  }  
}