import lookupStateName from './utils/lookup-state-name'

const $figureCont = d3.select('.container__figure')
const $container = $figureCont.select('.container__grid')
const $filterCont = d3.select('.filters')
const $state = $filterCont.select('.select__state')
const $size = $filterCont.select('.select__size')
const $locale = $filterCont.select('.select__locale')
const $buttonCont = d3.selectAll('.buttons button')
const $expandButton = d3.select('.toggle-table button')


let data = null

let $blocks = null

// user selections
let selectedState = 'All schools'
let selectedSize = 'All school sizes'
let selectedLocale = 'All locales'
let bodySel = {}

let svgBook = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>'

function cleanData(arr){
	return arr.map((d, i) => {
		return {
			...d,
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

function setup(){
  const blocks = $container
    .selectAll('.grid__blocks')
    .data(data)
    .enter()
    .append('div.grid__blocks.is-visible')
    .html(svgBook)

  $blocks = $container.selectAll('.grid__blocks')

  setupDropdowns($state, 'state', 'states')
  setupDropdowns($size, 'countGroup', 'school sizes')
  setupDropdowns($locale, 'localeGroup', 'locales')
  setupButtons()
  setupExpand()
}


function setupDropdowns(selection, options, filter){

  console.log({selection, options, filter, data})

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

function resize(){

}

function init(){
  return new Promise((resolve) => {
		d3.loadData('assets/data/bodyPerSchool.json', (err, response) => {
			data = cleanData(response[0])
      setup()
			resolve()
		})
	})
}

export default {init, resize}
