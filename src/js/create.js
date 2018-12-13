import './pudding-chart/histogram-template'

// selections
const grid = d3.select('.create__grid')
const items = grid.selectAll('.grid__item')
const results = d3.select('.create__results')
const $container = d3.selectAll('.container__create')

// data
let data = null

function setupItems(){
	items
		.on('click', function(d){
      const item = d3.select(this)
      item.classed('disabled', !item.classed('disabled'))
		})
}

function setupCompleteButton(){
  const button = d3.selectAll('#createFinish')

  button
    .on('click', d => {
      const prohibited = items.filter((d, i, n) => d3.select(n[i]).classed('disabled'))
      const fem = prohibited.filter((d, i, n) => d3.select(n[i]).attr('data-gen') === 'f')
      const poc = prohibited.filter((d, i, n) => d3.select(n[i]).attr('data-race') === 'y')
      const pFem = d3.round((fem.size()/prohibited.size()) * 100, 0)
      const pPoc = d3.round((poc.size()/prohibited.size()) * 100, 0)

      results.selectAll('.result-gender').text(`${pFem}%`)
      results.selectAll('.result-race').text(`${pPoc}%`)

    })
}

function cleanData(arr){
	return arr.map((d, i) => {
		return {
			...d,
			group: +d.group
		}
	})
}

function setupChart(){
	let nested = d3.nest()
		.key(d => d.type)
		.key(d => d.group)
		.entries(data)

	// fill in missing values
	let groups = []

	const allNested = nested.map(e => {
		const f = e.values
		groups.push(f)
		const updatedVal = d3.range(0, 20).map(i => {
			const key = i.toString()
			const match = f.find(d => d.key === key)

			if (match) return match
			else return {key, values: []}
		})
		return {key: e.key, values: updatedVal}
	})

	console.log({allNested})

	const charts = $container
		.selectAll('.chart')
		.data(allNested)
		.enter()
		.append('div.chart')
		.histogram()
}

function resize() {}

function init() {
	return new Promise((resolve) => {
		d3.loadData('assets/data/histogramData.csv', (err, response) => {
			data = cleanData(response[0])
			console.log({data})
			setupItems()
			setupCompleteButton()
			setupChart()
			resolve()
		})
	})

}

export default { init, resize };
