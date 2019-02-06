import scrollama from 'scrollama'
import intersectionObserver from 'intersection-observer'

let data = []
let nested = []

// scrollama setup
const scroller = scrollama()

// selections
const $scroll = d3.select('.scroll')
const $container = $scroll.select('.container__clothes')
const $text = $scroll.select('.scroll-text')
const $step = $text.selectAll('.step')
const $legend = $scroll.select('.chart__subtitle-fullWidth')

// colors
const white = '#FFFFFF'
const primary = '#0976DC'
const secondary = '#158A36'
const offBlack = '#282828'

let $histCol = null
let $clothes = null

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

function startScroll(){
	$histCol.classed('is-dimmed', false)
	$clothes.classed('is-dimmed', false)
		.st('backgroundColor', white)
		.st('color', offBlack)

	$legend.classed('is-visible', false)
}

function highlightTop(){
	$histCol.classed('is-dimmed', true)

	$container.select('.clothes__group-60').classed('is-dimmed', false)

	$clothes
		.classed('is-dimmed', false)
		.st('backgroundColor', white)
		.st('color', offBlack)

	$legend.classed('is-visible', false)
}

function highlightBottom(){
	$clothes.st('backgroundColor', white)

	$histCol.classed('is-dimmed', true)

	$container.select('.clothes__group-0').classed('is-dimmed', false)

	$clothes
		.classed('is-dimmed', false)
		.st('color', offBlack)

	$legend.classed('is-visible', false)
}

function highlightNonSexual(){
	$clothes.st('backgroundColor', white)

	$histCol.classed('is-dimmed', false)

	$clothes
		.classed('is-dimmed', true)
		.transition()
		.duration(300)
		.st('color', offBlack)

	$container.selectAll('.items__reveal-n').classed('is-dimmed', false)
	$legend.classed('is-visible', false)
}

function addColor(){

	$histCol.classed('is-dimmed', false)
	$clothes.classed('is-dimmed', false)

	$container.selectAll('.items__reveal-n').classed('is-dimmed', true)

	$clothes
		.transition()
		.duration(300)
		.st('backgroundColor', d => {
			if (d.market == 'f') return primary
			else if (d.market == 'm') return secondary
			else return white
		})
		.st('color', d => {
			if (d.market == 'f' || d.market == 'm') return white
			else return offBlack
		})

		$legend.classed('is-visible', true)
}

function handleStepEnter(response){
	const index = response.index
	console.log({index})

	if (index === 0) startScroll()
	if (index === 1) highlightTop()
	if (index === 2) highlightBottom()
	if (index === 3) highlightNonSexual()
	if (index === 4) addColor()
}

function setupScroll(){
	scroller.setup({
		container: '.scroll',
		graphic: '.container__clothes',
		text: '.scroll-text',
		step: '.step',
		debug: false,
		offset: 0.85
	})
	.onStepEnter(handleStepEnter)
}

function setup(){
  nested = d3.nest()
    .key(d => +d.group)
    .sortValues((a, b) => d3.ascending(a.market, b.market))
    //.sortValues((a, b) => d3.ascending(a.reveal_body, b.reveal_body))
    .entries(data)

  // fill in any missing groups
  let maxGroup = +d3.max(nested, d => d.key) + 10

  let allNested = d3.range(0, maxGroup, 10).map(i => {
    const preVal = nested.filter(d => +d.key === i)
    const len = preVal.length
    return len === 0 ? {key: i.toString(), values: []} : preVal[0]
  })

  const $subClothes = $container.append('div.clothes__all')

  const groups = $subClothes
    .selectAll('.clothes__group')
    .data(allNested)
    .enter()
    .append('div')
    .attr('class', d => `clothes__group clothes__group-${d.key}`)

	$histCol = $container.selectAll('.clothes__group')

  const $onlyClothes = groups.append('div.clothes__only')

  $onlyClothes
    .selectAll('.clothes__item')
    .data(d => d.values)
    .enter()
    .append('span')
    .text(d => d.slug)
    .attr('class', d => `clothes__item items__reveal-${d.reveal_body} items__market-${d.market}`)
		.st('backgroundColor', white)

		$clothes = $container.selectAll('.clothes__item')

  const axisGroup = groups.append('div.axis__group')

  axisGroup
    .append('div.axis__text')
    .text(d => +d.key === 0 ? `5 - 10%` : `${d.key} - ${+d.key + 10}%`)

  axisGroup
    .append('span.axis__text-sub')
    .text('of schools')

	setupScroll()
}

function resize(){
	const stepHeight = Math.floor(window.innerHeight)
	console.log({$text, $step})

	$step
		.st('height', `${stepHeight}px`)

	scroller.resize()
}

function init(){
  return new Promise((resolve) => {
		d3.loadData('assets/data/clothes.csv', (err, response) => {
			data = cleanData(response[0])
      setup()
			resize()
			resolve()
		})
	})
}

export default {init, resize}
