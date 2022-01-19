export default class Complexity{
    complexity_parameters(maze_grid){
        let links_array = [];
        maze_grid.grid.forEach(row => {
            row.forEach(cell =>{
                links_array.push(cell.get_links().length);
            });
        });

       let forks_number = links_array.filter(fork => fork === 2).length; 
       let intersection_number = links_array.filter(intersection => intersection === 3).length;
       let corridors_number = links_array.filter(corridors => corridors === 1).length;

       let complexity_parameters = {
            "forks_number" : forks_number,
            "intersection_number" : intersection_number,
            "corridors_number" : corridors_number
        }
       return complexity_parameters;
    }

    calculate_complexity(complexity_parameters){
        let corridors =  complexity_parameters.corridors_number;
        let forks = complexity_parameters.forks_number;
        let intersections = complexity_parameters.intersection_number;
       
        let mazeSize= corridors+forks+intersections;
        let corridors_ratio = corridors/mazeSize;
        let forks_ratio = forks/mazeSize;
        let intersections_ratio = intersections/mazeSize;
        let complexity = [corridors_ratio, forks_ratio, intersections_ratio];
        return complexity;
    }
    }