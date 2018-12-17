import './pudding-chart/histogram-template'

// selections
const grid = d3.select('.create__grid')
const items = grid.selectAll('.grid__item')
const results = d3.select('.create__results')
const $container = d3.selectAll('.container__create')
const $userSelected = d3.selectAll('.create__prohibited')


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
			const proArray = prohibited.nodes().map( d => {
				console.log({d})
				return d.dataset.index
			})
			console.log({proArray})
      const fem = prohibited.filter((d, i, n) => d3.select(n[i]).attr('data-gen') === 'f')
      const poc = prohibited.filter((d, i, n) => d3.select(n[i]).attr('data-race') === 'y')
      const pFem = d3.round((fem.size()/prohibited.size()) * 100, 0)
      const pPoc = d3.round((poc.size()/prohibited.size()) * 100, 0)

      results.selectAll('.result-gender').text(`${pFem}%`)
      results.selectAll('.result-race').text(`${pPoc}%`)

			// setup selected prohibitions
			const prohibitedItems = $userSelected
				.selectAll('.grid__item')
				.filter((d, i, n) => d3.select(n[i]).attr('data-index') === proArray)

				console.log({prohibited, prohibitedItems})


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
	let $sel = d3.select(this)
	let type = $sel.at('data-group')

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


	let filtered = allNested.filter(d => d.key === type)
	console.log({filtered})

	const charts = $sel
		.datum(filtered)
		.histogram()
}

function setupProhibitions(){

}

function resize() {}

function init() {
	return new Promise((resolve) => {
		d3.loadData('assets/data/histogramData.csv', (err, response) => {
			data = cleanData(response[0])
			console.log({data})
			setupItems()
			setupCompleteButton()
			$container.each(setupChart)
			resolve()
		})
	})

}

export default { init, resize };
