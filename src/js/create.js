// selections
const grid = d3.select('.create__grid')
const items = grid.selectAll('.grid__item')

function setupItems(){
	items
		.on('click', function(d){
      const item = d3.select(this)
      item.classed('disabled', !item.classed('disabled'))
			console.log({item})
		})
}

function resize() {}

function init() {
	console.log('Make something awesome!');
	setupItems()
}

export default { init, resize };
