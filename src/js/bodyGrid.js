const $container = d3.select('.container__grid')

let data = null

let svgBook = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'

function setup(){
  const blocks = $container
    .selectAll('.grid__blocks')
    .data(data)
    .enter()
    .append('div.grid__blocks')
    .html(svgBook)

}

function resize(){

}

function init(){
  return new Promise((resolve) => {
		d3.loadData('assets/data/bodyPerSchool.csv', (err, response) => {
			data = response[0]
      setup()
			resolve()
		})
	})
}

export default {init, resize}
