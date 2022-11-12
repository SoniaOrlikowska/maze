//import BFS from "./BFS.js";
//import Astar from "./Astar.js";
//import BinaryTree from "./BinaryTree.js";
// import Grid from "./Grid.js";
// import AldousBroder from "./AldousBroder.js";

 class Entropy_Shannon{
    constructor(maze){
        this.maze = maze;
        this.entropy = this.calculateMazeEntropy();
    }
    calculateMazeEntropy(){
     let entropy = 0; 
     let cell_gen = this.maze.each_cell();
     this.set_degree_of_every_vertex();
       while (true) {
           let cell = cell_gen.next().value;
           if (!cell) break
           let cell_probability = 0;
           let cell_neighbours = cell.linked_neighbours();
          
            cell_neighbours.forEach(element => {
                    let neighbour_neighbours = element.linked_neighbours();
                    let adjacency_degree = 0;
                        neighbour_neighbours.forEach(element =>{
                            adjacency_degree += element.degree;
                        });
                        cell_probability = cell.degree/adjacency_degree;
                        entropy += cell_probability*Math.log2(cell_probability);
            });
        }
        return Math.abs(entropy);
    }
    set_degree_of_every_vertex(){
        let cell_gen = this.maze.each_cell();
        while (true) {
            let cell = cell_gen.next().value;
            if (!cell) break
            let key = "degree";
            cell[key] = cell.get_links().length;
        }
    }
}


try{
    for (let index = 0; index < 5; index++) {
        
        let grid = new Grid(10,10);
       // console.log(grid.maze_paths);
        //let maze = new BinaryTree();
        let maze = new AldousBroder();
        maze.on(grid);
       //console.log( grid.get_averagePathLength(grid.get_cell(0,0)));
        //grid.create_more_links(0.5);
      //  grid.create_some_directions(0.2);
        //let astar = new Astar(grid);
        //console.log(astar.exTime2); 
       // console.log(grid.toString2());  
    }
}catch(error){
    console.error();
}

