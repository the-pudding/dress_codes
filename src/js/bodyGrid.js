const $container = d3.select('.container__grid')

let data = null

function resize(){

}

function init(){
  return new Promise((resolve) => {
		d3.loadData('assets/data/bodyPerSchool.csv', (err, response) => {
			data = response[0]
      console.log({data})
      //setupDiv()
			resolve()
		})
	})
}

export default {init, resize}
