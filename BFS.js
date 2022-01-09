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

        const cell_links_keys = this.get_cell_link_keys(start_cell);
       // stack.pop();
        cell_links_keys.forEach(key => {            //0#1 klucz linka
            let x = key.charAt(0);
            let y = key.charAt(2);
            stack.push(super.get_cell(x,y));
            super.get_cell(x,y).visited = "yes";
            super.get_cell(x,y).parent = start_cell.get_id();

    
        });
       return stack;
    }

    get_cell_link_keys(cell){
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
