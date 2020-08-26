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
					_self.statData = data;
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
		_self._createChart_default(_self.statData.columnInfo);
		_self._createChart_d3(_self.statData.columnInfo, _self.statData.frequencyList);
		if (drawType == 'all') {
			_self._createGrid(_self.statData.columnInfo, _self.statData.rowNames);
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
BasicStatisticsDialogUI.prototype._createChart_default = function(columnInfo) {
	const dialog = $('.dialog-body');
	const minTdWidth = 120;
	const _cnt = columnInfo.length;
	
	const bodyWidth = dialog.width();
	if (bodyWidth < (_cnt * minTdWidth)) {
		dialog.css('overflow-x', 'scroll');
	}
	
	var dialogChart = this._elmts.basic_statistics_chart.empty();
	
	var template = '';
	template += '<table>';
	template += '<tr>';
	
	template += '<th>';
	template += '</th>';
	
	var divId = '';
	columnInfo.forEach( (c,i)=> {
		divId = 'chart_template_'+i;
		template += '<td>';
		template += '<div id="'+divId+'" class="statistic_chart_warp">';
		template += '<div id="tooltip_'+divId+'" class="chart_tooltip">';
		template += '</div>';
		template += '</div>';
		template += '</td>';
	})
	
	template += '</tr>';
	template += '</table>';
	dialogChart.append(template);
}

BasicStatisticsDialogUI.prototype._getD3ChartSeries = function(i) {
	var data = this._datas[i];
	const keys = Object.keys(data);
	const values = Object.values(data);
	
	var newData = []
	
	keys.forEach( (_k, i)=> {
		newData.push({
			key : _k,
			value : values[i]
		})
	})
	return newData;
}

// d3.js
BasicStatisticsDialogUI.prototype._createChart_d3 = function(columnInfo, datas) {
	const td = $('#chart_template_'+0)
	const width = td.width();
	const height = td.height();
	
	this._datas = datas;
	
	for (var i = 0, size = columnInfo.length; i < size; i++) {	
		this._drawSvg(i, ('chart_template_' +i), {
			width: width, 
			height: height, 
			clipPathId: "clip_path_" + i,
			tooltipId : 'tooltip_chart_template_' + i,
			isDetail : false
		});

		// chart click시, detail popup을 표시하는 이벤트 설정.
		this._setChartEvent(i);
	};
}
BasicStatisticsDialogUI.prototype._drawSvg = function(i, parentId, {width, height, clipPathId, tooltipId, isDetail}) {
	const UNIQUE_MAX_WIDTH = 55;
	const margin = {top: 10, right: 10, bottom: 10, left: 40}
	const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];
	
//	const isXAxisShow = isDetail ? 'initial' : 'none';
//	margin.bottom += isDetail ? 50 : 0; 
	const isXAxisShow = 'none'
	
	const fillColor = 'royalblue';
	// chart 최대 width 길이
	
	var maxBandWidth = 0;
	var bandwidth = 0;
	var scaleMaxExtent = 0;
	
	var data = null; 

	var rectEl = null;
	var target = null; 
	var tooltip = null;
	var tQuery = null;
	var positionLeft = null;
	var positionTop = null;
	var tQueryTemplate = '';
	
	const svg = d3.select('#'+parentId)
	.append('svg')
	.style('width', width)
	.style('height', height);

	data = this._getD3ChartSeries(i);
	
	const x = d3.scaleBand()
		.domain(data.map(d => d.key))
		.range([margin.left, width - margin.right])
		.padding(0.3);
	 
	const y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.value)]).nice()
		.range([height - margin.bottom, margin.top]);

	const xAxis = g => g
		.attr('transform', `translate(0, ${height - margin.bottom})`)
		.call(d3.axisBottom(x).tickSizeOuter(0))
		.call(g => g.select('.domain').remove())
		.call(g => g.selectAll('line').remove())
		.selectAll('text')
		.style('display', isXAxisShow)
