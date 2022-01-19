"use strict"

import DistanceGrid from "./DistanceGrid.js"

import BinaryTree from "./BinaryTree.js"
import Complexity from "./Complexity.js";
import AldousBroder from "./AldousBroder.js";
import RecursiveBacktracker from "./RecursiveBacktracker.js";
import BFS from "./BFS.js"
import Grid from "./Grid.js"
import * as fs from 'fs';
import Cell from "./Cell.js";

//Maze Type;Size Complexity;Solution Lenght;Time
//random generator for h and w between 
class Solution_demo {

  generateMaze(height, width, maze_name) {
    let distance_grid = new BFS(height, width);
    switch (maze_name) {
      case 'Binary':
        let mazeBinary = new BinaryTree();
        mazeBinary.on(distance_grid);
        break;
      case 'Aldous':
        let mazeAldous = new AldousBroder();
        mazeAldous.on(distance_grid);
        break;
      case 'Backtracker':
        let mazeBacktracker = new RecursiveBacktracker();
        mazeBacktracker.on(distance_grid);
        break;
      default:
        console.log(`Sorry, we are out of ${maze_name}.`);
    }
    return distance_grid;
  }

  // testMethod(){
  //   let distance_grid = this.generateMaze(4,4,"Binary");
  //   console.log(" " + "\n" + distance_grid);
  //   let links = distance_grid.grid[2][2].get_links()
  //   console.log(links);
  // }

  generateDijkstraSolution(distance_grid) { //bardzo niefortuna jest ta nazwa distance grid ale tak na razie bedzie wszedzie
    let start = distance_grid.get_cell(0, 0);
    let end = distance_grid.get_cell(distance_grid.rows - 1, distance_grid.columns - 1);
    let distances = start.distances();
    distance_grid.distances = distances;
    let output = distances.path_to(end);
    const [breadcrumbs, executionTime] = output;
    distance_grid.distances = breadcrumbs;
    let totalTime = executionTime.toFixed(4);

    return totalTime;
  }

  generateBfsSolution(distance_grid){
    let start = distance_grid.get_cell(0, 0);
    let end = distance_grid.get_cell(distance_grid.rows - 1, distance_grid.columns - 1);
    let stack = distance_grid.prepare_stack(0,0);
    let exTime1 = distance_grid.start_bfs_solver(stack);
    let exTime2 = distance_grid.retreive_bfs_path(start,end);
    let totalTime = (exTime1 + exTime2).toFixed(4);
    return totalTime; 
  }

  
  calculateComplexity(mazeGrid) {
    let complexity = new Complexity();
    let complexity_parameters = complexity.complexity_parameters(mazeGrid);
    return complexity.calculate_complexity(complexity_parameters);//uwaga tutaj

  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getData() {
    let outputArray =[];
     let mazeType = ["Binary", "Aldous", "Backtracker"];
     let solver = ["Dijkstra", "BFS"];
    let mazeSizeX = 0;
    let mazeSizeY = 0;
    let mazeComplexity = 0;
    let solutionTimeDijkstra = 0;
    let solutionTimeBFS = 0;
    let min = 6;
    let max =  18;
    let table_header = ["Maze Type", "Maze Size", "Corridors Ratio","Forks Ratio", "Intersections Ratio", "Solution Time Dijkstra", "Solution Time BFS"].join(";");
    outputArray.push(table_header);
    mazeType.forEach(mazeType => {
      for (let i = 0; i < 1; i++) {
        mazeSizeX = this.getRandomInt(min, max);
        mazeSizeY = this.getRandomInt(min, max);
        const distance_grid = this.generateMaze(mazeSizeX, mazeSizeY, mazeType);
       const copyOf_distance_grid = {...distance_grid};
     
        
        //console.log("HELLO"+ distance_grid.toString());
        //console.log(distance_grid.grid);
        //console.log(copyOf_distance_grid.grid);
     
        solutionTimeDijkstra = this.generateDijkstraSolution(distance_grid);
        console.log("Dijkstra Solution PO")
        console.log(distance_grid.toString());
        console.log("BFS Solution")
        solutionTimeBFS = this.generateBfsSolution(distance_grid);
        console.log(distance_grid.toString());
       
        mazeComplexity = this.calculateComplexity(distance_grid);
        let corridors_ratio = mazeComplexity[0];
        let forks_ratio = mazeComplexity[1];
        let intersections_ratio = mazeComplexity[2];
        let outputLine = this.createOutputLine(mazeType, mazeSizeX, mazeSizeY, corridors_ratio, forks_ratio, intersections_ratio, solutionTimeDijkstra, solutionTimeBFS).join(";");
        outputArray.push(outputLine);
          
      }

    });
    let output = outputArray.join("\n");

    fs.writeFile("/Users/soniaorlikowska/Desktop/STUDIA/AGH/MAGISTERSKIE/3semestrMgr/RWiW/MazeProject/output.csv", output, err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    })
    // return console.log(outputArray);
  }
  createOutputLine(mazeType, mazeSizeX, mazeSizeY, corridors_ratio, forks_ratio, intersections_ratio, solutionTime, solver ) {
    let outputLine = [];
    outputLine.push(mazeType)
    outputLine.push(mazeSizeX * mazeSizeY);
    outputLine.push(corridors_ratio.toFixed(2));
    outputLine.push(forks_ratio.toFixed(2));
    outputLine.push(intersections_ratio.toFixed(2));
    outputLine.push(solutionTime);
    outputLine.push(solver);
    return outputLine;
  }
};

new Solution_demo().getData();

