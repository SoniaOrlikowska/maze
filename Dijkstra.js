//export default class Dijkstra{
    class Dijkstra{
    constructor(grid) {
        grid.clear_solution();
        this.grid = grid;
        this.start = grid.get_cell(0,0);
        this.goal =  grid.get_cell(grid.rows - 1,grid.columns - 1);
        this.exTime = this.start_dijkstra_solver();
    }
    start_dijkstra_solver(){
        let distances = this.start.distances();
        let output = distances.path_to(this.goal);
        const [breadcrumbs, executionTime] = output;
        this.grid.distances = breadcrumbs;
        return executionTime;
    }
}