import './pudding-chart/item-histogram'

// global variables
let data = null


// global selections
const $item = d3.selectAll('.item')

function setupChart(){

  const $sel = $item
    const nestedData = d3.nest()
      .key(d => d.gender)
      .key(d => d.race)
      .sortValues((a,b) => parseFloat(b.n) - parseFloat(a.n))
      .entries(data)

    const charts = $sel
      .datum(nestedData)
      .itemHistogram()

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
