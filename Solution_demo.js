"use strict"

import DistanceGrid from "./DistanceGrid.js"
import BinaryTree from "./BinaryTree.js"
import Complexity from "./Complexity.js";
import AldousBroder from "./AldousBroder.js";
import RecursiveBacktracker from "./RecursiveBacktracker.js";
import Grid from "./Grid.js"
import * as fs from 'fs';
import Cell from "./Cell.js";

//Maze Type;Size Complexity;Solution Lenght;Time
//random generator for h and w between 
class Solution_demo {

  generateMaze(height, width, maze_name) {
    let distance_grid = new DistanceGrid(height, width);
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

  testMethod(){
    let distance_grid = this.generateMaze(4,4,"Binary");
    console.log(" " + "\n" + distance_grid);
    let links = distance_grid.grid[2][2].get_links()
    console.log(links);
  }

  generateDijkstraSolution(distance_grid) {
    let start = distance_grid.get_cell(0, 0);
    let distances = start.distances();
    distance_grid.distances = distances;
    let output = distances.path_to(distance_grid.get_cell(distance_grid.rows - 1, distance_grid.columns - 1));
    const [breadcrumbs, executionTime] = output;
    distance_grid.distances = breadcrumbs;
    let totalTime = executionTime.toFixed(4);

    return totalTime;
  }


  calculateComplexity(mazeGrid) {
    let complexity = new Complexity();
    let complexity_parameters = complexity.complexity_parameters(mazeGrid);
    return complexity.calculate_complexity(complexity_parameters).toFixed(2);

  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getData() {
    let outputArray = [];
    // let mazeType = ["Binary", "Aldous", "Backtracker"];
    let mazeType = ["Backtracker"];
    let mazeSizeX = 0;
    let mazeSizeY = 0;
    let mazeComplexity = 0;
    let solutionTime = 0;
    let min = 4;
    let max = 4;

    mazeType.forEach(mazeType => {
      for (let i = 0; i < 1; i++) {
        mazeSizeX = this.getRandomInt(min, max);
        mazeSizeY = this.getRandomInt(min, max);
        let distance_grid = this.generateMaze(mazeSizeX, mazeSizeY, mazeType);
        solutionTime = this.generateDijkstraSolution(distance_grid);
        mazeComplexity = this.calculateComplexity(distance_grid);

        let outputLine = this.createOutputLine(mazeType, mazeSizeX, mazeSizeY, mazeComplexity, solutionTime).join(";");
        outputArray.push(outputLine);
        // console.log(distance_grid.toString());    
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
  createOutputLine(mazeType, mazeSizeX, mazeSizeY, mazeComplexity, solutionTime) {
    let outputLine = [];
    outputLine.push(mazeType)
    outputLine.push(mazeSizeX * mazeSizeY);
    outputLine.push(mazeComplexity);
    outputLine.push(solutionTime);
    return outputLine;
  }
};

new Solution_demo().testMethod()

