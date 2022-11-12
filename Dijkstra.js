class Dijkstra{
    //class Dijkstra{
    constructor(grid) {
        grid.clear_solution();
        this.grid = grid;
        this.start = grid.get_cell(0,0);
        this.goal =  grid.get_cell(grid.rows - 1,grid.columns - 1);
        this.exTime = this.start_dijkstra_solver()[0];
        this.steps = this.start_dijkstra_solver()[1];
       // lenght of solution
       //steps to solve
    }
    start_dijkstra_solver(){
        
        let distances = this.start.distances();
        let distancesArray = distances[0];
       
        let output = distancesArray.path_to(this.goal);
        let exTime1 = distances[1];
        let steps = distances[2];
        const [breadcrumbs, exTime2] = output;
        this.grid.distances = breadcrumbs;
        return [exTime2 + exTime1,steps];
    }
}