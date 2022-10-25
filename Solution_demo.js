"use strict"

import DistanceGrid from "./DistanceGrid.js"

import BinaryTree from "./BinaryTree.js"
import Complexity from "./Complexity.js";
import AldousBroder from "./AldousBroder.js";
import Astar from "./AStar.js";
import Dijkstra from "./Dijkstra.js";
import RecursiveBacktracker from "./RecursiveBacktracker.js";
import BFS from "./BFS.js"
import Complexity_McClendon from "./Complexity_McClendon.js";
import Grid from "./Grid.js"
import * as fs from 'fs';
import Cell from "./Cell.js";

//Maze Type;Size Complexity;Solution Lenght;Time
//random generator for h and w between 
class Solution_demo {

  generateMaze(height, width, maze_name) {
   let grid = new Grid(height,width);
    switch (maze_name) {
      case 'Binary':
        let mazeBinary = new BinaryTree();
        mazeBinary.on(grid);
        break;
      case 'Aldous':
        let mazeAldous = new AldousBroder();
        mazeAldous.on(grid);
        break;
      case 'Backtracker':
        let mazeBacktracker = new RecursiveBacktracker();
        mazeBacktracker.on(grid);
        break;
      default:
        console.log(`Sorry, we are out of ${maze_name}.`);
    }
    return grid;
  }
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

  generateBfsSolution(grid){
    let start = grid.get_cell(0, 0);
    let end = grid.get_cell(grid.rows - 1, grid.columns - 1);
    let stack = grid.prepare_stack(0,0);
    let exTime1 = grid.start_bfs_solver(stack);
    let exTime2 = grid.retreive_bfs_path(start,end);
    let totalTime = (exTime1 + exTime2).toFixed(4);
    return totalTime; 
  }

  generateAstarSolution(grid){
    let start = grid.get_cell(0, 0);
    let end = grid.get_cell(grid.rows - 1, grid.columns - 1);
    let exTime1 = grid.start_astar_solver(start,end);
    let exTime2 = grid.retreive_astar_path(start,end);
    let totalTime = (exTime1 + exTime2).toFixed(4);
    return totalTime;
  }

  calculateComplexity(mazeGrid) {
    let complexity = new Complexity();
    let complexity_parameters = complexity.complexity_parameters(mazeGrid);
    //console.log(complexity_parameters);
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
    let solver = ["Dijkstra", "BFS", "Astar"];
    let mazeSizeX = 0;
    let mazeSizeY = 0;
    let mazeDegree = 0;
    let solutionTimeDijkstra = 0;
    let solutionTimeBFS = 0;
    let solutionTimeAstar = 0;
    let min = 20;
    let max =  20;
    let table_header = ["Maze Type", "Maze Size", "Corridors Ratio","Forks Ratio", "Intersections Ratio","McClendon", "Solution Time Dijkstra", "Solution Time BFS"].join(";");
    outputArray.push(table_header);
    mazeType.forEach(mazeType => {
      for (let i = 0; i < 1; i++) {
        mazeSizeX = this.getRandomInt(min, max);
        mazeSizeY = this.getRandomInt(min, max);
        let grid = this.generateMaze(mazeSizeX, mazeSizeY, mazeType);
        
        //grid.create_more_links();
       
     

       // let mcClendonComplexity = new Complexity_McClendon(distance_grid).calculateMazeComplexity();
     
       /////////////////////////////////
       let astar_solver = new Astar(grid);
       let solutionTimeAstar_BIS = astar_solver.exTime1 + astar_solver.exTime2;
       console.log(`Astar time: ${solutionTimeAstar_BIS}`);
       console.log(astar_solver.grid.toString2());

       let bfs_solver = new BFS(grid);
       let solutionTimeBFS_BIS = bfs_solver.exTime1 + bfs_solver.exTime2;
       console.log(`BFS time: ${solutionTimeBFS_BIS}`);
       console.log(bfs_solver.grid.toString2());

       let dijkstra_solver = new Dijkstra(grid);
       let solutionTimeDijkstra_BIS = dijkstra_solver.exTime;
       console.log(`Dijkstra time: ${solutionTimeDijkstra_BIS}`);
       console.log(dijkstra_solver.grid.toString2());


       /////////////////////////////////
        
       
    
        //$let corridors_ratio = mazeDegree[0];
       // $let forks_ratio = mazeDegree[1];
       // $let intersections_ratio = mazeDegree[2];
       // $let cross_ratio = mazeDegree[3];
       // $let outputLine = this.createOutputLine(mazeType, mazeSizeX, mazeSizeY, corridors_ratio,forks_ratio,intersections_ratio, cross_ratio, mcClendonComplexity, solutionTimeDijkstra, solutionTimeBFS, solutionTimeAstar).join(";");
      //  $outputArray.push(outputLine);     
      }

    });
  //$ let output = outputArray.join("\n");

    //$fs.writeFile("/Users/soniaorlikowska/Desktop/PRACA_MAGISTERSKA/Maze/maze/output.csv", output, err => {
     //$ if (err) {
      //$  console.error(err)
    //$    return
   //$   }
      //file written successfully
   //$ })
    // return console.log(outputArray);
  }
  createOutputLine(mazeType, mazeSizeX, mazeSizeY, corridors_ratio,forks_ratio,intersections_ratio, cross_ratio, mcClendonComplexity, solutionTimeDijkstra, solutionTimeBFS,solutionTimeAstar) {
    let outputLine = [];
    outputLine.push(mazeType)
    outputLine.push(mazeSizeX * mazeSizeY);
    outputLine.push(corridors_ratio);
    outputLine.push(forks_ratio);
    outputLine.push(intersections_ratio);
    outputLine.push(cross_ratio);
    outputLine.push(mcClendonComplexity);
    outputLine.push(solutionTimeDijkstra);
    outputLine.push(solutionTimeBFS);
    outputLine.push(solutionTimeAstar)

    return outputLine;
  }
};

new Solution_demo().getData();


