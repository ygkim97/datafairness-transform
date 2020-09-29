Date.prototype.format = function (f) {
    if (!this.valueOf()) return " ";
    var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
    var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var d = this;
    return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear(); // 년 (4자리)
            case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
            case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)
            case "dd": return d.getDate().zf(2); // 일 (2자리)
            case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
            case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
            case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
            case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
            case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
            case "mm": return d.getMinutes().zf(2); // 분 (2자리)
            case "ss": return d.getSeconds().zf(2); // 초 (2자리)
            case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
            default: return $1;
        }
    });
};
String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };


// for window resize event.
var _QEDialogUI = null;
var QE_SELECTED_HEADER = {
		NAMES : null,
		INDEXES : null
};

const CHART_DIV_ID = 'qe_chart'

function QEDialogUI(selectedHeaderNames, headerOriginalIndexes) {

	_QEDialogUI = this;
	QE_SELECTED_HEADER.NAMES = selectedHeaderNames;
	QE_SELECTED_HEADER.INDEXES = headerOriginalIndexes;
	
	this._createDialog();
} 

QEDialogUI.prototype._getStatisticData = function(chartType) {
	const warningDialog1 = DialogSystem.showBusy();
	
	var response = null;
	
	$.ajax({
		type : 'POST',
		url : "command/core/get-quantitative-evaluation?" + $.param({ project: UI_CHART_INFO.selectedPId}),
		data : {
			headers : QE_SELECTED_HEADER.INDEXES.join(','),
			chartType : chartType
		},
		async : false,
		success : function(data) {
			warningDialog1();
			response = data.data;
		}
	})
	return response;
}

QEDialogUI.prototype._createDialog = function() {
	var self = this;
	this.statData = {};
	
	var frame = $(DOM.loadHTML("core", "scripts/dialogs/quantitative-evaluation-dialog.html"));
	this._elmts = DOM.bind(frame);

	this._level = DialogSystem.showDialog(frame);
	
	// btn setting
	this._elmts.closeButton.html($.i18n('core-buttons/close'));
	this._elmts.closeButton.click(function() {
		self._dismiss();
		Refine.OpenProjectUI.prototype._addTagFilter()
	});
	
	$(window).resize((target) => {
		if (_QEDialogUI != null) {
//			_QEDialogUI._createChart(false);
		}
	})

	// title setting
	var title = $('<h5>').text($.i18n('core-index-dialog-qe/title'));
	$('#graph-title').append(title);
	
	// draw qe dialog
	this._createChartTemplate();
	
	// setting view btn 
	const _self = this;
	$('.qe-chart-button').click(function(e) {
		_self._showDetailPopup(e.target.dataset.i);
	});
}

