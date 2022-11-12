
class MazeParameters{
    constructor(grid){
        this.grid = grid;
        this.parameters = this.maze_parameters();
        this.parameters_ratio = this.calculate_parameters_ratio();
    }
    maze_parameters(){ //to się powinno nazywać coś tam coś tam dead ends
        const links_array = [];
        const deadends_coordinates = new Map();
        this.grid.grid.forEach(row => {
            row.forEach(cell =>{
                links_array.push(cell.get_links().length); //do czego to ?
                // if(cell.get_links().length == 1){
                //     let deadend_adress = `${cell.row}#${cell.column}`
                //     let deadend_distance = distances_array.cells[deadend_adress];
                //     deadends_coordinates.set(deadend_adress,deadend_distance);
                // }
            });
        });
       let deadedns_number = links_array.filter(corridors => corridors === 1).length;
       let forks_number = links_array.filter(fork => fork === 2).length; 
       let intersection_number = links_array.filter(intersection => intersection === 3).length;
       let cross_number = links_array.filter(cross => cross === 4).length;

       let maze_parameters = {
            "deadends_number" : deadedns_number,
            "forks_number" : forks_number,
            "intersection_number" : intersection_number,
            "cross_number" : cross_number
        }
       return maze_parameters;
    }
    calculate_parameters_ratio(){
        let deadends =  this.parameters.deadends_number;
        let forks = this.parameters.forks_number;
        let intersections = this.parameters.intersection_number;
        let cross = this.parameters.cross_number;
       
        let mazeSize= deadends+forks+intersections+cross;
        let deadends_ratio = deadends/mazeSize;
        let forks_ratio = forks/mazeSize;
        let intersections_ratio = intersections/mazeSize;
        let cross_ratio = cross/ mazeSize;
        let parameters_ratio = [deadends_ratio, forks_ratio, intersections_ratio,cross_ratio];
        return parameters_ratio;
    }
 }

