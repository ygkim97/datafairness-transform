// for window resize event.
var _BasicStatisticsDialogUI = null;

function BasicStatisticsDialogUI(headerOriginalNameIndex) {
	this._createDialog(headerOriginalNameIndex);
} 

BasicStatisticsDialogUI.prototype._createDialog = function(selectedHeaders) {
	_BasicStatisticsDialogUI = this;
	
	var self = this;
	this.statData = {};

	var frame = $(DOM.loadHTML("core", "scripts/dialogs/basic-statistics-dialog.html"));
	this._elmts = DOM.bind(frame);

	this._level = DialogSystem.showDialog(frame);
	
	// btn setting
	this._elmts.closeButton.html($.i18n('core-buttons/close'));
	this._elmts.closeButton.click(function() {
		self._dismiss();
		Refine.OpenProjectUI.prototype._addTagFilter()
	});

	//set browser resize event
	$(window).resize((target) => {
		if (_BasicStatisticsDialogUI != null) {
			_BasicStatisticsDialogUI._setDialog();
		}
	})

	// title setting
	var title = $('<h5>').text($.i18n('core-index-dialog/title'));
	$('#graph-title').append(title);
	
	// Create Dialog
	this._getStatisticData(selectedHeaders);
}

BasicStatisticsDialogUI.prototype._getStatisticData = function(selectedHeaders) {
	if (selectedHeaders == 'all') {
		selectedHeaders = [];
	}
	const _self = this;
	
	const warningDialog1 = DialogSystem.showBusy($.i18n('core-index-dialog/loading-step1'));
	
	$.post(
			"command/core/get-based-statistic?" + $.param({ project: UI_CHART_INFO.selectedPId}),
			{headers: selectedHeaders.join(',')},	// no history option
			function(data) {
				warningDialog1();
				
				if(data.code === "error") {
					alert('error')
				} else {
					_self.statData.datas = data.frequencyList;
					_self.statData.columnInfo = data.columnInfo;
					_self.statData.rowNames = data.rowNames;
					
					_self._setDialog('all');
				}
			},
			"json"
	);
}
BasicStatisticsDialogUI.prototype._setDialog = function(drawType) {
	const _self = this;
	const warningDialog2 = DialogSystem.showBusy($.i18n('core-index-dialog/loading-step2'));
	
	setTimeout(()=>{
		// browser resized or normal
		_self._createChart_default();
		_self._createChart_d3();
		if (drawType == 'all') {
			_self._createGrid();
		}
		warningDialog2();
	}, 10)
	
}
BasicStatisticsDialogUI.prototype._dataConvert = function(type, datas) {
	var returnArray = [];
	if (type == 'int') {
		datas.forEach( (d) => {
			returnArray.push(d*1)
		});
	} 
	return returnArray;
}
BasicStatisticsDialogUI.prototype._createChart_default = function() {
	var dialogChart = this._elmts.basic_statistics_chart.empty();
	
	var template = '';
	template += '<table>';
	template += '<caption>'+'*' + $.i18n('core-index-dialog/noty-detail-chart')+'</caption>';
	template += '<tr>';
	
	template += '<th>';
	template += '</th>';
	
	var divId = '';
	this.statData.columnInfo.forEach( (c,i)=> {
		divId = 'chart_template_'+i;
		template += '<td>';
		template += '<div id="'+divId+'" class="statistic_chart_warp">';
		template += '<div id="tooltip_'+divId+'" class="chart_tooltip">';
		template += '</div>';
		template += '<canvas id="canvas_'+divId+'">';
		template += '</canvas>';
		template += '</div>';
		template += '</td>';
	})
	
	template += '</tr>';
	template += '</table>';
	dialogChart.append(template);
}

BasicStatisticsDialogUI.prototype._getD3ChartSeries = function(i) {
	const data = this.statData.datas[i];
	const keys = Object.keys(data);
	const values = Object.values(data);
	
	var newData = []
	keys.forEach( (_k, i)=> {
		newData.push({
			key : _k,
			value : values[i]
		})
	})
	return {
		data : newData,
		xAxis : keys
	};
}

