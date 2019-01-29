
let $container = d3.select('.words__explore')
let $words = $container.select('.chart__container-words')
let $examples = $container.select('.chart__container-examples')

// data
let wordData = []
let exampleData = []
let nestedExample = []

let selectedWords = 'disruption/distraction'

function cleanWords(arr){
	return arr.map((d, i) => {
		return {
			...d,
      n: +d.n,
      per: +d.per,
		}
	})
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

  const $left = $wordCounts.append('div.left')
  const $right = $wordCounts.append('div.right')

  $left
    .append('p.word-title')
    .text(d => d.display)

  $left
    .append('p.word-count')
    .text(d => `Found in ${d.n} dress codes (${d.per}%)`)
}

function updateExample(word){

  const relevantData = nestedExample.filter(d => d.key === word)[0].values

  console.log({relevantData, $examples})
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
