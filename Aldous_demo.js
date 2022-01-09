"use strict"
import Grid from "./Grid.js"
import RecursiveBacktracker from "./RecursiveBacktracker.js"

class Aldous_demo{
    print(){
        let h = 15;
        let w = 15;
        let grid = new Grid(h, w);
        let maze = new RecursiveBacktracker();
        maze.on(grid);
        console.log(grid.toString());
    }
    
};
new Aldous_demo().print();