// d3.js
BasicStatisticsDialogUI.prototype._createChart_d3 = function() {
	const td = $('#chart_template_'+0)
	const width = td.width();
	const height = td.height();
	const margin = {top: 10, right: 10, bottom: 10, left: 40}
	
	var parentId = '';
	for (var i = 0, size = this.statData.columnInfo.length; i < size; i++) {
		parentId = 'chart_template_' +i;
		this._drawSvg(i, parentId, {
			width: width, 
			height: height, 
			margin: margin,
			clipPathId: "clip_path_" + i,
			isDetail : false
		});
		
		// chart 를 Image로 변경하여 보여준다. (화면 부하방지)
		convertToImg(parentId);

		// chart click시, detail popup을 표시하는 이벤트 설정.
		this._setChartEvent(i);
	};
}

BasicStatisticsDialogUI.prototype.aXisxWrap = function(text, width) {
	text.each(function() {
		var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.1, // ems
		y = text.attr("y"),
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
		
		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			}
		}
	});
}

BasicStatisticsDialogUI.prototype._drawSvg = function(i, parentId, {width, height, margin, clipPathId, tooltipId, isDetail}) {
	const UNIQUE_MAX_WIDTH = 55;
	var maxBandWidth = 0;
	var bandwidth = 0;
	var scaleMaxExtent = 0;
	
	const color = d3.scaleOrdinal(d3.schemeCategory10);
	
	const series = this._getD3ChartSeries(i);
	const data = series.data;
	const ordinals = series.xAxis;
	
    radius = (Math.min(width, height) / 2) - 10,
    node = null;
	
	const svg = d3.select('#'+parentId)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('xmlns', "http://www.w3.org/2000/svg")
      .style("display", "block")
      .style('width', width)
      .style('height', height)
      .style('pointer-events', (isDetail ? 'all': 'none'));
      
	// the scale
	let x = d3.scaleLinear().range([margin.left, width - margin.right]);
	let y = d3.scaleLinear().range([height - margin.bottom, margin.top]);
	let xScale = x.domain([-1, ordinals.length]);
	let yScale = y.domain([0, d3.max(data, function(d){return d.value})]);
	// for the width of rect
	let xBand = d3.scaleBand().domain(d3.range(-1, ordinals.length)).range([0, width]).padding(0.3);

	if (isDetail) {
		// zoomable rect
		svg.append('rect')
		.attr('class', 'zoom-panel')
		.attr('width', width - margin.left - margin.right)
		.attr('height', height - margin.top - margin.bottom)
		.attr('x', margin.left)
		.attr('y', margin.top);
	}

	// x axis
	let xAxis = svg.append('g')
	.attr('class', 'xAxis')
	.attr('transform', `translate(0, ${height - margin.bottom})`)
	.call(d3.axisBottom(xScale)
		.tickFormat((d, e) => {
			return ordinals[d]
		})
	);
	
	if (!isDetail) {
		xAxis.call(g => g.selectAll('line').remove())
		.selectAll('text').style('display', 'none');
	}

	// y axis
	let yAxis = svg.append('g')
	.attr("transform", `translate(${margin.left},0)`)
	.attr('class', 'y axis')
	.call(d3.axisLeft(yScale))
	.call(g => g.selectAll(".tick line").clone()
        .attr("x2", width)
        .attr("stroke-opacity", 0.05));

	/**
	 * chart bar의 width 계산 및 zoom sacle max 값 계산
	 * 각 차트 width의 1/5 값을 width의 최대길이로 가정하고, 그 길이를 기준으로 비율을 계산한다.  
	 */
	// chart width 길이 구함 (clipPath의 rect node의 길이가 차트 영역이다.
	chartViewWidth = width -margin.left-margin.right;
	
	// max 길이에서 1/5로 한 길이가 chart bar의 최대길이가 된다. 
	maxBandWidth = chartViewWidth/5;
	maxBandWidth = (maxBandWidth > UNIQUE_MAX_WIDTH) ? UNIQUE_MAX_WIDTH : maxBandWidth;
	
	// 기본 bandWidth는 /2로 설정한다.
	bandwidth =  xBand.bandwidth()*0.9;
	// 만약 bandwidth의 길이가 설정가능한 최대 width를 넘어갈 경우, 최대 width로 설정한다.
	bandwidth = (bandwidth > maxBandWidth) ? maxBandWidth : bandwidth;
	
	// 그 비율만큼 zoom 가능하다.
	scaleMaxExtent = maxBandWidth / bandwidth;
	scaleMaxExtent = (scaleMaxExtent < 0) ? 1 : Math.round(scaleMaxExtent);
	
	let bars = svg.append('g')
	.attr('clip-path','url(#'+clipPathId+')')
	.selectAll('.bar')
		.data(data)
		.enter()
	.append('rect')
	.attr('class', 'bar fill-default')
	.attr('fill', '#688eff')
	.attr('x', function(d, i){
		return xScale(i) - bandwidth/2
	})
	.attr('y', function(d, i){
		return yScale(d.value)
	})
	.attr('width', bandwidth)
	.attr('height', function(d){
		return height - yScale(d.value) - margin.bottom
	})
	.attr('data-x', d => d.key)
	.attr('data-y', d => d.value);

	if (isDetail) {
		let defs = svg.append('defs');
		// use clipPath
		defs.append('clipPath')
		.attr('id', clipPathId)
		.append('rect')
		.attr('width', width - margin.left - margin.right)
		.attr('height', height - margin.top - margin.bottom)
		.attr('x', margin.left)
		.attr('y', margin.top);
	}
	
	if (isDetail){
		let hideTicksWithoutLabel = function() {
			d3.selectAll('.xAxis .tick text').each(function(d){
				if(this.innerHTML === '') {
					this.parentNode.style.display = 'none'
				}
			})
		};
		
		function zoom() {
			if (d3.event.transform.k < 1) {
				d3.event.transform.k = 1
				return
			}
			xAxis.call(
				d3.axisBottom(d3.event.transform.rescaleX(xScale)).tickFormat((d, e, target) => {
					// has bug when the scale is too big
					if (Math.floor(d) === d3.format(".1f")(d)) return ordinals[Math.floor(d)]
					return ordinals[d]
				})
			);
			hideTicksWithoutLabel();
			
			// the bars transform
			bars.attr("transform", "translate(" + d3.event.transform.x+",0)scale(" + d3.event.transform.k + ",1)")
		}
		
		svg.call(d3.zoom()
				.scaleExtent([1, scaleMaxExtent]) 
				.translateExtent([[0,0], [width, height]])
				.extent([[0, 0], [width, height]])
				.on('zoom', zoom)
		)
	}
}
function getBandWidth() {
	/**
	 * chart bar의 width 계산 및 zoom sacle max 값 계산
	 * 각 차트 width의 1/5 값을 width의 최대길이로 가정하고, 그 길이를 기준으로 비율을 계산한다.  
	 */
	// chart width 길이 구함 (clipPath의 rect node의 길이가 차트 영역이다.
	chartViewWidth = $('#'+parentId).find('svg').find('clipPath').find('rect').width();
	
	// max 길이에서 1/5로 한 길이가 chart bar의 최대길이가 된다. 
	maxBandWidth = chartViewWidth/5;
	maxBandWidth = (maxBandWidth > UNIQUE_MAX_WIDTH) ? UNIQUE_MAX_WIDTH : maxBandWidth;
	
	// 기본 bandWidth는 /2로 설정한다.
	bandwidth =  xBand.bandwidth();
	// 만약 bandwidth의 길이가 설정가능한 최대 width를 넘어갈 경우, 최대 width로 설정한다.
	bandwidth = (bandwidth > maxBandWidth) ? maxBandWidth : bandwidth;
	
	// 그 비율만큼 zoom 가능하다.
	scaleMaxExtent = maxBandWidth / bandwidth;
	scaleMaxExtent = (scaleMaxExtent < 0) ? 1 : Math.round(scaleMaxExtent);
}

