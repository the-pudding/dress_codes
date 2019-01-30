/* global d3 */
import debounce from 'lodash.debounce';
import isMobile from './utils/is-mobile';
import bodyBar from './bodyBar'
import bodyGrid from './bodyGrid'
import wordHist from './wordHist';
import item from './item'
import rationale from './rationale'
import EnterView from 'enter-view'
import SimpleBar from 'SimpleBar';

// new SimpleBar(document.getElementById('info-container'));

const $body = d3.select('body');
let previousWidth = 0;

function resize() {
	// only do resize on width changes, not height
	// (remove the conditional if you want to trigger on height change)
	const width = $body.node().offsetWidth;
	if (previousWidth !== width) {
		previousWidth = width;
		wordHist.resize();
		bodyBar.resize()
		rationale.resize()
	}
}

function setupEnterView(){

	EnterView({
		selector:'.lockscreen',
	  enter: function(el){
			el.classList.add('entered')
		},
	  offset: 0.25,
	  once: true
	})

}

function setupStickyHeader() {
	const $header = $body.select('header');
	if ($header.classed('is-sticky')) {
		const $menu = $body.select('.header__menu');
		const $toggle = $body.select('.header__toggle');
		$toggle.on('click', () => {
			const visible = $menu.classed('is-visible');
			$menu.classed('is-visible', !visible);
			$toggle.classed('is-visible', !visible);
		});
	}
}

function init() {
	// add mobile class to body tag
	$body.classed('is-mobile', isMobile.any());
	// setup resize event
	window.addEventListener('resize', debounce(resize, 150));
	// setup sticky header menu
	setupStickyHeader();
	// kick off graphic code
	bodyBar.init()
	bodyGrid.init()
	wordHist.init();
	rationale.init()
	setupEnterView()
	// item.init()
}

init();
