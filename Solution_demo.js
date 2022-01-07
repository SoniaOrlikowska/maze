"use strict"

import DistanceGrid from "./DistanceGrid.js"
import BinaryTree from "./BinaryTree.js"
import Complexity from "./Complexity.js";
//Maze Type;Size Complexity;Solution Lenght;Time
//random generator for h and w between 


   class Solution_demo{

        generateMaze(height, width){
            let distance_grid = new DistanceGrid(height, width);
            let maze = new BinaryTree();
            maze.on(distance_grid);
            return distance_grid;
        }

        generateSolution(distance_grid){
            let start = distance_grid.get_cell(0,0);
            let distances = start.distances();
            distance_grid.distances = distances;
            let output = distances.path_to(distance_grid.get_cell(distance_grid.rows - 1, distance_grid.columns -1));
            const [breadcrumbs, executionTime] = output;
            distance_grid.distances = breadcrumbs;
            let totalTime = executionTime.toFixed(4);
            
            return totalTime;
        }
        calculateComplexity(mazeGrid){
            let complexity =  new Complexity();
            let complexity_parameters = complexity.complexity_parameters(mazeGrid);
            return complexity.calculate_complexity(complexity_parameters).toFixed(2);

        }
    //    print(h,w){
    //         let distance_grid = new DistanceGrid(h,w);
    //         let maze1 = new BinaryTree();
    //         let complexity =  new Complexity();
        
    //         maze1.on(distance_grid);
    //         let start = distance_grid.get_cell(0, 0);
    //         let distances = start.distances();
    //         distance_grid.distances = distances;
    //         distance_grid.distances = distances.path_to(distance_grid.get_cell(distance_grid.rows - 1, distance_grid.columns -1));
    //         //console.log(distance_grid.toString());
    //         let complexity_parameters = complexity.complexity_parameters(distance_grid);
    //         //console.log("Complexity of this maze is: " + complexity.calculate_complexity(complexity_parameters).toFixed(2));
        
    //    }   
       getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            //console.log( Math.floor(Math.random() * (max - min)) + min);
            return Math.floor(Math.random() * (max - min)) + min;
      }

      getData(){
        
          //let outputLine = [];
          let outputArray = [];
          let mazeType = "Binary Tree";
          let mazeSizeX = 0;
          let mazeSizeY = 0;
          let mazeComplexity = 0; 
          let solutionTime = 0;
          let min = 6;
          let max = 50;
          for(let i = 0; i < 11; i++){//it could be while I guess
              mazeSizeX = this.getRandomInt(min, max);
              mazeSizeY = this.getRandomInt(min, max);
              let distance_grid = this.generateMaze(mazeSizeX,mazeSizeY);
              //console.log(distance_grid.toString());
              solutionTime = this.generateSolution(distance_grid);
              mazeComplexity = this.calculateComplexity(distance_grid);

              let outputLine = this.createOutputLine(mazeType,mazeSizeX,mazeSizeY,mazeComplexity,solutionTime).join(";");
              outputArray.push(outputLine);
          }
        
          return console.log(outputArray);
      }
      createOutputLine(mazeType,mazeSizeX,mazeSizeY,mazeComplexity,solutionTime){
        let outputLine = [];
        outputLine.push(mazeType)
        outputLine.push(mazeSizeX*mazeSizeY);
        outputLine.push(mazeComplexity);
        outputLine.push(solutionTime);
        return outputLine;
    }
   };

new Solution_demo().getData();

