import './pudding-chart/histogram-template'

// selections
const grid = d3.select('.create__grid')
const items = grid.selectAll('.grid__item')
const results = d3.selectAll('.create__results')
const $container = d3.selectAll('.container__create')
const $userSelected = d3.selectAll('.create__prohibited')
const $axes = d3.selectAll('.container__create-axis')
const barHeight = 23


// data
let data = null

function setupItems(){
	items
		.on('click', function(d){
      const item = d3.select(this)
      item.classed('disabled', !item.classed('disabled'))
		})

	$userSelected.selectAll('.grid__item').classed('hidden', true)
}

function setupCompleteButton(){
  const button = d3.selectAll('#createFinish')

  button
    .on('click', d => {
			d3.selectAll('.block-user, .label-line, .label-user').classed('is-active', false)

      const prohibited = items.filter((d, i, n) => d3.select(n[i]).classed('disabled'))
			const proArray = prohibited.nodes().map( d => {
				return d.dataset.index
			})
      const fem = prohibited.filter((d, i, n) => d3.select(n[i]).attr('data-gen') === 'f')
			const masc = prohibited.filter((d, i, n) => d3.select(n[i]).attr('data-gen') === 'm')
			const genNeu = prohibited.filter((d, i, n) => d3.select(n[i]).attr('data-gen') === 'n')
      const poc = prohibited.filter((d, i, n) => d3.select(n[i]).attr('data-race') === 'y')
      const pFem = d3.round((fem.size()/prohibited.size()) * 100, 0)
			const pMas = d3.round((masc.size()/prohibited.size()) * 100, 0)
			const pGenNeu = d3.round((genNeu.size()/prohibited.size()) * 100, 0)
      const pPoc = d3.round((poc.size()/prohibited.size()) * 100, 0)

      results.selectAll('.femPer').text(`${pFem}%`)
			results.selectAll('.masPer').text(`${pMas}%`)
			results.selectAll('.neuPer').text(`${pGenNeu}%`)
      results.selectAll('.result-race').text(`${pPoc}%`)

			// setup selected prohibitions
			const prohibitedItems = $userSelected
				.selectAll('.grid__item')
				.classed('hidden', function(d){
					const ind = d3.select(this).attr('data-index')
					if (proArray.indexOf(ind) <= -1) return true
					else return false
				})

			prohibitedItems.filter((d, i, n) => d3.select(n[i]).attr('data-gen') === 'f').classed('is-feminine', true)
			prohibitedItems.filter((d, i, n) => d3.select(n[i]).attr('data-gen') === 'm').classed('is-masculine', true)
			prohibitedItems.filter((d, i, n) => d3.select(n[i]).attr('data-gen') === 'n').classed('is-genNeutral', true)

			// turn on histogram annotations
			const femGroup = Math.floor(pFem/5)
			const mascGroup = Math.floor(pMas/5)
			d3.select('.container__create-f')
				.select(`.hist-group-${femGroup}`)
				.selectAll('.block-user, .label-line, .label-user')
				.classed('is-active', true)

			d3.select('.container__create-m')
				.select(`.hist-group-${mascGroup}`)
				.selectAll('.block-user, .label-line, .label-user')
				.classed('is-active', true)
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
	const levels = d3.range(0, 20)
	const labels = $axes
			.selectAll('.axis-label')
			.data(levels)
			.enter()
			.append('div.axis-label')

	labels.append('text')
		.attr('class', d => {
	    if ((d * 5) % 10 == 0) return `hist-label hist-label-ten hist-label-${d} tk-atlas`
	    else return `hist-label hist-label-five hist-label-${d} tk-atlas`
	  })
	  .text(d => `${d * 5}%`)
	  .style('text-align', 'center')
		.translate([0, -barHeight / 2])


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
			setupItems()
			setupCompleteButton()
			$container.each(setupChart)
			resolve()
		})
	})

}

export default { init, resize };
