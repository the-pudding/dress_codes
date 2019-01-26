let data = []
let nested = []

// selections
const $container = d3.select('.container__clothes')

function cleanData(arr){
	return arr.map((d, i) => {
		return {
			...d,
			group: +d.group,
      n: +d.n,
      per: +d.per,
		}
	})
}

function setup(){
  nested = d3.nest()
    .key(d => d.group)
    .sortValues((a, b) => d3.ascending(a.market, b.market))
    //.sortValues((a, b) => d3.ascending(a.reveal_body, b.reveal_body))
    .entries(data)

    console.log({nested})

  const $subClothes = $container.append('div.clothes__all')

  const groups = $subClothes
    .selectAll('.clothes__group')
    .data(nested)
    .enter()
    .append('div')
    .attr('class', d => `clothes__group clothes__group-${d.key}`)

  const $onlyClothes = groups.append('div.clothes__only')

  $onlyClothes
    .selectAll('.clothes__item')
    .data(d => d.values)
    .enter()
    .append('span')
    .text(d => d.slug)
    .attr('class', d => `clothes__item items__reveal-${d.reveal_body} items__market-${d.market}`)

  const axisGroup = groups.append('div.axis__group')

  axisGroup
    .append('div.axis__text')
    .text(d => +d.key === 0 ? `5 - 10%` : `${d.key} - ${+d.key + 10}%`)

  axisGroup
    .append('span.axis__text-sub')
    .text('of schools')

}

function resize(){

}

function init(){
  return new Promise((resolve) => {
		d3.loadData('assets/data/clothes.csv', (err, response) => {
			data = cleanData(response[0])
      console.log({data})
      setup()
			// setupItems()
			// setupCompleteButton()
			// $container.each(setupChart)
			// resolve()
		})
	})
}

export default {init, resize}