// tooltip 생성 : 상세보기화면에서만 지원한다.
function setTooltip(parentId, tooltipId, height, margin) {
	var target = null; 
	var tooltip = null;
	var tQuery = null;
	var positionLeft = null;
	var positionTop = null;
	var tQueryTemplate = '';
	
	const rectEl = document.getElementById(parentId).querySelectorAll('rect.bar');
	console.log(rectEl)
	for(const el of rectEl) {
		// event reset
		el.removeEventListener('mouseover', ()=>{})
		el.addEventListener('mouseover', (event) => {
			target = event.target;
			target.classList.add('fill-selected')
			
			tooltip = $('#'+tooltipId)[0]; 
			
			tQuery = $(tooltip);
			tQuery.css('visibility', 'visible')
			
			tQuery.empty();
			tQueryTemplate = '';
			tQueryTemplate += '<div class="tooltip_text">';
			tQueryTemplate += '<p>key : ' + target.dataset.x + '</p>';
			tQueryTemplate += '<p>count : ' + target.dataset.y + '</p>';
			tQueryTemplate += '</div>';
			tQuery.append(tQueryTemplate)
			
			
			positionTop = height - margin.top - target.getAttribute('height') - tooltip.clientHeight + 20;
			positionLeft = $(target).position().left - tQuery.width()/2 + Number(target.getAttribute('width'))/2
			
			tooltip.style.top = positionTop + 'px';
			tooltip.style.left = positionLeft + 'px';
			tooltip.style.opacity = 1;
		});
		el.addEventListener('mouseout', (event) => {
			event.target.classList.remove('fill-selected')
			$(event.target.parentElement.parentElement.previousElementSibling).css('visibility', 'hidden')
		});
	}
}

