import lookupStateName from './utils/lookup-state-name'

const $figureCont = d3.select('.container__figure')
const $container = $figureCont.select('.container__grid')
const $filterCont = d3.select('.filters')
const $state = $filterCont.select('.select__state')
const $size = $filterCont.select('.select__size')
const $locale = $filterCont.select('.select__locale')
const $buttonCont = d3.selectAll('.buttons button')
const $expandButton = d3.select('.toggle-table button')
const $tooltip = $figureCont.select('.tooltip')


let data = null
let width = null
let minBlocks = null

// values set in css
let truncHeight = 416
let blockWidth = 30
let margin = 2
let tooltipWidth = 275
let halfTooltip = tooltipWidth / 2

let $blocks = null

// user selections
let selectedState = 'All schools'
let selectedSize = 'All school sizes'
let selectedLocale = 'All locales'
let bodySel = {}

let svgBook = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'

function cleanData(arr){
	return arr.map((d, i) => {
		return {
			...d,
      stateAbb: d.state,
      state: lookupStateName(d.state),
		}
	})
}

function setupExpand(){
  $expandButton.on('click', () => {
		const truncated = $container.classed('is-truncated');
		const text = truncated ? 'Show Fewer' : 'Show All';
		$expandButton.text(text);
		$container.classed('is-truncated', !truncated);

		if (!truncated) {
			const y = +$expandButton.at('data-y');
			window.scrollTo(0, y);
		}

		$expandButton.at('data-y', window.scrollY);
		$figureCont.select('.show-more').classed('is-visible', !truncated);
	});
}

function handleTooltip(){
  const $sel = d3.select(this)
  const block = $sel.data()[0]

  const $name = $tooltip.select('.school__name')
    .text(block.schoolName)

  const $state = $tooltip.select('.school__state')
    .text(block.stateAbb)

  const $size = $tooltip.select('.school__size')
    .text(`${block.countGroup} students`)

  const blockLeft = $sel.node().offsetLeft
  const blockTop = $sel.node().offsetTop

  $tooltip
    .st('top', `${blockTop - blockWidth * 2}px`)
    .classed('is-visible', true)

  if (blockLeft < halfTooltip){
    $tooltip
      .st('left', `${blockLeft + blockWidth}px`)
  } else if (blockLeft + halfTooltip > width && blockLeft - tooltipWidth > 0){
    $tooltip
      .st('left', `${blockLeft - tooltipWidth}px`)
  } else if (blockLeft + halfTooltip > width && blockLeft - tooltipWidth < 0){
    $tooltip
      .st('left', `${blockLeft - tooltipWidth * 3 / 4}px`)
  } else {
    $tooltip
      .st('left', `${blockLeft - halfTooltip}px`)
  }

}

function setup(){
  const blocks = $container
    .selectAll('.grid__blocks')
    .data(data)
    .enter()
    .append('div.grid__blocks.is-visible')
    .html(svgBook)
    .on('mouseover', handleTooltip)
    .on('click', handleTooltip)

  $blocks = $container.selectAll('.grid__blocks')

  setupDropdowns($state, 'state', 'states')
  setupDropdowns($size, 'countGroup', 'school sizes')
  setupDropdowns($locale, 'localeGroup', 'locales')
  setupButtons()
  setupExpand()

  // on mouseout make tooltip invisible
  $container
    .on('mouseleave', d => {
      $tooltip.classed('is-visible', false)
    })
}


function setupDropdowns(selection, options, filter){

  selection
    .selectAll('option')
    .data(d => {
        const nestSchools = d3.nest()
          .key(d => d[options])
          .sortKeys(d3.ascending)
          .entries(data)
          .map(e => e.key)

        nestSchools.unshift('All ' + filter)

        return nestSchools
    })
    .enter()
    .append('option')
    .attr('value', d => d)
    .text(d => d)

    selection.on('change', updateSelection)
}

function updateSelection(){
  const dropdown = d3.select(this).at('data-dropdown')
  const selection = this.value

  if (dropdown == 'state') selectedState = selection
  if (dropdown == 'size') selectedSize = selection
  if (dropdown == 'locale') selectedLocale = selection

  console.log({dropdown, selection, selectedLocale})



  $blocks
    .classed('is-visible', d => {
      if ((d.state == selectedState || selectedState == 'All states') &&
      (d.countGroup == selectedSize || selectedSize == 'All school sizes') &&
      (d.localeGroup == selectedLocale || selectedLocale == 'All locales')) {return true}
      else return false
    })


  const visible = d3.selectAll('.grid__blocks.is-visible')
  const $warning = d3.select('.ui-warning')

  const size = visible.size()
  console.log({size})

  if (visible.size() < 1) $warning.classed('is-active', true)
  if (visible.size() > 1) $warning.classed('is-active', false)

  handleShowMore()
}

function containsPart(arr, part) {
  console.log({part})
	if (!arr.length) return false;
	if (!part) return false;
	return !!part.find(i => arr.includes(i));
}

function handleButtonClick(){
  console.log("clicked!")
  const $btn = d3.select(this)
  const value = $btn.at('data-button')
  const active = $btn.classed('is-active')
  $btn.classed('is-active', !active)
  bodySel[value.toLowerCase()] = !active

  const bodyVals = Object.keys(bodySel)
    .filter(d => bodySel[d])
    .map(d => d)

  $blocks.classed('is-highlighted', d => {
    if (bodyVals.length){
    const success = bodyVals.every((val) => d.bodyParts.includes(val))
    const bp = d.bodyParts
    return success}
    else return false
  })

}

function setupButtons(){
  $buttonCont.on('click', handleButtonClick)
}

function handleShowMore(){
  const $gradient = $figureCont.select('.show-more')//.classed('is-visible', !truncated);
  const visible = $container.selectAll('.grid__blocks.is-visible').size()

  console.log({visible, minBlocks})

  if (visible < minBlocks){
    $gradient.classed('is-visible', false)
    $expandButton
      .prop('disabled', true)
      .classed('is-disabled', true)
  } else {
    $gradient.classed('is-visible', true)
    $expandButton
      .prop('disabled', false)
      .classed('is-disabled', false)
  }
}



function resize(){
  width = $container.node().offsetWidth
  const col = Math.floor(width / (blockWidth + (margin * 2)))
  const row = Math.floor(truncHeight / (blockWidth + (margin * 2)))
  // if fewer than minBlocks, then "Show More" should be disabled
  minBlocks = col * row
  handleShowMore()
}

function init(){
  return new Promise((resolve) => {
		d3.loadData('assets/data/bodyPerSchool.json', (err, response) => {
			data = cleanData(response[0])
      setup()
      resize()
			resolve()
		})
	})
}

export default {init, resize}
