/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.bubbleChart = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
    let fontSize = 12

		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 0;
		const marginBottom = 0;
		const marginLeft = 0;
		const marginRight = 0;
    let center = null
    let groupCenters = null
    let raceCenters = null

    // simulation variables
    let forceStrength = 0.3
    let simulation = null

		// scales
		const scaleX = null;
		const scaleY = null;
    let scaleR = d3.scaleSqrt()

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;

		// helper functions

    function handleMouseover(){
    	const deselect = d3.selectAll('.is-active')
    		.classed('is-active', false)

    	const hovered = d3.select(this.parentNode)

    	hovered
    		.classed('is-active', true)
    		.raise()
    }

    function charge(d) {
      return -Math.pow(d.radius, 2.0) * forceStrength;
    }

    function nodeGroupPos(d) {
       return groupCenters[d.gender].x;
     }

     function raceGroupPos(d){
       const test = raceCenters[d.race]
       return raceCenters[d.race].y;
     }

    function setupSim(){

      const forceCollide = d3.forceCollide(d => scaleR(Math.abs(d.n)) + 1)
      //const forceCollide = d3.forceCollide(10)
    	const simulation = d3.forceSimulation(data)
    		.force('x', d3.forceX(nodeGroupPos).strength(1))
    		.force('y', d3.forceY(raceGroupPos).strength(1))
    		.force('collide', forceCollide)
    		.alphaDecay(0.0228)
        .velocityDecay(0.4)
        .alpha(1)
    		.stop()

    	for(var i = 0; i < 600; ++i) simulation.tick()

    }

    function ticked(){

    }

		const Chart = {
			// called once at start
			init() {
				$svg = $sel.append('svg.pudding-chart');
				const $g = $svg.append('g');

				// offset chart for margins
				$g.at('transform', `translate(${marginLeft}, ${marginTop})`);

				// // create axis
				// $axis = $svg.append('g.g-axis');

				// setup viz group
				$vis = $g.append('g.g-vis');

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = $sel.node().offsetHeight - marginTop - marginBottom;
				$svg.at({
					width: width + marginLeft + marginRight,
					height: height + marginTop + marginBottom
				});

        let max = d3.max(data, d => d.n)
        let maxCircleR = 25

        scaleR = d3.scalePow()
          .range([2, 30])
          .domain(d3.extent(data, d => d.n))

          center = {
            x: width / 2,
            y: height / 2
          }

          groupCenters = {
            'f': { x: width / 3, y: height / 2 },
            'm': { x: width / 2, y: height / 2 },
            'n': { x: 2 * width / 3, y: height / 2 }
          };

          raceCenters = {
            'c': { x: width / 2, y: height / 3},
            'w': { x: width / 2, y: height / 2},
            'n': { x: width / 2, y: 2 * height / 3}
          }


				return Chart;
			},
			// update scales and render chart
			render() {
        // setup simulation
        setupSim()

        // add nodes
        //const circleWords = $vis.selectAll('.g-circleWords')

      	const circleGroup = $vis
      		.selectAll('.g-circle')
      		.data(data)

      	const circleGroupEnter = circleGroup
      		.enter()
      		.append('g')
      		.attr('class', 'g-circle')

      	circleGroupEnter
      		.append('circle')
      		.attr('class', d => `circle circle--${d.item}`)
      		//.attr('r', d => d.special == true ? d.radius : scaleR(d.total))
      		.attr('r', d => scaleR(Math.abs(d.n)))
          //.attr('r', 5)
      		.attr('cx', d => d.x)
      		.attr('cy', d => d.y)
      		//.attr('fill', d => scaleC(d.ratio))
      		//.attr('opacity', d => scaleO(Math.abs(d.ratio)))
      		//.style('stroke', d => d3.color(scaleC(d.ratio)).darker(0.5))
      		.style('stroke', '#000')
      		.on('mouseover', handleMouseover)
      		//.on('mouseout', handleMouseout)

      	circleGroupEnter
      		.append('text')
      		.attr('class', 'label label--bg tk-atlas')
      		.text(d => d.item)
      		.attr('text-anchor', 'middle')
      		.attr('alignment-baseline', d => 'baseline')
      		.attr("dx", d => d.x)
        	.attr("dy", d => d.y)
        	.attr('transform', d => `translate(0, ${-scaleR(d.n) - fontSize / 2})`)


      	circleGroupEnter
      		.append('text')
      		.attr('class', 'label tk-atlas')
      		.text(d => d.item )
      		.attr('text-anchor', 'middle')
      		.attr('alignment-baseline', d => 'baseline')
      		.attr("dx", d => d.x)
        	.attr("dy", d => d.y)
        	.attr('transform', d => `translate(0, ${-scaleR(d.n) - fontSize / 2})`)

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
