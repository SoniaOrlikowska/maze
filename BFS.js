import DistanceGrid from "./DistanceGrid.js";
import Grid from "./Grid.js";
import BinaryTree from "./BinaryTree.js";
import Distances  from "./Distances.js";
import Cell from "./Cell.js";
import AldousBroder from "./AldousBroder.js";
import "perf_hooks"

export default class BFS extends DistanceGrid{
    constructor(rows, columns) {
		super(rows, columns)

	}
    prepare_stack(startX, startY){
        let stack = [];
        let start = super.get_cell(startX, startY);
        if(stack.length === 0) stack.push(start); //troche głupia metoda a o jak nie jest 0?
        return stack;
    }
    // 1. take start cell insert to stack
    // 2. set parents of this cell and visited to yes 
    // 3. pop it form the stack
    // 4. insert its neighbours to stack
    // 5. take last element in stack --> go to 2
    start_bfs_solver(stack){
        let startTime  = performance.now();
        let start_cell = stack[0];
        //start_cell.visited = "yes";
        const key = "visited"
        start_cell[key] = " yes";
        let end_cell = super.get_cell(this.rows - 1, this.columns - 1); //end is fixed as is start
        let current = start_cell;
        let i = 0; 
        while(current != end_cell){
            i++;
           let cellAdjacents = this.getAdjacents(current);
            let current_id = current.get_id();
            cellAdjacents.forEach(key => {
                let array_of_ids = key.split("#",2);
                const [x, y] = array_of_ids;
                
                let adjacentCell = super.get_cell(x,y);
                const cellKey = "visited";
                if(adjacentCell[cellKey] != "yes"){
                    adjacentCell[cellKey] = "yes";
                    adjacentCell.parent = current_id;
                    stack.push(adjacentCell);
                }
            });
           
            current = stack.pop();
        } 
        let endTime = performance.now();
		let exTime1 = endTime - startTime;
        return exTime1;
    }
   

    retreive_bfs_path(start, end){
        let startTime  = performance.now();
        let current = end; 
        let path = [];
        let parrent_id = null;
        let parentCell = null;
        let endTime = 0;
        

        while(current != start){
        path.push(current);
        parrent_id = current.parent;
        let array_of_ids = parrent_id.split("#",2);
        const [x, y] = array_of_ids;
        parentCell = super.get_cell(x,y);
        super.get_cell(x,y).solution = "yes";
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
  
// let newgrid = new BFS(20,20);
// let newmaze = new BinaryTree();
// newmaze.on(newgrid);

// console.log(newgrid.toString());
// let stack =newgrid.prepare_stack(0,0);

// newgrid.start_bfs_solver(stack);
// let start = newgrid.get_cell(0,0);
// let end = newgrid.get_cell(19,19);
// newgrid.retreive_bfs_path(start, end);

// console.log(newgrid.toString()) 












