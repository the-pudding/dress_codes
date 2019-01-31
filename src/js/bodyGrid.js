import lookupStateName from './utils/lookup-state-name'

const $container = d3.select('.container__grid')
const $filterCont = d3.select('.filters')
const $state = $filterCont.select('.select__state')
const $size = $filterCont.select('.select__size')
const $locale = $filterCont.select('.select__locale')
const $buttonCont = d3.select('.buttons')

let data = null

// user selections
let selectedState = 'All schools'
let selectedSize = 'All school sizes'
let selectedLocale = 'All locales'

let svgBook = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'

function cleanData(arr){
	return arr.map((d, i) => {
		return {
			...d,
      state: lookupStateName(d.state),
		}
	})
}

function setup(){
  const blocks = $container
    .selectAll('.grid__blocks')
    .data(data)
    .enter()
    .append('div.grid__blocks.is-visible')
    .html(svgBook)

  setupDropdowns($state, 'state', 'states')
  setupDropdowns($size, 'countGroup', 'school sizes')
  setupDropdowns($locale, 'localeGroup', 'locales')
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

  const $blocks = $container.selectAll('.grid__blocks')

  $blocks
    .classed('is-visible', d => {
      if ((d.state == selectedState || selectedState == 'All states') &&
      (d.countGroup == selectedSize || selectedSize == 'All school sizes') &&
      (d.localeGroup == selectedLocale || selectedLocale == 'All locales')) {return true}
      else return false
    })
    // .classed('is-visible', d => {
    //   if ((d.state == selectedState || selectedState == 'All schools') &&
    //     (d.countGroup == selectedSize || selectedSize == 'All styles') &&
    //     (d.Locale == selectedLocale || selectedLocale == 'All prices')){
		// 		return true}
    //   else return false
    // })


}

function resize(){

}

function init(){
  return new Promise((resolve) => {
		d3.loadData('assets/data/bodyPerSchool.csv', (err, response) => {
			data = cleanData(response[0])
      setup()
			resolve()
		})
	})
}

export default {init, resize}