QEDialogUI.prototype._createChartTemplate = function() {
	var chartWrap = this._elmts.qe_statistics_chart_wrap.empty()
	
	this.chartInfos = [{
		id : 'CS',
		text : 'CORRELATED <br>SCATTERPLOTS', 
		type : 'DOT'
	},{
		id : 'SH',
		text : 'SKEWED HISTOGRAMS', 
		type : 'BAR'
	},{
		id : 'GH',
		text : 'GAPS HISTOGRAMS', 
		type : 'BAR'
	},{
		id : 'BIP',
		text : 'BIPLOTS', 
		type : 'DOT'
	},{
		id : 'OUT',
		text : 'OUTLIERS', 
		type : 'BAR'
	},{
		id : 'CG',
		text : 'CORRELATION GRAPH', 
		type : 'DOT'
	}, {
		id : 'PCP',
		text : 'PARALLEL <br>COORDINATES PLOT', 
		type : 'LINE'
	}, {
		id : 'RP',
		text : 'RADAR PLOT', 
		type : 'RADAR'
	}, {
		id : 'DH',
		text : 'DATA HEATMAP',
		type : 'DATAHEATMAP'
	}];
	
	var template = '';
	template += '<table>';

	var chartCnt = this.chartInfos.length;
	var lineMaxCnt = 5
	var trI = parseInt(chartCnt/lineMaxCnt);	// 5개씩 한줄
	trI += chartCnt%5 == 0 ? 0 : 1;
	var divId = '';
	
	// line
	var _tempChartCnt = chartCnt;
	if (chartCnt%5 == 0) {
		_tempChartCnt--;
	}
	var _len = (parseInt(_tempChartCnt/5)+1) * lineMaxCnt;
	
	var trTemplate1 = '';
	var trTemplate2 = '';
	var trTemplate3 = '';
	var template = '<table>';
	
	for (var i = 0; i < _len; i++) {
		ci = this.chartInfos[i];
	
		// row의 첫번째 th(td)
		if (i%lineMaxCnt == 0) {
			trTemplate1 = '<tr>';
			trTemplate2 = '<tr>';
			trTemplate3 = '<tr>';
		}

		if (ci == undefined) {
			trTemplate1 += '<th class="qe-border-none">';
			trTemplate1 += '</th>';
			
			trTemplate2 += '<td class="qe-border-none">';
			trTemplate2 += '</td>';
			
			trTemplate3 += '<td class="qe-border-none">';
			trTemplate3 += '</td>';
		} else {
			trTemplate1 += '<th>';
			trTemplate1 += ci.text;
			trTemplate1 += '</th>';
			
			trTemplate2 += '<td>';
			trTemplate2 += '<div class="qe-chart chart-type-'+ci.type.toLowerCase()+'" id="'+CHART_DIV_ID+'_'+i+'">';
			trTemplate2 += '</div>';
			trTemplate2 += '<div class="qe-chart-sample">';
			trTemplate2 += '<span>SAMPLE</span>';
			trTemplate2 += '</div>';
			
			trTemplate2 += '</div>';
			trTemplate2 += '</td>';
			
			trTemplate3 += '<td>';
			trTemplate3 += '<div class="qe-chart-wrap">';
			trTemplate3 += '<button class="qe-chart-button" data-i="'+i+'">' + '보기';
			trTemplate3 += '</div>';
			trTemplate3 += '</td>';
		}
		
		// row의 마지막 th(td)
		if ((i%lineMaxCnt == lineMaxCnt-1) || i == _len) {
			trTemplate1 += '</tr>';
			trTemplate2 += '</tr>';
			trTemplate3 += '</tr>';
			
			template += trTemplate1;
			template += trTemplate2;
			template += trTemplate3;
		}
	}
	template += '</table>';
	
	chartWrap.append(template)
}

/**
 *  DETAIL DIALOG
 */
