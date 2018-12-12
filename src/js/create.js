// selections
const grid = d3.select('.create__grid')
const items = grid.selectAll('.grid__item')
const results = d3.select('.create__results')

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

function resize() {}

function init() {
	console.log('Make something awesome!');
	setupItems()
  setupCompleteButton()
}

export default { init, resize };
