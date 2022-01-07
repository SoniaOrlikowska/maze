import "perf_hooks"
export default class Distances {
	constructor(root) {
		this.root = root
		this.cells = {}
		this.cells[this.root.get_id()] = 0
	}

	get_cell(cell) {
		return this.cells[cell.get_id()]
	}

	set_cell(cell, distance) {
		this.cells[cell.get_id()] = distance;
	}

	get_cells() {
		return Object.keys(this.cells)
	}

	path_to(goal) {
		let start = performance.now();
		let current = goal

		let breadcrumbs = new Distances(this.root)
		breadcrumbs.set_cell(current, this.get_cell(current))

		while (current.get_id() !== this.root.get_id()) {
			for (let link in current.links) {
				let neighbor = current.links[link]
				if (this.get_cell(neighbor) < this.get_cell(current)) {
					breadcrumbs.set_cell(neighbor, this.get_cell(neighbor))
					current = neighbor
					break
				}
			}
		}
		let end = performance.now();
		let executionTime = end - start;
		const output = [breadcrumbs, executionTime];
		return output;
	}

	max() {
		let max_distance = 0
		let max_cell_id = this.root.get_id()

		for (let cell_id in this.cells) {
			let distance = this.cells[cell_id]
			if (distance > max_distance) {
				max_cell_id = cell_id
				max_distance = distance
			}
		}

		return [max_cell_id, max_distance]
	}
	end(maze_rows, maze_height){
		let end_cell_id = `${maze_rows -1}#${maze_height -1}`;
		let end_distance = this.cells[end_cell_id];
		return end_distance;
	}

	
}