/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.itemHistogram = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
    let $chart = null
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 0;
		const marginBottom = 0;
		const marginLeft = 0;
		const marginRight = 0;
    const padding = 1

		// scales
		const scaleX = null
		let scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;

		// helper functions

		const Chart = {
			// called once at start
			init() {
        $sel.selectAll('.chart')
          .data(data)
          .enter()
          .append('div')
          .attr('class', d => `chart chart-${d.key}`)

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = $sel.node().offsetHeight - marginTop - marginBottom;

        scaleY = d3
        	.scaleLinear()
        	.range([1, 20])
        	.domain([0, 286]);

				return Chart;
			},
			// update scales and render chart
			render() {
        $chart = $sel.selectAll('.chart')
        const barWidth = 3
        const barHeight = 15

        const raceGroup = $chart
          .selectAll('.race-group')
          .data(d => d.values)
          .enter()
          .append('div')
          .attr('class', d => `race-group race-group-${d.key}`)

        const bars = raceGroup
          .selectAll('.bar')
          .data(d => d.values)
          .enter()
          .append('div')
          .attr('class', d => `bar bar-${d.item}`)
          .style('width', d => `${Math.floor(scaleY(d.n))}px`)
          .style('height', `${barHeight}px`)

        // const barHeight = 23
        // const barWidth = 3
        // const $chart = $sel.selectAll('.chart')
        //   .style('height', `${height}px`)
        // enter groups
        // const histGroup = $chart
        //   .selectAll('.hist-group')
        //   .data(d => d.values)
        //   .enter()
        //   .append('div')
        //   .attr('class', (d, i) => `hist-group hist-group-${i}`)
        //   .style('height', `${barHeight}px`)
        // add blocks

        // const blocks = histGroup
        //   .selectAll('.block')
        //   .data(d => {
        //     const val = d.values
        //     val.push({school: "User"})
        //     return val})
        //   .enter()
        //   .append('div')
        //   .attr('class', d => {
        //     if (d.school === "User") return `block-user`
        //     else return `block`
        //   })
        //   .style('height', `${barHeight}px`)
        //   .style('width', `${barWidth}px`)
        //
        // const axisLabels = d3.selectAll('.axis-label')
        //   .attr('height', `${barHeight}px`)

        // add user labels

        // histGroup
        //   .append('div.label-line')
        //   .style('height', `1px`)
        //   .style('width', `1rem`)
        //
        // histGroup
        //   .append('text')
        //   .text('You')
        //   .attr('class', d => {
        //     return `label-user label-user-${d.key} tk-atlas`
        //   })

        // add x axis labels
        // const labels = histGroup
        //   .append('text')
        //   .attr('class', d => {
        //     if ((d.key * 5) % 10 == 0) return `hist-label hist-label-ten hist-label-${d.key} tk-atlas`
        //     else return `hist-label hist-label-five hist-label-${d.key} tk-atlas`
        //   })
        //   .text(d => `${d.key * 5}`)
        //   .style('text-align', 'center')
        //   .translate([-barWidth / 2, 0])

        // adjust legend size
        //const legend = d3.selectAll('.legend .block').style('width', `${barWidth}px`)


				return Chart;
			},
			// get / set data
			data(val) {
				if (!arguments.length) return data;
				data = val;
				$sel.datum(data);
				Chart.render();
				return Chart;
			}
		};
		Chart.init();

		return Chart;
	}

	// create charts
	const charts = this.nodes().map(createChart);
	return charts.length > 1 ? charts : charts.pop();
};
