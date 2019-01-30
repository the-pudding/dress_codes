import lookupStateName from './utils/lookup-state-name'

const $container = d3.select('.container__grid')
const $filterCont = d3.select('.filters')
const $state = $filterCont.select('.select__state')
const $size = $filterCont.select('.select__size')
const $locale = $filterCont.select('.select__locale')
const $buttonCont = d3.select('.buttons')

let data = null

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
    .append('div.grid__blocks')
    .html(svgBook)

  setupDropdowns($state, 'state', 'states')
  setupDropdowns($size, 'countGroup', 'school sizes')
  setupDropdowns($locale, 'localeGroup', 'locales')
}


function setupDropdowns(selection, options, filter){

  console.log({selection, options, filter})

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

    //selection.on('change', updateSelection)
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
