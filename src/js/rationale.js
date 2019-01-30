
let $container = d3.select('.words__explore')
let $words = $container.select('.chart__container-words')
let $examples = $container.select('.chart__container-examples')

// data
let wordData = []
let exampleData = []
let nestedExample = []

let selectedWords = 'disruption/distraction'

const svgArrow = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>'

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
  d3.selectAll('.g-word').classed('is-active', false)
  
  let $button = d3.select(this)

  $button.classed('is-active', true)

  let word = $button.at('data-word')

  updateExample(word)
}

function setupExample(){
  nestedExample = d3.nest()
    .key(d => d.item)
    .entries(exampleData)

  console.log({nestedExample})
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

function resize(){

}

function init(){
  return new Promise((resolve) => {
		d3.loadData('assets/data/words.csv', 'assets/data/extract.csv', (err, response) => {
			wordData = cleanWords(response[0])
      exampleData = response[1]
      console.log({wordData, exampleData})
      setupWords()
      setupExample()
      updateExample(selectedWords)
			resolve()
		})
	})
}

export default {init, resize}
