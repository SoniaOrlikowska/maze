import DistanceGrid from "./DistanceGrid.js";
import Grid from "./Grid.js";
import BinaryTree from "./BinaryTree.js";
import Cell from "./Cell.js";

class BFS extends DistanceGrid{
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
        let start_cell = stack[0];
        let end = super.get_cell(this.rows - 1, this.columns - 1); //end is fixed as is start
       
        start_cell.visited = "yes";
        let current = start_cell;
    
        while(current != end){
            const cellAdjacents = this.getAdjacents(current);
            let current_id = current.get_id();

            console.log("current id: " + current_id);
            cellAdjacents.forEach(key => {
                let x = key.charAt(0);
                let y = key.charAt(2);
                let adjacentCell = super.get_cell(x,y);
                if(adjacentCell.visited != "yes"){
                    adjacentCell.visited = "yes";
                    adjacentCell.parent = current_id;
                    stack.push(adjacentCell);
                }
            });
            current = stack.pop();
        } 
        
       return stack;
    }

    getAdjacents(cell){
        return cell.get_links();
    }

    

   
 
       //stack.push(start_cell.links[links[0]]);
      // stack.push(start_cell.links[links[1]]);

    }
  


let test = new BFS(3,3);
let mazeBinary = new BinaryTree();
mazeBinary.on(test);
console.log(test.toString());
let stack = test.prepare_stack(0,0)
console.log("PRZED");
console.log(stack.length);
//console.log(stack[0].get_links());

test.start_bfs_solver(stack);
console.log("PO");
console.log(stack.length);
console.log(stack);
console.log("FINISH")
console.log(test.grid);