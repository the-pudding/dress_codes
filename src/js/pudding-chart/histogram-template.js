/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.histogram = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 0;
		const marginBottom = 0;
		const marginLeft = 0;
		const marginRight = 0;
    const padding = 1

		// scales
		const scaleX = null;
		const scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;

		// helper functions

		const Chart = {
			// called once at start
			init() {
				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = $sel.node().offsetHeight - marginTop - marginBottom;

				return Chart;
			},
			// update scales and render chart
			render() {
        console.log({data})
        const barWidth = (width / 20) - (padding * 2)
        // enter groups
        const histGroup = $sel
          .selectAll('.hist-group')
          .data(data.values)
          .enter()
          .append('div')
          .attr('class', (d, i) => `hist-group hist-group-${i}`)
          .style('width', `${barWidth}px`)

        // add blocks

        const blocks = histGroup
          .selectAll('.block')
          .data(d => {
            console.log({d})
            return d.values
          })
          .enter()
          .append('div')
          .attr('class', 'block')
          .style('height', `3px`)
          .style('width', `${barWidth}px`)

        // add x axis labels
        const labels = histGroup
          .append('text')
          .attr('class', d => {
            if ((d.key * 5) % 10 == 0) return `hist-label hist-label-ten hist-label-${d.key} tk-atlas`
            else return `hist-label hist-label-five hist-label-${d.key} tk-atlas`
          })
          .text(d => `${d.key * 5}`)
          .style('text-align', 'center')
          .translate([-barWidth / 2, 0])


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
