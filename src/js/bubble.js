import './pudding-chart/bubble-template'

// global variables
let data = null


// global selections
const $bubble = d3.selectAll('.bubble')

function setupChart(){

  const $sel = $bubble
    // const nestedData = d3.nest()
    //   .key(d => d.name)
    //   .entries(data)

    const filteredData = data.filter(d => d.type != 'promotion')
    console.log({filteredData})

    const charts = $sel
      .select('.chart')
      .datum(data)
      .bubbleChart()

}


function cleanData(arr){
  return arr.map((d, i) => {
    return {
      ...d,
      n: +d.n
    }
  })
}

function resize(){

}

function init(){
  return new Promise((resolve) => {
    d3.loadData('assets/data/bubbleData.csv', (err, response) => {
      data = cleanData(response[0])
      setupChart()
      resolve()
    })
  })

}

export default {init, resize}