// svg를 이미지로 변경
// 상세보기 화면이 아닌경우, 부하저하를 위해 svg를 Image로 변경후 svg를 삭제한다.
function convertToImg(parentId) {
	let clonedSvgElement = $('#'+parentId+' svg')[0].cloneNode(true);

	const svgStyle = clonedSvgElement.style;
	let _width = Number(svgStyle.width.replace('px', ''))
	let _height = Number(svgStyle.height.replace('px', ''))
	
	let outerHTML = clonedSvgElement.outerHTML,
	blob = new Blob([outerHTML],{type:'image/svg+xml'});
	let _URL = window.webkitURL || window.URL || window;
	
	if (typeof _URL.createObjectURL === 'undefined') { 
		function noOp () { }
		Object.defineProperty(window.URL, 'createObjectURL', { value: noOp})
	}
	
	let canvas = $('#'+parentId+' canvas')[0];
	canvas.width = _width;
	canvas.height = _height;
	let context = canvas.getContext('2d');
	
	let image = new Image();
	image.onload = function() {
		context.drawImage(image, 0, 0, _width, _height );
	};
	image.src = _URL.createObjectURL(blob);

	$('#'+parentId+' svg').remove();
}

BasicStatisticsDialogUI.prototype._setChartEvent = function(i) {
	$('#chart_template_'+i).off('click', ()=>{});
	$('#chart_template_'+i).on('click', {_self:this}, function(e) {
		const _self = e.data._self;
		_self._showDetailPopup(i);
	})
}
BasicStatisticsDialogUI.prototype._showDetailPopup = function(i) {
	
	const frame = $(DOM.loadHTML("core", "scripts/dialogs/basic-statistics-dialog-detail.html"));
	this._detailElmts = DOM.bind(frame);
	this._detailLevel = DialogSystem.showDialog(frame);
	
	const self = this;
	
	const columnName = self.statData.columnInfo[i].name;
	
	// btn setting
	this._detailElmts.closeButton.html($.i18n('core-buttons/close'));
	this._detailElmts.closeButton.click(function() {
		DialogSystem.dismissUntil(self._detailLevel - 1);
	});
	
	var title = $('<h5>').text('[' + columnName + '] ' + $.i18n('core-index-dialog/title-detail'));
	$('#graph-title-detail').append(title);
	
	// copy chart
	const width = 970;
	const height = 300;
	const margin = {top: 25, right: 10, bottom: 50, left: 40}
	
	const warningDialog1 = DialogSystem.showBusy($.i18n('core-index-dialog/loading-step2'));
	setTimeout(()=>{
		const parentId = 'basic-statistics-chart-Detail';
		self._drawSvg(i, parentId, {
			width: width, 
			height: height,
			margin: margin,
			clipPathId: "detail_clip_path_" + i,
			isDetail : true
		})
		setTooltip(parentId, 'detail_tooltip', height, margin);
		
		warningDialog1();
	}, 10)
}

BasicStatisticsDialogUI.prototype._createGrid = function() {
	// reset grid panel 
	var dialogChart = this._elmts.basic_statistics_grid.empty();
	
	// template 생성
	var template = '';
	template += '<table>';
	
	const column = this.statData.columnInfo;
	const rowNames = this.statData.rowNames;
	
	Object.keys(rowNames).forEach((k, rI)=>{
		template += '<tr>';
		
		template += '<th>';
		template += '<span>'+ rowNames[k] +'</span>';
		template += '</th>';
		
		for ( var i = 0; i < column.length; i++) {
			const c = column[i];
			
			template += '<td>';
			
			var val = c[k];
			if (val == undefined || val == ''){
				val = 0;
			}
			
			template += '<span>'+val+'</span>';
			template += '</td>';
		}
		template += '</tr>';
	})
	template += '</table>';
	dialogChart.append(template);	
}

// when close Dialog 
BasicStatisticsDialogUI.prototype._dismiss = function() {
	this.statData = {}; 
	_BasicStatisticsDialogUI = null;
	
	DialogSystem.dismissUntil(this._level - 1);
};