//		.style('transform', 'rotate(-90deg)')
//		.orient("bottom");
	 
	// line chart와 동일
	const yAxis = g => g
		.attr('transform', `translate(${margin.left}, 0)`)
		.call(d3.axisLeft(y))
		.call(g => g.select('.domain').remove())
		.call(g => g.selectAll('line')
				.attr('x2', width)
				.style('stroke', '#f5f5f5'))
	
	svg.append('g').call(xAxis);
	svg.append('g').call(yAxis);

	// zoom 할때, 영역 잡아줌
	svg.append("clipPath")
      .attr("id", clipPathId)
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom);
	
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
	bandwidth =  x.bandwidth();
	// 만약 bandwidth의 길이가 설정가능한 최대 width를 넘어갈 경우, 최대 width로 설정한다.
	bandwidth = (bandwidth > maxBandWidth) ? maxBandWidth : bandwidth;
	
	// 그 비율만큼 zoom 가능하다.
	scaleMaxExtent = maxBandWidth / bandwidth;
	scaleMaxExtent = (scaleMaxExtent < 0) ? 1 : Math.round(scaleMaxExtent);
	
	// zoom 설정
	function zoomed() {
		x.range([margin.left, width - margin.right].map(d => d3.event.transform.applyX(d)));
		svg.selectAll(".bars rect").attr("x", d => (x.bandwidth() /2.4)+x(d.key))
		.attr("width", bandwidth * d3.event.transform.k);
		svg.selectAll(".x-axis").call(xAxis);
	}
	svg.call(d3.zoom()
			.scaleExtent([1, scaleMaxExtent]) 
			.translateExtent(extent)
			.extent(extent)
			.on("zoom", zoomed))
			.on("dblclick.zoom", () => {})
			.on("click.zoom", () => {});
	
	svg.append('g')
      	.attr("class", "bars")
		.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr("clip-path","url(#"+clipPathId+")")
		.attr('x', d => (x.bandwidth()/2.4)+x(d.key))
		.attr('y', d => y(d.value))
		.attr('height', d => y(0) - y(d.value))
		.attr('width', bandwidth)
		.attr('fill', fillColor)
		.attr('data-x', d => d.key)
		.attr('data-y', d => d.value);
	
	// tooltip
	rectEl = document.getElementById(parentId).getElementsByTagName('rect');
	for(const el of rectEl) {
		// event reset
		el.removeEventListener('mouseover', ()=>{})
		el.addEventListener('mouseover', (event) => {
			target = event.target;
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
			
			positionTop = height - margin.top - target.getAttribute('height') - tooltip.clientHeight;
			if (isDetail) {
				positionLeft = $(target).position().left - tQuery.width()/2 + Number(target.getAttribute('width'))/2
				positionTop += 60
			} else {
				positionLeft = Number(target.getAttribute('x')) - tQuery.width()/2 + Number(target.getAttribute('width'))/2
			}
			tooltip.style.top = positionTop + 'px';
			tooltip.style.left = positionLeft + 'px';
			tooltip.style.opacity = 1;
		});
		el.addEventListener('mouseout', (event) => {
			$(event.target.parentElement.parentElement.previousElementSibling).css('visibility', 'hidden')
		});
	}
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
	this._detailLevel = DialogSystem.showDialog(frame, null, 'statistic_dialog_detail_container');
	
	const self = this;
	// btn setting
	this._detailElmts.closeButton.html($.i18n('core-buttons/close'));
	this._detailElmts.closeButton.click(function() {
		DialogSystem.dismissUntil(self._detailLevel - 1);
	});
	
	var title = $('<h5>').text($.i18n('core-index-dialog/title-detail'));
	$('#graph-title-detail').append(title);
	
	// copy chart
	const width = 800;
	const height = 300;
	
	this._drawSvg(i, 'basic-statistics-chart-Detail', {
		width: width, 
		height: height, 
		clipPathId: "detail_clip_path_" + i,
		tooltipId: 'detail_tooltip',
		isDetail : true
	})
}

BasicStatisticsDialogUI.prototype._createGrid = function(column, rowNames) {
	// reset grid panel 
	var dialogChart = this._elmts.basic_statistics_grid.empty();
	
	// template 생성
	var template = '';
	template += '<table>';
	
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
	this._datas = [];
	_BasicStatisticsDialogUI = null;
	
	DialogSystem.dismissUntil(this._level - 1);
};