QEDialogUI.prototype._showDetailPopup = function(i) {
	const frame = $(DOM.loadHTML("core", "scripts/dialogs/quantitative-evaluation-dialog-detail.html"));
	this._detailElmts = DOM.bind(frame);
	this._detailLevel = DialogSystem.showDialog(frame);
	
	const self = this;
	
	// get chart data. use selected header list and chart ID.
	// ** chart Id already defined.
	const chartInfo = this.chartInfos[i];
	const chartData = this._getStatisticData(chartInfo.type);
	
	// btn setting
	this._detailElmts.closeButton.html($.i18n('core-buttons/close'));
	this._detailElmts.closeButton.click(function() {
		DialogSystem.dismissUntil(self._detailLevel - 1);
	});

	var title = $('<h5>').text('[' + chartInfo.text + '] ' + $.i18n('core-index-dialog/title-detail'));
	$('#graph-title-detail').append(title);

	this._createDetailChartTemplate();
	this._createDetailChart(i, chartInfo, chartData);
}
QEDialogUI.prototype._createDetailChartTemplate = function() {
	var chartWrap = this._detailElmts.qeDetailChartwrap.empty();
	
	var template1 = '';
	var divId = 'qe_detail_chart_';

	const selectedHeaderLen = QE_SELECTED_HEADER.NAMES.length;
	// detail card
	QE_SELECTED_HEADER.NAMES.forEach(function(h, i) {
		const pageCnt = i+1;
		const prevPageCnt = pageCnt == 1 ? selectedHeaderLen : pageCnt-1;
		const nextPageCnt = pageCnt == selectedHeaderLen ? 1 : pageCnt+1;
		const isChecked = pageCnt == 1 ? 'checked' : '';
		
		template1 += '<input id="rad'+pageCnt+'" type="radio" name="rad" '+isChecked+'>';
		template1 += '<section>';
		template1 += '<h1>'+h+'</h1>';
		template1 += '<div class="qe-chart" id="'+divId+pageCnt+'" data-i='+pageCnt+' data-headerIndex='+QE_SELECTED_HEADER.INDEXES[i]+'>';
		template1 += '<div id="qe_detail_tooltip_'+i+'" class="chart_tooltip"></div>';
		template1 += '</div>';
		template1 += '<label class="qe-btn-label" for="rad'+prevPageCnt+'"><i class="fa fa-chevron-left"></i></label>';
		template1 += '<label class="qe-btn-label" for="rad'+nextPageCnt+'"><i class="fa fa-chevron-right"></i></label>';
		template1 += '</section>';
	})	
	chartWrap.append(template1);
}
QEDialogUI.prototype._createDetailChart = function(i, chartInfo, _chartData) {
	const margin = {top: 20, right: 30, bottom: 50, left: 50}
	
	// get parent element's width
	const width = $('#qe_dialog_detail .qe-chart').width();
	const height = 440;
	
	const chartData = _chartData;
	const _self = this;

	const warningDialog1 = DialogSystem.showBusy($.i18n('core-index-dialog/loading-step2'));
	setTimeout(()=>{
		// create chart
		$('#qe_dialog_detail .qe-chart').each((j, e)=>{
			const chartWrap = $(e);
			_self.createChartByType(chartInfo.type, {
				i: j,
				pId: chartWrap.attr('id'), 
				width: width, 
				height: height, 
				data: chartData[j],
				margin: margin
			});
		})
		warningDialog1();
	}, 10) 
}

QEDialogUI.prototype.createChartByType = function(type, params) {
	const tooltip = $('#qe_detail_tooltip_'+params.i);
	
	switch(type) {
		case 'BAR':
			tooltip.addClass('bar');
			createChart_bar(params)
			break;
		case 'LINE':
			tooltip.addClass('line');
			createChart_line(params)
			break;
		case 'DOT':
			tooltip.addClass('dot');
			createChart_dot(params)
			break;
		case 'DATAHEATMAP':
			tooltip.addClass('heatmap');
			createChart_heatmap(params)
			break;
		case 'RADAR':
			tooltip.addClass('radar');
			createChart_radar(params)
			break;
	}
}

