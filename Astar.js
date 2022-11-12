"use strict"
class Astar{
 // class Astar{
  constructor(grid){
    grid.clear_solution();
    this.grid = grid;
    this.start = grid.get_cell(0,0);
    this.goal =  grid.get_cell(grid.rows - 1,grid.columns - 1);
    this.exTime = this.start_astar_solver() + this.retreive_astar_path();
	this.steps;
  }
  start_astar_solver() {
		let startTime  = performance.now();
		let openlist = new Array();
		let closelist = new Array();
		let finished = false;
		let steps = 0;
	
		this.start.set_g_score(0);
		this.start.set_f_score(this.calculate_manhattanDistance(this.start.get_id(),this.goal.get_id()));
		openlist.push(this.start);
		try{
		while(!finished){
			steps++
			let current_cell = this.find_lowest_f_value_cell(openlist);
			let neighbours_id = current_cell.get_links();
			if(current_cell == this.goal){
				finished = true;
				closelist.push(current_cell);
			}else{
				neighbours_id.forEach(id => {
					if(this.is_in_either_lists(closelist,openlist,id)){
						let g_score = current_cell.g_score + 1;
						let f_score = this.calculate_manhattanDistance(id, this.goal.get_id());
						this.grid.getcell(id).set_g_score(g_score);
						this.grid.getcell(id).set_f_score(f_score);
						this.grid.getcell(id).set_parent(current_cell);
						openlist.push(this.grid.getcell(id));
					}
				} );
				closelist.push(current_cell);
				let newopenlist = this.removeElement(openlist,current_cell);
				openlist = [...newopenlist];
			  }
		   }
		   this.steps = steps;
		   let endTime = performance.now();
		   let exTime1 = endTime - startTime;
			   return exTime1;
			}catch(error){
			console.error();
		} 
		  }
  calculate_manhattanDistance(neighbour_id, goal_id) {
    let adjacent_coordinates = neighbour_id.split("#");
    let adjacent_x = adjacent_coordinates[0];
    let adjacent_y = adjacent_coordinates[1];
    let goal_coordinates = goal_id.split("#");
    let goal_x = goal_coordinates[0];
    let goal_y = goal_coordinates[1];
    let heuristic_distance = Math.abs(goal_x - adjacent_x) + Math.abs(goal_y - adjacent_y);
      return heuristic_distance;
  }
  find_lowest_f_value_cell(list){
    let fvalue_array = list.map(cell => cell.f_score);
    let minimal_fscore = Math.min(...fvalue_array);
    let element_minimal_fvalue = list.find(element => element.f_score == minimal_fscore);
      return element_minimal_fvalue;
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
		});
	}
  retreive_astar_path(){
		let startTime  = performance.now();
		let current = this.goal; 
		let path = [];
		let parrent_id = null;
		let parentCell = null;
		this.goal.set_solution(true);
		try{
		while(current != this.start){
		path.push(current);
		parrent_id = current.parent;
		let array_of_ids = parrent_id.get_id().split("#",2);
		const [x, y] = array_of_ids;
		parentCell = this.grid.get_cell(x,y);
		this.grid.get_cell(x,y).set_solution(true);
		current = parentCell;
	  }  
	  let endTime = performance.now();
	  let exTime2 = endTime - startTime;
 	   return exTime2; 
		
	}catch(error){
		  console.error();
	  }
  }
}
	
	   
  