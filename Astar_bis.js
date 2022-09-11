import DistanceGrid from "./DistanceGrid.js";
import RecursiveBacktracker from "./RecursiveBacktracker.js";


export default class Astar_bis extends DistanceGrid {
  constructor(rows, columns) {
    super(rows, columns);
  }

  getNeigbours(cell_id, goal_id){
    let current_cell = super.getcell(cell_id);
    let neighbours_ids = current_cell.get_links();
    let neighbours_arr = new Array();
    
    neighbours_ids.forEach(neighbour_id => {
        let g = current_cell.g_score + 1;
        let h = this.calculate_manhattanDistance(neighbour_id,goal_id);
        let f = g + h;
        let neighbour_details = {
            id : neighbour_id,
            g_value : g,
            h_value : h,
            f_value : f
        };
        neighbours_arr.push(neighbour_details);
    });
    return neighbours_arr;

  }
  getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue) return key;
    }
  }
  calculate_manhattanDistance(neighbour_id, goal_id) {
    let adjacent_coordinates = neighbour_id.split("#");
    let adjacent_x = adjacent_coordinates[0];
    let adjacent_y = adjacent_coordinates[1];

    let goal_coordinates = goal_id.split("#");
    let goal_x = goal_coordinates[0];
    let goal_y = goal_coordinates[1];

    let heuristic_distance =
      Math.abs(goal_x - adjacent_x) + Math.abs(goal_y - adjacent_y);

    return heuristic_distance;
  }
  find_lowest_f_value_cell(list){
     let fvalue_array = list.map(cell => cell.f_score);
     let minimal_fscore = Math.min(...fvalue_array);
     let element_minimal_fvalue = list.find(element => element.f_score == minimal_fscore);
     return element_minimal_fvalue;
  }

  isNeighbour_in_both_lists(openlist,closelist,neighbour){
    return openlist.filter(element => element.id === neighbour.id).length > 0 && closelist.filter(element => element.id === neighbour.id).length > 0;
  }

  is_in_either_lists(openlist,closelist,id){
    if(closelist.find(element => element.get_id() == id ) == undefined && openlist.find(element => element.get_id() == id ) == undefined){ 
           return true;}else{
               return false;
           }
 
       
}
removeElement(array, value){
    return array.filter(function(element){
        return element != value;
    })
}
retreive_astar_path(start, end){
    let startTime  = performance.now();
    let current = end; 
    let path = [];
    let parrent_id = null;
    let parentCell = null;
    let endTime = 0;

    while(current != start){
    path.push(current);
    parrent_id = current.parent;
    console.log("HEJ");
    console.log(parrent_id.get_id());
    let array_of_ids = parrent_id.get_id().split("#",2);
   
    const [x, y] = array_of_ids;
    parentCell = super.get_cell(x,y);
    super.get_cell(x,y).solution = "yes";
    current = parentCell; 
    endTime = performance.now();
    
    }
    let exTime2 = endTime - startTime;
    return exTime2;
}

  startAstar_solver() {
    let openlist = new Array;
    let closelist = new Array();
    let start_cell = super.get_cell(0, 0);
    let goal_cell = super.get_cell(10,10);
    start_cell.set_g_score(0);
    start_cell.set_f_score(this.calculate_manhattanDistance(start_cell.get_id(),goal_cell.get_id()));
    openlist.push(start_cell);
    let finished = false;

    while(!finished){
    
        let current_cell = this.find_lowest_f_value_cell(openlist);
      
        let neighbours_id = current_cell.get_links();
        if(current_cell == goal_cell){
            finished = true;
            closelist.push(current_cell);
            console.log("ALLELUJA")
        }else{
            neighbours_id.forEach(id => {
                if(this.is_in_either_lists(closelist,openlist,id)){
                    let g_score = current_cell.g_score + 1;
                    let f_score = this.calculate_manhattanDistance(id, goal_cell.get_id());
                    super.getcell(id).set_g_score(g_score);
                    super.getcell(id).set_f_score(f_score);
                    super.getcell(id).set_parent(current_cell);
                    openlist.push(super.getcell(id));
                }
            } );
            closelist.push(current_cell);
            let newopenlist = this.removeElement(openlist,current_cell);
            openlist = [...newopenlist];
            
        }
       
        //return openlist;

       }
       console.table(closelist);
       
}
}

let distance_grid = new Astar_bis(11, 11);
let mazeBinary = new RecursiveBacktracker();
mazeBinary.on(distance_grid);
console.log(distance_grid.toString());
distance_grid.startAstar_solver();
distance_grid.retreive_astar_path(distance_grid.get_cell(0, 0),distance_grid.get_cell(10, 10));
console.log(distance_grid.toString());
//console.log(distance_grid.get_cell(1,1));
//console.log(distance_grid.getNeigbours("0#3","4#4"));

/*Declare the visited list
Declare the unvisited list
For each node in graph:
    Add the node to the unvisited list with a g-score of infinity, an f-score of infinity and previous node of null
Set the start node's g-score to 0 in the unvisited list
Set the start node's f-score to its h-score in the unvisited list
Set finished to False
While finished is False:

    Set current node to the node in the unvisited list with the lowest f-score 
    If the current node is the target node
       Set finished to True
       Copy the values for the current node from the unvisited list to the visited list
    Else        


        For each neighbour of current node:
            If neighbour is not in the visited list
                Calculate new g-score = weight of edge + g-score of current node
                If new g-score is less than neighbour's g-score in unvisited list
                    Update the neighbour's g-score with the new g-score
                    Update the neighbour's f-score to new g-score + h_score
                    Update the neighbour's previous node to the current node
        Copy the values for the current node from the unvisited list to the visited list
        Remove the current node from the unvisited list
Return the visited list*/