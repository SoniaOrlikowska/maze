//This class alows to calculate maze complexity using McClendon's formula

import Grid from "./Grid.js";
import BinaryTree from "./BinaryTree.js";
import AldousBroder from "./AldousBroder.js";

export default class Complexity_McClendon{

    //1. Each path with its lenght  - path len is deadend distance
    //2. Each path's L turns
    // delta approx= LOG( SUM(angles/turn_lenght))

    constructor(maze){
        this.maze = maze;
        this.distancesArray = this.distancessArray();
        this.deadends_coordinates = this.findAllDeadends();
        this.maze_AllPaths_coordinates = this.findAllPaths();
        this.maze_AllPathsTurns = this.findAllPathsTurns();
    }

    calculateMazeComplexity(){
        let hallwayComplexity = 0; 
        let mazeComplexity = 0; 

            this.maze_AllPathsTurns.forEach(hallway => {
            let turnsNumber = hallway[0];
            let hallwayLenght = hallway[1];
            mazeComplexity += (hallwayLenght*turnsNumber)/2;
            //console.log("Zakrętów jest: " + turnsNumber + " Długość ściezki to: " + hallwayLenght + " Hallway complexity " + mazeComplexity);
        }
            );
            console.log(mazeComplexity);
         

        return Math.log(mazeComplexity);
    }

    findAllDeadends(){
        const deadends_coordinates = new Map();
        this.maze.grid.forEach(row => {
            row.forEach(cell =>{
                if(cell.get_links().length == 1){
                        let deadend_adress = `${cell.row}#${cell.column}`
                        let deadend_distance = this.distancesArray.cells[deadend_adress];
                        deadends_coordinates.set(deadend_adress,deadend_distance);
                }
            });
        });
        return deadends_coordinates;
    }

    findAllPaths(){
        const maze_AllPaths_coordinates = [];
        this.deadends_coordinates.forEach((value, key) => {
            let key_split = key.split("#");
            let deadend_row = key_split[0];
            let deadend_column = key_split[1];
            let deadend = this.maze.get_cell(deadend_row, deadend_column);
            let output = this.distancesArray.path_to(deadend);
            const [breadcrumbs, executionTime] = output;
            if(Object.values(breadcrumbs.cells).length > 1){
                maze_AllPaths_coordinates.push(Object.keys(breadcrumbs.cells)); 
            }
        });
        return maze_AllPaths_coordinates;
    }

    findAllPathsTurns(){
        let data = [];
        for(let j = 0; j < this.maze_AllPaths_coordinates.length; j++){
            let path = this.maze_AllPaths_coordinates[j];
            let lTurn_counter = 0;
            let output = [];
                for( let i = 0; i <path.length ; i++){
                    let [x, y ] = path[i].split("#",2);
                    if(this.findLTurn(x,y,path)){
                        lTurn_counter += 1;
                    }
                    output = [lTurn_counter, this.maze_AllPaths_coordinates[j].length];
                }
                data.push(output);
        }
        return data;
    }


    findLTurn(x,y,path){
        let sizeX = this.maze.rows;
        let sizeY = this.maze.columns;
        let current = "";
        let right = "";
        let down = "";
        let up = "";
        let left = "";
         
        if(x >= 0 && y >= 0 && parseInt(x) + 1 <= sizeX && parseInt(y) + 1 <= sizeY){ 
            current = `${x}#${y}`;
            right = `${x}#${parseInt(y)+1}`;
            left = `${x}#${parseInt(y)-1}`;
            down = `${parseInt(x)+1}#${y}`;
            up = `${parseInt(x)-1}#${y}`;
    
            return this.isLTurn(current,right,left,down,up,path);
        }
        return false;
    }

    isLTurn(current,right,left,down, up, path){
        if(this.lTurn(current,right,left,up,path) || this.reversedLTurn(current,right,left,down,path)) return true;
        return false;
    }

    lTurn(current, right,left, up, path){
        if(this.isLinked(current, up) && (this.isLinked(current,right) || this.isLinked(current,left) )){
            if(path.includes(up) && (path.includes(right) || path.includes(left) )){
                return true;
            } 
        }
        return false;
    }

    reversedLTurn(current, right, left, down, path){
        if(this.isLinked(current, down) && ( this.isLinked(current, right) || this.isLinked(current,left) )){
            if(path.includes(down) && (path.includes(left) || path.includes(right))){
                return true;
            } 
        }
        return false;
    }
   
    isLinked(cell_1,cell_2){
        const [x, y ] = cell_1.split("#",2);
        const [z, g ] = cell_2.split("#",2);
        let current = this.maze.get_cell(x,y);
    
        return current.links.hasOwnProperty(`${z}#${g}`);
    }

    distancessArray(){
        let start = this.maze.get_cell(0, 0);
        let distancess = start.distances();
        
        //console.log(distancess);
        return distancess;
    }

    


}

// let grid = new Grid(8,8);
// let maze = new AldousBroder(grid);
// let start = grid.get_cell(0, 0);
// let end = grid.get_cell(grid.rows - 1, grid.columns - 1);
// maze.on(grid);//gotowy labirynt zapisany w grid 
// //console.log(grid.grid[0]);
// //let distancess = start.distances();
// //console.log("distancess" + distancess);
// let complexity = new Complexity_McClendon(grid);
// console.log(grid.toString());
// //console.log(complexity.findAllPathsTurns());
// console.log(complexity.calculateMazeComplexity());



