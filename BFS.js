//import "perf_hooks"
"use strict"
    //export default class BFS{
        class BFS{
    constructor(grid) {
        grid.clear_solution();
        this.grid = grid;
        this.start = grid.get_cell(0,0);
        this.goal =  grid.get_cell(grid.rows - 1,grid.columns - 1);
        this.stack = this.prepare_stack();
        this.exTime1 = this.start_bfs_solver();
        this.exTime2 = this.retreive_bfs_path();
	}
    prepare_stack(){
        let stack = [];
        if(stack.length === 0) stack.push(this.start); //troche głupia metoda a o jak nie jest 0?
        return stack;
    }
    start_bfs_solver(){
        let startTime  = performance.now();
        let start_cell = this.stack[0];
        const key = "visited"
        start_cell[key] = " yes";
       // let end_cell = this.get_cell(this.rows - 1, this.columns - 1); //end is fixed as is start
        let current = start_cell;
        let i = 0; 
        while(current != this.goal){
            i++;
           let cellAdjacents = this.getAdjacents(current);
            let current_id = current.get_id();
            cellAdjacents.forEach(key => {
                let array_of_ids = key.split("#",2);
                const [x, y] = array_of_ids;
                let adjacentCell = this.grid.get_cell(x,y);
                const cellKey = "visited";
                if(adjacentCell[cellKey] != true){
                    adjacentCell[cellKey] = true;
                    adjacentCell.parent = current_id;
                    this.stack.push(adjacentCell);
                }
            });
            current = this.stack.pop();
        } 
        let endTime = performance.now();
		let exTime1 = endTime - startTime;
        return exTime1;
    }
    retreive_bfs_path(){
        let startTime  = performance.now();
        let current = this.goal; 
        let path = [];
        let parrent_id = null;
        let parentCell = null;
        let endTime = 0;
        this.goal.set_solution(true);
        path.push(this.goal);
        while(current != this.start){
        path.push(current);
        parrent_id = current.parent;
        let array_of_ids = parrent_id.split("#",2);
        const [x, y] = array_of_ids;
        parentCell = this.grid.get_cell(x,y);
        this.grid.get_cell(x,y).solution = true;
        current = parentCell; 
        endTime = performance.now();
        }
        let exTime2 = endTime - startTime;
        return exTime2;
    }
    getAdjacents(cell){
        return cell.get_links();
    }    
}













