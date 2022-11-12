class AldousBroder {
	//class AldousBroder{
	on(grid) {
		let cell = grid.get_random_cell()
		//let unvisited = grid.size() - 1
		let unvisited = grid.size	 - 1

		while (unvisited > 0) {
			let neighbors = cell.neighbors()
			let neighbor = neighbors[Math.floor(Math.random() * neighbors.length)]

			if (neighbor.get_links().length == 0) {
				cell.link(neighbor)
				unvisited -= 1
			}

			cell = neighbor
		}
	}
}