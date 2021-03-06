// selections
const $container = d3.select('.container__bodyBar')
const $svg = $container.select('svg')
const $containerBars = $container.select('.container__bars')
let $right = null
let $left = null

let $g = null
let $axis = null
let barGroup = null

let labelWidth = 80

// data
let data = []

// dimensions
let margin = {
  top: 30,
  bottom: 0,
  left: 0,
  right: 0
}

const scaleX = d3.scaleLinear()
const scaleY = d3.scaleBand()
let width = 0
let height = 0

// constants
let barHeight = 20
let paddingHeight = 8
const textPaddingSide = 6
const textPaddingTop = 3
const fontSize = 12

function cleanData(arr){
	return arr.map((d, i) => {
		return {
			...d,
      n: +d.n,
      per: +d.per,
		}
	})
}

function setupDiv(){
  $left = $containerBars.append('div.left')
  $right = $containerBars.append('div.right')

  const barGroups = $right.selectAll('bar__group')
    .data(data)
    .enter()
    .append('div.bar__group')

  const label = barGroups
    .append('div.bar__label')

  label
    .append('p.bar__label-text')
    .text(d => d.item)

  const bar = barGroups
    .append('div.bar__bar')

  bar
    .append('p.bar__bar-text')
    .text(d => `${d.per}%`)

  resize()
}

function setup(){
  $g = $svg.append('g.g__gbars')

  // offset chart for margins
	$g.at('transform', `translate(${margin.left}, ${margin.top})`);

  $axis = $svg.append('g.g__axis')
  // offset chart for margins
  $axis.at('transform', `translate(${margin.left}, ${margin.top})`);

  barGroup = $g
    .selectAll('.bar__group')
    .data(data)
    .enter()
    .append('g.bar__group')

  resize()
}

function render(){
  $axis
    .call(d3.axisTop(scaleX)
      .ticks(6)
      .tickSize(-height - 10)
      .tickSizeOuter(0)
      .tickFormat(function(d, i){
        return this.parentNode.nextSibling
        ?  d : d + "%"
      })
      .tickPadding(10)
    )
    .attr('transform', `translate(5, -10)`)

  const bars =  barGroup
    .selectAll('.bar')
    .data(d => [d])

  const barsEnter = bars
    .enter()
    .append('rect')
    .attr('class', 'bar')

  bars.exit().remove

  const barsMerge = barsEnter.merge(bars)
    .attr('width', d => scaleX(d.per))
    .attr('height', barHeight)
    .attr('transform', `translate(5, 0)`)
    .attr('rx', 12)
    .attr('ry', 12)

  const labels = barGroup
    .selectAll('.g-label')
    .data(d => [d])

  const labelsEnter = labels
    .enter()
    .append('g')

  labels.exit().remove

  const labelsMerge = labelsEnter.merge(labels)
    .attr('class', 'g-label')

  labelsEnter
    .append('text')
    .attr('class', d => {
        return `label-text-bg`})
    .text(d => d.item)
    .attr('transform', `translate(${textPaddingSide}, 0)`)
    .style('text-transform', 'uppercase')
    //.style('font-size', fontSize)
    .attr('alignment-baseline', 'hanging')

  labelsEnter
    .append('text')
    .attr('class', d => {
        return `label-text`})
    .text(d => d.item)
    .attr('transform', `translate(${textPaddingSide}, 0)`)
    .style('text-transform', 'uppercase')
    //.style('font-size', fontSize)
    //.style('font-weight', 600)
    .attr('alignment-baseline', 'hanging')

  labelsEnter
    .attr('transform', d => `translate(${scaleX(d.per) + textPaddingSide}, 0)`)

  barGroup
    .attr('transform', (d, i) => `translate(0, ${i * (barHeight + paddingHeight)})`)
}

function editAttr(attr, num){
  let sel = $svg.select(`#${attr}${num}`).select('tspan')
    .text(`${data[num - 1].item}`)
}

function resize(){
  // defaults to grabbing dimensions from container element
  width = $container.node().offsetWidth - margin.left - margin.right;
  height = (barHeight * data.length) + (paddingHeight * (data.length - 1))
  // const len = data.length
  //
	// $svg.at({
	// 	width: width,
	// 	height: height
	// });
  //
  // console.log(width)

  const max = d3.max(data, d => d.per)

  scaleX
    .domain([0, max])
    .range([0, width - margin.right - margin.left])

  // let blocks = d3.range(1, 8)
  //
  // blocks.map(d => editAttr('label', d))

  //editAttr('label', 1)

  // $g.at('transform', `translate(${marginLeft}, ${marginTop})`);
  //render()
  update()
}

function update(){
  $right.selectAll('.bar__bar')
    .st('width', d => scaleX(d.per))

  $right.selectAll('.bar__label')
    .st('width', d => labelWidth)
}

function init(){
  return new Promise((resolve) => {
		d3.loadData('assets/data/bodyPer.csv', (err, response) => {
			data = cleanData(response[0])
      setupDiv()
			resolve()
		})
	})
}

export default {init, resize}