function createChart_bar(params) {
	const i = params.i;
	const pId = params.pId;
	const width = params.width;
	const height = params.height;
	const margin = params.margin;
	const data = params.data;
	
	var svg = d3.select('#'+pId)
	.append('svg')
	.attr('id', pId+'_'+i+'_svg')
	.attr('viewBox', [0, 0, width, height])
	.attr('width', width)
	.attr('height', height)
	.style('width', width)
	.style('height', height)
	.style("display", "block")
	.style('pointer-events', 'all')
	
	const x = d3.scaleBand()
	.domain(d3.range(data.length))
	.range([margin.left, width - margin.right])
	.padding(0.1)
	
	const y = d3.scaleLinear()
	.domain([0, d3.max(data, d => d.value)]).nice()
	.range([height - margin.bottom, margin.top])
  
	const xAxis = g => g
	.attr("transform", `translate(0,${height - margin.bottom})`)
	.call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0))
  
	const yAxis = g => g
	.attr("transform", `translate(${margin.left},0)`)
	.call(d3.axisLeft(y).ticks(null, data.format))
	.call(g => g.select(".domain").remove())
	.call(g => g.append("text")
		.attr("x", -margin.left)
		.attr("y", 10)
		.attr("fill", "currentColor")
		.attr("text-anchor", "start")
		.text(data.y))
		
	var tooltip = $('#qe_detail_tooltip_'+i+'.bar');
	
	svg.append("g")
	.attr("class", "bars")
	.selectAll("rect")
		.data(data)
		.enter()
	.append("rect")
	.attr('class', 'fill-default')
	.attr("x", (d, i) => x(i))
	.attr("y", d => y(d.value))
	.attr("height", d => y(0) - y(d.value))
	.attr("width", x.bandwidth())
	.attr('data-x', d => d.name)
	.attr('data-y', d => d.value)
	.on('mouseover', function (d){
		const rect = $(this);
		rect[0].classList.add('fill-selected')
		
		newX = rect.offset().left - (tooltip.width()/2);
		newY = rect.offset().top - tooltip.height() - 10;
		
		var tooltipTemplate = '';
		tooltipTemplate += '<div>';
		tooltipTemplate += '<div class="tooltip_text">';
		tooltipTemplate += '<p>name: ' + d.name+ '</p>';
		tooltipTemplate += '<p>value: ' + d.value+ '</p>';
		tooltipTemplate += '</div>';
		
		tooltip
		.offset({top:newY, left:newX})
		.css('visibility', 'visible')
		.html(tooltipTemplate)
		.animate({'opacity': 1}, 200);
	})
	.on('mouseout', function(){
		$(this)[0].classList.remove('fill-selected')
		
		tooltip
		.css('visibility', 'hidden')
		.animate({'opacity' : 0}, 200);
	});

	svg.append("g").call(xAxis);
	svg.append("g").call(yAxis);
}
function createChart_line(params) {
	const i = params.i;
	const pId = params.pId;
	const width = params.width;
	const height = params.height;
	const margin = params.margin;
	
	var data = [];
	params.data.forEach((e)=>{
		data.push({date:new Date(e.date), value:e.value})
	})
	
	var svg = d3.select('#'+pId)
	.append('svg')
	.attr('id', pId+'_'+i+'_svg')
	.attr('viewBox', [0, 0, width, height])
	.style('width', width)
	.style('height', height)
	.style('pointer-events', 'all')
	
	const line = d3.line()
	.defined(d => !isNaN(d.value))
	.x(d => x(d.date))
	.y(d => y(d.value))
  
	const x = d3.scaleUtc()
	.domain(d3.extent(data, d => d.date))
	.range([margin.left, width - margin.right])
  
	const y = d3.scaleLinear()
	.domain([0, d3.max(data, d => d.value)]).nice()
	.range([height - margin.bottom, margin.top])
	
	const keys = d3.keys(data[0]);
	
	const xAxis = g => g
	.attr("transform", `translate(0,${height - margin.bottom})`)
	.call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
  
	const yAxis = g => g
	.attr("transform", `translate(${margin.left},0)`)
	.call(d3.axisLeft(y))
	.call(g => g.select(".domain").remove())
	.call(g => g.select(".tick:last-of-type text").clone()
			.attr("x", 3)
			.attr("text-anchor", "start")
			.attr("font-weight", "bold")
			.text(data.y))
	
	svg.append("g").call(xAxis);
	svg.append("g").call(yAxis);

	var tooltip = $('#qe_detail_tooltip_'+i+'.line');
	
	const lineG = svg.append("path")
	.datum(data)
	.attr("fill", "none")
	.attr("stroke", "steelblue")
	.attr("stroke-width", 1.5)
	.attr("stroke-linejoin", "round")
	.attr("stroke-linecap", "round")
	.attr("d", line);
	
	svg.append('g').selectAll("dot")
	.data(data)
	.enter().append("circle")
	.attr("fill", "rgb(255, 255, 255)")
	.attr("stroke-width", "2px")
	.attr("stroke", "rgb(24, 91, 165)")
	.attr("r", 3)
	.attr("cx", function(d) { return x(d.date); })
	.attr("cy", function(d) { return y(d.value);})
	.on('mouseover', function (d){
		const path = $(this);
		path[0].classList.add('fill-selected')
		
		newX = path.offset().left - (tooltip.width()/2);
		newY = path.offset().top - tooltip.height() - 10;
		
		var tooltipTemplate = '';
		tooltipTemplate += '<div>';
		tooltipTemplate += '<div class="tooltip_text">';
		tooltipTemplate += '<p>date: ' + new Date(d.date).format('yyyy-MM-dd') + '</p>';
		tooltipTemplate += '<p>value: ' + d.value+ '</p>';
		tooltipTemplate += '</div>';
		
		tooltip
		.offset({top:newY, left:newX})
		.css('visibility', 'visible')
		.html(tooltipTemplate)
		.animate({'opacity': 1}, 200);
	})
	.on('mouseout', function(){
		$(this)[0].classList.remove('fill-selected')
		
		tooltip
		.css('visibility', 'hidden')
		.animate({'opacity' : 0}, 200);
	});;

}
function createChart_dot(params) {
	const i = params.i;
	const pId = params.pId;
	const width = params.width;
	const height = params.height;
	const margin = params.margin;
	const data = params.data;
	
	var svg = d3.select('#'+pId)
	.append('svg')
	.attr('id', pId+'_'+i+'_svg')
	.attr('viewBox', [0, 0, width, height])
	.style('width', width)
	.style('height', height)
	.style('pointer-events', 'all');
	
	const x = d3.scaleLinear()
	.domain(d3.extent(data, d => d.x)).nice()
	.range([margin.left, width - margin.right]);
  
	const y = d3.scaleLinear()
	.domain(d3.extent(data, d => d.y)).nice()
	.range([height - margin.bottom, margin.top]);
	
  	const color = d3.scaleOrdinal(data.map(d => d.category), d3.schemeCategory10);
	const shape = d3.scaleOrdinal(data.map(d => d.category), d3.symbols.map(s => d3.symbol().type(s)()));
	
	const xAxis = g => g
	.attr("transform", `translate(0,${height - margin.bottom})`)
	.call(d3.axisBottom(x).ticks(width / 80))
	.call(g => g.select(".domain").remove())
	.call(g => g.append("text")
		.attr("x", width)
		.attr("y", margin.bottom - 4)
		.attr("fill", "currentColor")
		.attr("text-anchor", "end")
		.text(data.x));
  
	const yAxis = g => g
	.attr("transform", `translate(${margin.left},0)`)
	.call(d3.axisLeft(y))
	.call(g => g.select(".domain").remove())
	.call(g => g.append("text")
		.attr("x", -margin.left)
		.attr("y", 10)
		.attr("fill", "currentColor")
		.attr("text-anchor", "start")
		.text(data.y));

	var tooltip = $('#qe_detail_tooltip_'+i+'.dot');
	
	const grid = g => g
	.attr("stroke", "currentColor")
	.attr("stroke-opacity", 0.1)
	.call(g => g.append("g")
		.selectAll("line")
		.data(x.ticks())
		.join("line")
		.attr("x1", d => 0.5 + x(d))
		.attr("x2", d => 0.5 + x(d))
		.attr("y1", margin.top)
		.attr("y2", height - margin.bottom))
	.call(g => g.append("g")
		.selectAll("line")
		.data(y.ticks())
		.join("line")
		.attr("y1", d => 0.5 + y(d))
		.attr("y2", d => 0.5 + y(d))
		.attr("x1", margin.left)
		.attr("x2", width - margin.right));

	svg.append('g').call(xAxis);
	svg.append('g').call(yAxis);
	svg.append('g').call(grid);

	var tooltip = $('#qe_detail_tooltip_'+i+'.dot');
	
	svg.append("g")
		.attr("stroke-width", 1.5)
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
	.selectAll("path")
	.data(data)
	.join("path")
	.attr("transform", d => `translate(${x(d.x)},${y(d.y)})`)
	.attr("fill", d => color(d.category))
	.attr("d", d => shape(d.category))
	.on('mouseover', function (d){
		const path = $(this);
		newX = path.offset().left - (tooltip.width()/2);
		newY = path.offset().top - tooltip.height() - 10;
		
		var tooltipTemplate = '';
		tooltipTemplate += '<div>';
		tooltipTemplate += '<div class="tooltip_text">';
		tooltipTemplate += '<p>category: ' + d.category+ '</p>';
		tooltipTemplate += '<p>x: ' + d.x+ '</p>';
		tooltipTemplate += '<p>y: ' + d.y+ '</p>';
		tooltipTemplate += '</div>';
		
		tooltip
		.offset({top:newY, left:newX})
		.css('height', 50)
		.css('visibility', 'visible')
		.html(tooltipTemplate)
		.animate({'opacity': 1}, 200);
		
		z = "polygon."+d3.select(this).attr("class");
		svg.selectAll("polygon")
		.transition(200)
		.style("fill-opacity", 0.1); 
		svg.selectAll(z)
		.transition(200)
		.style("fill-opacity", .7);
	})
	.on('mouseout', function(){
		tooltip
		.css('visibility', 'hidden')
		.animate({'opacity' : 0}, 200);
		
		svg.selectAll("polygon")
		.transition(200)
		.style("fill-opacity", 0.5);
	});
}
function createChart_heatmap(params) {
	const i = params.i;
	const pId = params.pId;
	const width = params.width;
	const height = params.height;
	const margin = params.margin;
	const data = params.data;
	margin.top = 0;
	
	var svg = d3.select('#'+pId)
	.append('svg')
	.attr('id', pId+'_'+i+'_svg')
	.attr('viewBox', [0, 0, width, height])
	.attr('width', width)
	.attr('height', height)
	.style('width', width)
	.style('height', height)
	.style('pointer-events', 'all')
	.append("g")
	  .attr("transform",
		        "translate(" + margin.top + "," + 0 + ")");

	// Labels of row and columns
	var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
	var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

	// Build X scales and axis:
	var x = d3.scaleBand()
	.range([ 0, width-margin.left-margin.right])
	.domain(myGroups)
	.padding(0.01);
	svg.append("g")
	.attr("transform", `translate(${margin.left},${height - margin.bottom})`)
	.call(d3.axisBottom(x))

	// Build X scales and axis:
	var y = d3.scaleBand()
	.range([ height-margin.top-margin.bottom, margin.left ])
	.domain(myVars)
	.padding(0.01);
	svg.append("g")
	.attr("transform", `translate(${margin.left},0)`)
	.call(d3.axisLeft(y));

	// Build color scale
	var myColor = d3.scaleLinear()
	  .range(["white", "#185ba5"])
	  .domain([1,100]);
	 
	//Read the data
	svg.append('g')
	.selectAll()
	.data(data, function(d) {return d.group+':'+d.variable;})
	.enter()
	.append("rect")
		.attr('class', 'heatmap')
		.attr("x", function(d) { return margin.left+x(d.group) })
		.attr("y", function(d) { return y(d.variable) })
		.attr("width", x.bandwidth() )
		.attr("height", y.bandwidth() )
		.attr('data-variable', d => d.variable)
		.attr('data-value', d => d.value)
		.attr('data-group', d => d.group)
		.style("fill", function(d) { return myColor(d.value)} );
	
	// tooltip 설정
	const rectEl = document.getElementById(pId).querySelectorAll('rect.heatmap');
	for(const el of rectEl) {
		el.removeEventListener('mouseover', ()=>{})
		el.addEventListener('mouseover', (event) => {
			target = event.target;
			target.classList.add('fill-selected')
			
			tooltip = $('#qe_detail_tooltip_'+i+'.heatmap')[0]; 
			
			tQuery = $(tooltip);
			tQuery.css('visibility', 'visible')
			
			tQuery.empty();
			tQueryTemplate = '';
			tQueryTemplate += '<div class="tooltip_text">';
			tQueryTemplate += '<p>group: ' + target.dataset.group + '</p>';
			tQueryTemplate += '<p>variable : ' + target.dataset.variable + '</p>';
			tQueryTemplate += '<p>value : ' + target.dataset.value + '</p>';
			tQueryTemplate += '</div>';
			tQuery.append(tQueryTemplate)
			
			positionTop = Number($(target).attr('y')) + Number(target.getAttribute('height'))/2 - 30;
			positionLeft = Number($(target).attr('x')) + Number(target.getAttribute('width'))/2 - 30;
			
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
function createChart_radar(params) {
	const i = params.i;
	const pId = params.pId;
	const margin = params.margin;
	margin.left = margin.right;
	margin.top += 100;
	const height = params.height-70;
	const width =  params.height-70;
	const data = params.data;
	const id = pId+'_'+i+'_svg';
	
	var cfg = {
		    radius: 5,
			factor: 1,
			factorLegend: .85,
			levels: 3,
			maxValue: 0,
			radians: 2 * Math.PI,
			opacityArea: 0.5,
			ToRight: 5,
			TranslateX: 50,
			TranslateY: 35,
			ExtraWidthX: 100,
			ExtraWidthY: 100,
			color: d3.scaleOrdinal().range(["#185ba5", "#CA0D59"])
	};

	var g = d3.select('#'+pId)
	.append('svg')
	.attr('id', id)
	.attr('viewBox', [0, 0, width+cfg.ExtraWidthX, height+cfg.ExtraWidthY])
	.style('width', width+cfg.ExtraWidthX)
	.style('height', height+cfg.ExtraWidthY)
	.style('pointer-events', 'all')
	.style('position', 'absolute')
	.style('left', (width+cfg.ExtraWidthX)/2)
	.attr("transform", "translate(0,0)");
		
	if('undefined' !== typeof options){
		for(var j in options){
			if('undefined' !== typeof options[j]){
				cfg[j] = options[j];
			}
		}
	}
	
	cfg.maxValue = 100;
	    
	var allAxis = (data[0].map(function(j, k){return j.area}));
	var total = allAxis.length;
	var radius = cfg.factor*Math.min(width/2, height/2);
	var Format = d3.format('%');
	d3.select(id).select("svg").remove();
	
	const nodeLevels = g.append('g').attr('class', 'node-levels').attr("transform", `translate(${cfg.TranslateX},${cfg.TranslateY})`);
		
	//Circular segments
	for(var j=0; j<cfg.levels; j++){
		var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
  	
		nodeLevels
		.selectAll(".levels")
	    	.data(allAxis)
	    	.enter()
	    	.append("line")
	    	.attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
	    	.attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
	    	.attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
	    	.attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
	    	.attr("class", "line")
	    	.style("stroke", "grey")
	    	.style("stroke-opacity", "0.75")
	    	.style("stroke-width", "0.3px")
	    	.attr("transform", "translate(" + (width/2-levelFactor) + ", " + (height/2-levelFactor) + ")");
	}
	
	//Text indicating at what % each level is
	for(var j=0; j<cfg.levels; j++){
		var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
		nodeLevels
		.selectAll(".levels")
		.data([1]) //dummy data
		.enter()
		.append("text")
		.attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
		.attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
		.attr("class", "legend")
		.style("font-family", "sans-serif")
		.style("font-size", "10px")
		.attr("transform", "translate(" + (width/2-levelFactor + cfg.ToRight) + ", " + (height/2-levelFactor) + ")")
		.attr("fill", "#737373")
		.text((j+1)*100/cfg.levels);
	}
	
	series = 0;

	var axis = g.append('g').attr('class', 'radar-axis')
	.attr("transform", `translate(${cfg.TranslateX},${cfg.TranslateY})`)
	.selectAll(".axis")
	.data(allAxis)
	.enter()
	.append("g")
	.attr("class", "axis");

	axis.append("line")
	.attr("x1", width/2)
	.attr("y1", height/2)
	.attr("x2", function(d, i){return width/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
	.attr("y2", function(d, i){return height/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
	.attr("class", "line")
	.style("stroke", "grey")
	.style("stroke-width", "1px");

	axis.append("text")
	.attr("class", "legend")
	.text(function(d){return d})
	.style("font-family", "sans-serif")
	.style("font-size", "11px")
	.attr("text-anchor", "middle")
	.attr("dy", "1.5em")
	.attr("transform", function(d, i){return "translate(0, -10)"})
	.attr("x", function(d, i){return width/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
	.attr("y", function(d, i){return height/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});
	 
	data.forEach(function(y, x) {
		dataValues = [];
		g
		.append('g')
		.attr('class', 'radar-nodes')
		.selectAll(".nodes")
		.data(y, function(j, i){
			dataValues.push([
	  			width/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
	  			height/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
  			]);
		});
		dataValues.push(dataValues[0]);
  	
		g
		.append('g')
		.attr('class', 'radar-area')
		.selectAll(".area")
		.data([dataValues])
		.enter()
		.append("polygon")
		.attr("transform", `translate(${cfg.TranslateX},${cfg.TranslateY})`)
		.attr("class", "radar-chart-serie"+series)
		.style("stroke-width", "2px")
		.style("stroke", cfg.color(series))
		.attr("points",function(d) {
			var str="";
			for(var pti=0;pti<d.length;pti++){
				str=str+d[pti][0]+","+d[pti][1]+" ";
			}
			return str;
		})
		.style("fill", function(j, i){return cfg.color(series)})
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d){
			z = "polygon."+d3.select(this).attr("class");
			g.selectAll("polygon")
			.transition(200)
			.style("fill-opacity", 0.1); 
			g.selectAll(z)
			.transition(200)
			.style("fill-opacity", .7);
		})
		.on('mouseout', function(){
			g.selectAll("polygon")
			.transition(200)
			.style("fill-opacity", cfg.opacityArea);
		});
		series++;
	});
	series=0;

	var tooltip = $('#qe_detail_tooltip_'+i+'.radar');
	
    data.forEach(function(y, x){
		g
		.append('g')
		.attr('class', 'circles')
		.selectAll(".nodes")
		.data(y).enter()
		.append("circle")
		.attr("class", "radar-chart-serie"+series)
		.attr("transform", `translate(${cfg.TranslateX},${cfg.TranslateY})`)
		.attr('r', cfg.radius)
		.attr("alt", function(j){return Math.max(j.value, 0)})
		.attr("cx", function(j, i){
        	dataValues.push([
        		width/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
        		cfg.height/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
    		]);
        	return width/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
        })
        .attr("cy", function(j, i){
        	return height/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("data-id", function(j){return j.area})
		.style("fill", "#fff")
		.style("stroke-width", "2px")
		.style("stroke", cfg.color(series)).style("fill-opacity", .9)
		.on('mouseover', function (d){
			
			const circle = $(this);
			newX = circle.offset().left - (tooltip.width()/2);
			newY = circle.offset().top - tooltip.height() - 10;
			
			var tooltipTemplate = '';
			tooltipTemplate += '<div>';
			tooltipTemplate += '<div class="tooltip_text">';
			tooltipTemplate += '<p>key : ' + d.area + '</p>';
			tooltipTemplate += '<p>count : ' + d.value + '</p>';
			tooltipTemplate += '</div>';
			
			tooltip
			.offset({top:newY, left:newX})
			.css('visibility', 'visible')
			.html(tooltipTemplate)
			.animate({'opacity': 1}, 200);
			
			z = "polygon."+d3.select(this).attr("class");
			g.selectAll("polygon")
			.transition(200)
			.style("fill-opacity", 0.1); 
			g.selectAll(z)
			.transition(200)
			.style("fill-opacity", .7);
		})
		.on('mouseout', function(){
            
			tooltip
			.css('visibility', 'hidden')
			.animate({'opacity' : 0}, 200);
			
			g.selectAll("polygon")
			.transition(200)
			.style("fill-opacity", cfg.opacityArea);
		})
		.append("title")
		.text(function(j){return Math.max(j.value, 0)});

		series++;
    })
}

// when close Dialog 
QEDialogUI.prototype._dismiss = function() {
	this.statData = {};
	_QEDialogUI = null;
	
	DialogSystem.dismissUntil(this._level - 1);
};
