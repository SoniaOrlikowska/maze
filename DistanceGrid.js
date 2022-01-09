"use strict"
import Grid from "./Grid.js"
export default class DistanceGrid extends Grid {
	constructor(rows, columns) {
		super(rows, columns)
		//this.distances = null jakie ta linijka ma znaczenie, przedtem był uncomment
	}

	contents_of(cell) {
		if (this.distances && this.distances.get_cell(cell)) {
			return this.distances.get_cell(cell).toString(36)
		}
		else {
			return super.contents_of(cell)
		}
	}

	toString() {
		let output = ''
		output += '+' + '---+'.repeat(this.columns) + '\n'
		let row_gen = this.each_row()
		while (true) {
			let row = row_gen.next().value
			if (!row) break

			let top = '|'
			let bottom = '+'

			for (let j = 0; j < row.length; j += 1) {
				let cell = row[j]
				
				// let body = '   '
				let body = ` ${this.contents_of(cell)} `
				let east_boundary = (cell.east && cell.isLinked(cell.east)) ? ' ' : '|'
				top += body + east_boundary

				let south_boundary = (cell.south && cell.isLinked(cell.south)) ? '   ' : '---'
				let corner = '+'
				bottom += south_boundary + corner
			}

			output += top + '\n'
			output += bottom + '\n'
		}
		return output
	}

}