
let $container = d3.select('.words__explore')
let $words = $container.select('.chart__container-words')
let $examples = $container.select('.chart__container-examples')
const $body = d3.select('body')
const $mobile = $container.select('.chart__container-mobile')

// data
let wordData = []
let exampleData = []
let nestedExample = []

// dimensions
let width = null
let mobile = false
let previousWidth = 0

let selectedWords = 'disruption/distraction'

const svgArrow = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>'
const svgPlus = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
const svgMinus = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>'

function cleanWords(arr){
	return arr.map((d, i) => {
		return {
			...d,
      n: +d.n,
      per: +d.per,
		}
	})
}

function handleClick(){
  $words.selectAll('.g-word').classed('is-active', false)

  let $button = d3.select(this)

  $button.classed('is-active', true)

  let word = $button.at('data-word')

  updateExample(word)
}

function setupExample(){
  nestedExample = d3.nest()
    .key(d => d.item)
    .entries(exampleData)
}

function setupWords(){
  const $wordCounts = $words
    .selectAll('.g-word')
    .data(wordData)
    .enter()
    .append('div.g-word')
    .attr('data-word', d => d.item)
    .on('click', handleClick)

  const $left = $wordCounts.append('div.left')
  const $right = $wordCounts.append('div.right')

  $left
    .append('p.word-title')
    .text(d => d.display)

  $left
    .append('p.word-count')
    .text(d => `Found in ${d.n} dress codes (${d.per}%)`)

  $right
    .append('div.arrow')
    .html(svgArrow)

	// automatically highlight default
	const $default = d3.select('.g-word')
	$default.classed('is-active', true)
}

function updateExample(word){
  $examples.selectAll('.g-example').remove()

  const relevantData = nestedExample.filter(d => d.key === word)[0].values

  const $schoolExample = $examples
    .selectAll('.g-example')
    .data(relevantData)
    .enter()
    .append('div.g-example')

  let $top = $schoolExample.append('div.top')
  let $bottom = $schoolExample.append('div.bottom')

  $top
    .append('p.school-name')
    .text(d => d.schoolName)

  $top
    .append('p.school-state')
    .text(d => d.state)

  $bottom
    .append('p.school-example')
    .text(d => d.extract)

}

function setupDesktop(){
	setupWords()
	setupExample()
	updateExample(selectedWords)
}

function setupMobileWords(){
	const $wordCounts = $mobile
    .selectAll('.g-word')
    .data(wordData)
    .enter()
    .append('div.g-word')
    .attr('data-word', d => d.item)
		.on('click', handleClickMobile)

	let $word = $wordCounts.append('div.word')
	let $wordLeft = $word.append('div.word-left')
	let $wordRight = $word.append('div.word-right')

	$wordLeft
		.append('p.word-title')
		.text(d => d.display )

	$wordLeft
		.append('p.word-count')
		.text(d => `Found in ${d.n} dress codes (${d.per}%)`)

	$wordRight
		.append('div.symbol')
		.html(svgPlus)

	let $simpleContainer = $wordCounts
		.append('div.simplebar__container-mobile')

		$simpleContainer.at('data-simplebar', true)

	let $mobileExample = $simpleContainer.append('div.example')

	// automatically have the first one expanded
	let $defaultSel = $mobile.select('.g-word')
	$defaultSel.classed('is-active', true)
	const $defaultEx = $defaultSel.select('.example')
	$defaultEx.classed('is-expanded', true)
	$defaultSel.select('.symbol').html(svgMinus)
	updateMobileExample(selectedWords, $defaultSel)
}

function handleClickMobile(){
	let $button = d3.select(this)
	console.log({$button})
	const example = $button.select('.example')
	const symbol = $button.select('.symbol')
	if ($button.classed('is-active') == true){
		$button.classed('is-active', false)
		example.classed('is-expanded', false)
		symbol.html(svgPlus)
	} else {
		console.log("running")
		$button.classed('is-active', true)
		example.classed('is-expanded', true)
		symbol.html(svgMinus)
	  let word = $button.at('data-word')
	  updateMobileExample(word, $button)
	}


}

function updateMobileExample(word, sel){
		let $mobileExampleContainer = sel.select('.example')//$mobile.selectAll('.g-word')
		console.log({$mobileExampleContainer})

		const relevantData = nestedExample.filter(d => d.key === word)[0].values.slice(0, 30)

		//console.log({$mobileWordCounts})

		const $schoolExample = $mobileExampleContainer
	    .selectAll('.g-example')
	    .data(relevantData)
	    .enter()
	    .append('div.g-example')

		let $top = $schoolExample.append('div.top')
	  let $bottom = $schoolExample.append('div.bottom')

	  $top
	    .append('p.school-name')
	    .text(d => d.schoolName)

	  $top
	    .append('p.school-state')
	    .text(d => d.state)

	  $bottom
	    .append('p.school-example')
	    .text(d => d.extract)
}

function setupMobile(){
	setupMobileWords()
}

function resize(){
	previousWidth = width
	width = $body.node().offsetWidth
	let previousMobile = previousWidth >= 640 ? false : true
	mobile = width >= 640 ? false : true
	let shouldUpdate = !previousMobile == mobile
	console.log({shouldUpdate, mobile, previousMobile})

	if (shouldUpdate == true && mobile == true){
		setupMobile()
	} else if (shouldUpdate == true && mobile == false){
		setupDesktop()
	}
}

function init(){
  return new Promise((resolve) => {
		d3.loadData('assets/data/words.csv', 'assets/data/extract.csv', (err, response) => {
			wordData = cleanWords(response[0])
      exampleData = response[1]
			setupExample()
      resize()
			if(width >= 640) setupDesktop()
			if(width < 640) setupMobile()
      // setupWords()
			//
      // updateExample(selectedWords)
			resolve()
		})
	})
}

export default {init, resize}
