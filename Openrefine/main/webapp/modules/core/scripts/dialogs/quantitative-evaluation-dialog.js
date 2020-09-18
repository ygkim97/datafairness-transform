// for window resize event.
var _QEDialogUI = null;
var QE_SELECTED_HEADER = [];

const CHART_DIV_ID = 'qe_chart'

function QEDialogUI(selectedHeaders) {

	_QEDialogUI = this;
	QE_SELECTED_HEADER = selectedHeaders;
	
	this._createDialog(selectedHeaders);
} 

QEDialogUI.prototype._getStatisticData = function(chartId) {
	const warningDialog1 = DialogSystem.showBusy();
	
	var response = null;
	
	$.ajax({
		type : 'POST',
		url : "command/core/get-quantitative-evaluation?" + $.param({ project: UI_CHART_INFO.selectedPId}),
//		{headers: QE_SELECTED_HEADER.join(',')},	// no history option
		data : null,
		async : false,
		success : function(data) {
			warningDialog1();
			response = data;
		}
	})
	
	// temp data
	var bar_str = '[{"name":"E","value":0.12702},{"name":"T","value":0.09056},{"name":"A","value":0.08167},{"name":"O","value":0.07507},{"name":"I","value":0.06966},{"name":"N","value":0.06749},{"name":"S","value":0.06327},{"name":"H","value":0.06094},{"name":"R","value":0.05987},{"name":"D","value":0.04253},{"name":"L","value":0.04025},{"name":"C","value":0.02782},{"name":"U","value":0.02758},{"name":"M","value":0.02406},{"name":"W","value":0.0236},{"name":"F","value":0.02288},{"name":"G","value":0.02015},{"name":"Y","value":0.01974},{"name":"P","value":0.01929},{"name":"B","value":0.01492},{"name":"V","value":0.00978},{"name":"K","value":0.00772},{"name":"J","value":0.00153},{"name":"X","value":0.0015},{"name":"Q","value":0.00095},{"name":"Z","value":0.00074}]';
	var bar_data = JSON.parse(bar_str);
	var line_str = '[{"date":"2007-11-25T00:00:00.000Z","value":172.54},{"date":"2007-11-26T00:00:00.000Z","value":174.81},{"date":"2007-11-27T00:00:00.000Z","value":180.22},{"date":"2007-11-28T00:00:00.000Z","value":184.29},{"date":"2007-11-29T00:00:00.000Z","value":182.22},{"date":"2007-12-03T00:00:00.000Z","value":178.86},{"date":"2007-12-04T00:00:00.000Z","value":179.81},{"date":"2007-12-05T00:00:00.000Z","value":185.5},{"date":"2007-12-06T00:00:00.000Z","value":189.95},{"date":"2007-12-07T00:00:00.000Z","value":194.3},{"date":"2007-12-09T00:00:00.000Z","value":194.21},{"date":"2007-12-10T00:00:00.000Z","value":188.54},{"date":"2007-12-11T00:00:00.000Z","value":190.86},{"date":"2007-12-12T00:00:00.000Z","value":191.83},{"date":"2007-12-13T00:00:00.000Z","value":190.39},{"date":"2007-12-16T00:00:00.000Z","value":184.4},{"date":"2007-12-17T00:00:00.000Z","value":182.98},{"date":"2007-12-18T00:00:00.000Z","value":183.12},{"date":"2007-12-19T00:00:00.000Z","value":187.21},{"date":"2007-12-20T00:00:00.000Z","value":193.91},{"date":"2007-12-23T00:00:00.000Z","value":198.8},{"date":"2007-12-25T00:00:00.000Z","value":198.95},{"date":"2007-12-26T00:00:00.000Z","value":198.57},{"date":"2007-12-27T00:00:00.000Z","value":199.83},{"date":"2007-12-30T00:00:00.000Z","value":198.08},{"date":"2008-01-02T00:00:00.000Z","value":194.84},{"date":"2008-01-03T00:00:00.000Z","value":194.93},{"date":"2008-01-04T00:00:00.000Z","value":180.05},{"date":"2008-01-07T00:00:00.000Z","value":177.64},{"date":"2008-01-08T00:00:00.000Z","value":171.25},{"date":"2008-01-09T00:00:00.000Z","value":179.4},{"date":"2008-01-09T00:00:00.000Z","value":178.02},{"date":"2008-01-10T00:00:00.000Z","value":172.69},{"date":"2008-01-13T00:00:00.000Z","value":178.78},{"date":"2008-01-14T00:00:00.000Z","value":169.04},{"date":"2008-01-15T00:00:00.000Z","value":159.64},{"date":"2008-01-16T00:00:00.000Z","value":160.89},{"date":"2008-01-17T00:00:00.000Z","value":161.36},{"date":"2008-01-21T00:00:00.000Z","value":155.64},{"date":"2008-01-22T00:00:00.000Z","value":139.07},{"date":"2008-01-23T00:00:00.000Z","value":135.6},{"date":"2008-01-24T00:00:00.000Z","value":130.01},{"date":"2008-01-27T00:00:00.000Z","value":130.01},{"date":"2008-01-28T00:00:00.000Z","value":131.54},{"date":"2008-01-29T00:00:00.000Z","value":132.18},{"date":"2008-01-30T00:00:00.000Z","value":135.36},{"date":"2008-02-01T00:00:00.000Z","value":133.75},{"date":"2008-02-04T00:00:00.000Z","value":131.65},{"date":"2008-02-05T00:00:00.000Z","value":129.36},{"date":"2008-02-06T00:00:00.000Z","value":122}]';
	var line_data = JSON.parse(line_str).map(d=>{return {date: new Date(d.date), value:d.value}})
	var dot_str = '[{"category":"setosa","x":5.1,"y":3.5},{"category":"setosa","x":4.9,"y":3},{"category":"setosa","x":4.7,"y":3.2},{"category":"setosa","x":4.6,"y":3.1},{"category":"setosa","x":5,"y":3.6},{"category":"setosa","x":5.4,"y":3.9},{"category":"setosa","x":4.6,"y":3.4},{"category":"setosa","x":5,"y":3.4},{"category":"setosa","x":4.4,"y":2.9},{"category":"setosa","x":4.9,"y":3.1},{"category":"setosa","x":5.4,"y":3.7},{"category":"setosa","x":4.8,"y":3.4},{"category":"setosa","x":4.8,"y":3},{"category":"setosa","x":4.3,"y":3},{"category":"setosa","x":5.8,"y":4},{"category":"setosa","x":5.7,"y":4.4},{"category":"setosa","x":5.4,"y":3.9},{"category":"setosa","x":5.1,"y":3.5},{"category":"setosa","x":5.7,"y":3.8},{"category":"setosa","x":5.1,"y":3.8},{"category":"setosa","x":5.4,"y":3.4},{"category":"setosa","x":5.1,"y":3.7},{"category":"setosa","x":4.6,"y":3.6},{"category":"setosa","x":5.1,"y":3.3},{"category":"setosa","x":4.8,"y":3.4},{"category":"setosa","x":5,"y":3},{"category":"setosa","x":5,"y":3.4},{"category":"setosa","x":5.2,"y":3.5},{"category":"setosa","x":5.2,"y":3.4},{"category":"setosa","x":4.7,"y":3.2},{"category":"setosa","x":4.8,"y":3.1},{"category":"setosa","x":5.4,"y":3.4},{"category":"setosa","x":5.2,"y":4.1},{"category":"setosa","x":5.5,"y":4.2},{"category":"setosa","x":4.9,"y":3.1},{"category":"setosa","x":5,"y":3.2},{"category":"setosa","x":5.5,"y":3.5},{"category":"setosa","x":4.9,"y":3.6},{"category":"setosa","x":4.4,"y":3},{"category":"setosa","x":5.1,"y":3.4},{"category":"setosa","x":5,"y":3.5},{"category":"setosa","x":4.5,"y":2.3},{"category":"setosa","x":4.4,"y":3.2},{"category":"setosa","x":5,"y":3.5},{"category":"setosa","x":5.1,"y":3.8},{"category":"setosa","x":4.8,"y":3},{"category":"setosa","x":5.1,"y":3.8},{"category":"setosa","x":4.6,"y":3.2},{"category":"setosa","x":5.3,"y":3.7},{"category":"setosa","x":5,"y":3.3},{"category":"versicolor","x":7,"y":3.2},{"category":"versicolor","x":6.4,"y":3.2},{"category":"versicolor","x":6.9,"y":3.1},{"category":"versicolor","x":5.5,"y":2.3},{"category":"versicolor","x":6.5,"y":2.8},{"category":"versicolor","x":5.7,"y":2.8},{"category":"versicolor","x":6.3,"y":3.3},{"category":"versicolor","x":4.9,"y":2.4},{"category":"versicolor","x":6.6,"y":2.9},{"category":"versicolor","x":5.2,"y":2.7},{"category":"versicolor","x":5,"y":2},{"category":"versicolor","x":5.9,"y":3},{"category":"versicolor","x":6,"y":2.2},{"category":"versicolor","x":6.1,"y":2.9},{"category":"versicolor","x":5.6,"y":2.9},{"category":"versicolor","x":6.7,"y":3.1},{"category":"versicolor","x":5.6,"y":3},{"category":"versicolor","x":5.8,"y":2.7},{"category":"versicolor","x":6.2,"y":2.2},{"category":"versicolor","x":5.6,"y":2.5},{"category":"versicolor","x":5.9,"y":3.2},{"category":"versicolor","x":6.1,"y":2.8},{"category":"versicolor","x":6.3,"y":2.5},{"category":"versicolor","x":6.1,"y":2.8},{"category":"versicolor","x":6.4,"y":2.9},{"category":"versicolor","x":6.6,"y":3},{"category":"versicolor","x":6.8,"y":2.8},{"category":"versicolor","x":6.7,"y":3},{"category":"versicolor","x":6,"y":2.9},{"category":"versicolor","x":5.7,"y":2.6},{"category":"versicolor","x":5.5,"y":2.4},{"category":"versicolor","x":5.5,"y":2.4},{"category":"versicolor","x":5.8,"y":2.7},{"category":"versicolor","x":6,"y":2.7},{"category":"versicolor","x":5.4,"y":3},{"category":"versicolor","x":6,"y":3.4},{"category":"versicolor","x":6.7,"y":3.1},{"category":"versicolor","x":6.3,"y":2.3},{"category":"versicolor","x":5.6,"y":3},{"category":"versicolor","x":5.5,"y":2.5},{"category":"versicolor","x":5.5,"y":2.6},{"category":"versicolor","x":6.1,"y":3},{"category":"versicolor","x":5.8,"y":2.6},{"category":"versicolor","x":5,"y":2.3},{"category":"versicolor","x":5.6,"y":2.7},{"category":"versicolor","x":5.7,"y":3},{"category":"versicolor","x":5.7,"y":2.9},{"category":"versicolor","x":6.2,"y":2.9},{"category":"versicolor","x":5.1,"y":2.5},{"category":"versicolor","x":5.7,"y":2.8},{"category":"virginica","x":6.3,"y":3.3},{"category":"virginica","x":5.8,"y":2.7},{"category":"virginica","x":7.1,"y":3},{"category":"virginica","x":6.3,"y":2.9},{"category":"virginica","x":6.5,"y":3},{"category":"virginica","x":7.6,"y":3},{"category":"virginica","x":4.9,"y":2.5},{"category":"virginica","x":7.3,"y":2.9},{"category":"virginica","x":6.7,"y":2.5},{"category":"virginica","x":7.2,"y":3.6},{"category":"virginica","x":6.5,"y":3.2},{"category":"virginica","x":6.4,"y":2.7},{"category":"virginica","x":6.8,"y":3},{"category":"virginica","x":5.7,"y":2.5},{"category":"virginica","x":5.8,"y":2.8},{"category":"virginica","x":6.4,"y":3.2},{"category":"virginica","x":6.5,"y":3},{"category":"virginica","x":7.7,"y":3.8},{"category":"virginica","x":7.7,"y":2.6},{"category":"virginica","x":6,"y":2.2},{"category":"virginica","x":6.9,"y":3.2},{"category":"virginica","x":5.6,"y":2.8},{"category":"virginica","x":7.7,"y":2.8},{"category":"virginica","x":6.3,"y":2.7},{"category":"virginica","x":6.7,"y":3.3},{"category":"virginica","x":7.2,"y":3.2},{"category":"virginica","x":6.2,"y":2.8},{"category":"virginica","x":6.1,"y":3},{"category":"virginica","x":6.4,"y":2.8},{"category":"virginica","x":7.2,"y":3},{"category":"virginica","x":7.4,"y":2.8},{"category":"virginica","x":7.9,"y":3.8},{"category":"virginica","x":6.4,"y":2.8},{"category":"virginica","x":6.3,"y":2.8},{"category":"virginica","x":6.1,"y":2.6},{"category":"virginica","x":7.7,"y":3},{"category":"virginica","x":6.3,"y":3.4},{"category":"virginica","x":6.4,"y":3.1},{"category":"virginica","x":6,"y":3},{"category":"virginica","x":6.9,"y":3.1},{"category":"virginica","x":6.7,"y":3.1},{"category":"virginica","x":6.9,"y":3.1},{"category":"virginica","x":5.8,"y":2.7},{"category":"virginica","x":6.8,"y":3.2},{"category":"virginica","x":6.7,"y":3.3},{"category":"virginica","x":6.7,"y":3},{"category":"virginica","x":6.3,"y":2.5},{"category":"virginica","x":6.5,"y":3},{"category":"virginica","x":6.2,"y":3.4},{"category":"virginica","x":5.9,"y":3}]';
	var dot_data = JSON.parse(dot_str);
	var heat_str= '[{"group":"A","variable":"v1","value":"30"},{"group":"A","variable":"v2","value":"95"},{"group":"A","variable":"v3","value":"22"},{"group":"A","variable":"v4","value":"14"},{"group":"A","variable":"v5","value":"59"},{"group":"A","variable":"v6","value":"52"},{"group":"A","variable":"v7","value":"88"},{"group":"A","variable":"v8","value":"20"},{"group":"A","variable":"v9","value":"99"},{"group":"A","variable":"v10","value":"66"},{"group":"B","variable":"v1","value":"37"},{"group":"B","variable":"v2","value":"50"},{"group":"B","variable":"v3","value":"81"},{"group":"B","variable":"v4","value":"79"},{"group":"B","variable":"v5","value":"84"},{"group":"B","variable":"v6","value":"91"},{"group":"B","variable":"v7","value":"82"},{"group":"B","variable":"v8","value":"89"},{"group":"B","variable":"v9","value":"6"},{"group":"B","variable":"v10","value":"67"},{"group":"C","variable":"v1","value":"96"},{"group":"C","variable":"v2","value":"13"},{"group":"C","variable":"v3","value":"98"},{"group":"C","variable":"v4","value":"10"},{"group":"C","variable":"v5","value":"86"},{"group":"C","variable":"v6","value":"23"},{"group":"C","variable":"v7","value":"74"},{"group":"C","variable":"v8","value":"47"},{"group":"C","variable":"v9","value":"73"},{"group":"C","variable":"v10","value":"40"},{"group":"D","variable":"v1","value":"75"},{"group":"D","variable":"v2","value":"18"},{"group":"D","variable":"v3","value":"92"},{"group":"D","variable":"v4","value":"43"},{"group":"D","variable":"v5","value":"16"},{"group":"D","variable":"v6","value":"27"},{"group":"D","variable":"v7","value":"76"},{"group":"D","variable":"v8","value":"24"},{"group":"D","variable":"v9","value":"1"},{"group":"D","variable":"v10","value":"87"},{"group":"E","variable":"v1","value":"44"},{"group":"E","variable":"v2","value":"29"},{"group":"E","variable":"v3","value":"58"},{"group":"E","variable":"v4","value":"55"},{"group":"E","variable":"v5","value":"65"},{"group":"E","variable":"v6","value":"56"},{"group":"E","variable":"v7","value":"9"},{"group":"E","variable":"v8","value":"78"},{"group":"E","variable":"v9","value":"49"},{"group":"E","variable":"v10","value":"36"},{"group":"F","variable":"v1","value":"35"},{"group":"F","variable":"v2","value":"80"},{"group":"F","variable":"v3","value":"8"},{"group":"F","variable":"v4","value":"46"},{"group":"F","variable":"v5","value":"48"},{"group":"F","variable":"v6","value":"100"},{"group":"F","variable":"v7","value":"17"},{"group":"F","variable":"v8","value":"41"},{"group":"F","variable":"v9","value":"33"},{"group":"F","variable":"v10","value":"11"},{"group":"G","variable":"v1","value":"77"},{"group":"G","variable":"v2","value":"62"},{"group":"G","variable":"v3","value":"94"},{"group":"G","variable":"v4","value":"15"},{"group":"G","variable":"v5","value":"69"},{"group":"G","variable":"v6","value":"63"},{"group":"G","variable":"v7","value":"61"},{"group":"G","variable":"v8","value":"54"},{"group":"G","variable":"v9","value":"38"},{"group":"G","variable":"v10","value":"93"},{"group":"H","variable":"v1","value":"39"},{"group":"H","variable":"v2","value":"26"},{"group":"H","variable":"v3","value":"90"},{"group":"H","variable":"v4","value":"83"},{"group":"H","variable":"v5","value":"31"},{"group":"H","variable":"v6","value":"2"},{"group":"H","variable":"v7","value":"51"},{"group":"H","variable":"v8","value":"28"},{"group":"H","variable":"v9","value":"42"},{"group":"H","variable":"v10","value":"7"},{"group":"I","variable":"v1","value":"5"},{"group":"I","variable":"v2","value":"60"},{"group":"I","variable":"v3","value":"21"},{"group":"I","variable":"v4","value":"25"},{"group":"I","variable":"v5","value":"3"},{"group":"I","variable":"v6","value":"70"},{"group":"I","variable":"v7","value":"34"},{"group":"I","variable":"v8","value":"68"},{"group":"I","variable":"v9","value":"57"},{"group":"I","variable":"v10","value":"32"},{"group":"J","variable":"v1","value":"19"},{"group":"J","variable":"v2","value":"85"},{"group":"J","variable":"v3","value":"53"},{"group":"J","variable":"v4","value":"45"},{"group":"J","variable":"v5","value":"71"},{"group":"J","variable":"v6","value":"64"},{"group":"J","variable":"v7","value":"4"},{"group":"J","variable":"v8","value":"12"},{"group":"J","variable":"v9","value":"97"},{"group":"J","variable":"v10","value":"72"}]';
	var heat_data = JSON.parse(heat_str);
	var radar_data = [[
        {"area": "Central ", "value": 80},
        {"area": "Kirkdale", "value": 40},
        {"area": "Kensington ", "value": 40},
        {"area": "Everton ", "value": 90},
        {"area": "Picton ", "value": 60},
        {"area": "Riverside ", "value": 80}
	]];
	
	// header Index 순서대로 chartData 를 return해야함.
	response = [];
//	response.push(bar_data);
//	response.push(bar_data);
//	response.push(bar_data);
//	response.push(bar_data);
//	response.push(bar_data);
//	response.push(bar_data);
//	response.push(bar_data);
//	response.push(bar_data);
//	response.push(bar_data);
//	response.push(bar_data);
//	response.push(bar_data);
	
//	response.push(dot_data);
	response.push(bar_data);
	response.push(bar_data);
	response.push(dot_data);
	response.push(bar_data);
	response.push(dot_data);
	response.push(line_data);
	response.push(radar_data);
	response.push(heat_data);
	
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
		text : 'CORRELATED SCATTERPLOTS', 
		type : 'dot'
	},{
		id : 'SH',
		text : 'SKEWED HISTOGRAMS', 
		type : 'bar'
	},{
		id : 'GH',
		text : 'GAPS HISTOGRAMS', 
		type : 'bar'
	},{
		id : 'BIP',
		text : 'BIPLOTS', 
		type : 'dot'
	},{
		id : 'OUT',
		text : 'OUTLIERS', 
		type : 'bar'
	},{
		id : 'CG',
		text : 'CORRELATION GRAPH', 
		type : 'dot'
	}, {
		id : 'PCP',
		text : 'PARALLEL COORDINATES PLOT', 
		type : 'line'
	}, {
		id : 'RP',
		text : 'RADAR PLOT', 
		type : 'radar'
	}, {
		id : 'DH',
		text : 'DATA HEATMAP',
		type : 'heatmap'
	}]
	
	var template = '';
	template += '<table>';

	var chartCnt = this.chartInfos.length;
	var lineMaxCnt = 5
	var trI = parseInt(chartCnt/lineMaxCnt);	// 5개씩 한줄
	trI += chartCnt%5 == 0 ? 0 : 1;
	var divId = '';
	
	var _len = (parseInt(chartCnt/5)+1) * lineMaxCnt;

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
			trTemplate2 += '<div class="qe-chart chart-type-'+ci.type+'" id="'+CHART_DIV_ID+'_'+i+'">';
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
	const chartId = chartInfo.chartId;
	const chartData = this._getStatisticData(chartId);
	
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

	// detail card
	QE_SELECTED_HEADER.forEach(function(h, i) {
		const pageCnt = i+1;
		const prevPageCnt = pageCnt == 1 ? QE_SELECTED_HEADER.length : pageCnt-1;
		const nextPageCnt = pageCnt == QE_SELECTED_HEADER.length ? 1 : pageCnt+1;
		const isChecked = pageCnt == 1 ? 'checked' : '';
		
		template1 += '<input id="rad'+pageCnt+'" type="radio" name="rad" '+isChecked+'>';
		template1 += '<section>';
		template1 += '<h1>'+h.name+'</h1>';
		template1 += '<div class="qe-chart" id="'+divId+pageCnt+'" data-i='+pageCnt+' data-headerIndex='+h.index+'>';
		template1 += '</div>';
		template1 += '<label for="rad'+prevPageCnt+'"><i class="fa fa-chevron-left"></i></label>';
		template1 += '<label for="rad'+nextPageCnt+'"><i class="fa fa-chevron-right"></i></label>';
		template1 += '</section>';
	})	
	chartWrap.append(template1);
}
QEDialogUI.prototype._createDetailChart = function(i, chartInfo, _chartData) {
	const margin = {top: 20, right: 30, bottom: 50, left: 50}
	const width = 890;
	const height = 410;
	
	const chartData = _chartData;
	const _self = this;
	
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
}

QEDialogUI.prototype.createChartByType = function(type, params) {
	switch(type) {
		case 'bar':
			createChart_bar(params)
			break;
		case 'line':
			createChart_line(params)
			break;
		case 'dot':
			createChart_dot(params)
			break;
		case 'heatmap':
			createChart_heatmap(params)
			break;
		case 'radar':
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
	.attr('data-y', d => d.value);

	svg.append("g").call(xAxis);
	svg.append("g").call(yAxis);
	
	// 상세 팝업 일때만, 표시한다.
	const rectEl = document.getElementById(pId).getElementsByTagName('rect');
	for(const el of rectEl) {
		el.removeEventListener('mouseover', ()=>{})
		el.addEventListener('mouseover', (event) => {
			target = event.target;
			target.classList.add('fill-selected')
			
			tooltip = $('#detail_tooltip')[0]; 
			
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
			positionLeft = $(target).position().left - tQuery.width()/2 + Number(target.getAttribute('width'))/2 + 5
			
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
function createChart_line(params) {
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

	svg.append("path")
	.datum(data)
	.attr("fill", "none")
	.attr("stroke", "steelblue")
	.attr("stroke-width", 1.5)
	.attr("stroke-linejoin", "round")
	.attr("stroke-linecap", "round")
	.attr("d", line);

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
	.style('pointer-events', 'all')
	
	const x = d3.scaleLinear()
  .domain(d3.extent(data, d => d.x)).nice()
  .range([margin.left, width - margin.right])
  
  const y = d3.scaleLinear()
  .domain(d3.extent(data, d => d.y)).nice()
  .range([height - margin.bottom, margin.top])
	
  const color = d3.scaleOrdinal(data.map(d => d.category), d3.schemeCategory10)
	const shape = d3.scaleOrdinal(data.map(d => d.category), d3.symbols.map(s => d3.symbol().type(s)()))
	
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
      .text(data.y))

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
	
	svg.append("g")
		.attr("stroke-width", 1.5)
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
	.selectAll("path")
	.data(data)
	.join("path")
	.attr("transform", d => `translate(${x(d.x)},${y(d.y)})`)
	.attr("fill", d => color(d.category))
	.attr("d", d => shape(d.category));
}
function createChart_heatmap(params) {
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
	.style('pointer-events', 'all')
	.append("g")
	  .attr("transform",
	        "translate(" + margin.left + "," + margin.top + ")");

	// Labels of row and columns
	var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
	var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

	// Build X scales and axis:
	var x = d3.scaleBand()
	  .range([ 0, width ])
	  .domain(myGroups)
	  .padding(0.01);
	svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x))

	// Build X scales and axis:
	var y = d3.scaleBand()
	  .range([ height, 0 ])
	  .domain(myVars)
	  .padding(0.01);
	svg.append("g")
	  .call(d3.axisLeft(y));

	// Build color scale
	var myColor = d3.scaleLinear()
	  .range(["white", "#69b3a2"])
	  .domain([1,100])

	//Read the data
	svg.selectAll()
	.data(data, function(d) {return d.group+':'+d.variable;})
	.enter()
	.append("rect")
	.attr("x", function(d) { return x(d.group) })
	.attr("y", function(d) { return y(d.variable) })
	.attr("width", x.bandwidth() )
	.attr("height", y.bandwidth() )
	.style("fill", function(d) { return myColor(d.value)} )
}
function createChart_radar(params) {
	const i = params.i;
	const pId = params.pId;
	const width = params.width;
	const height = params.height;
	const margin = params.margin;
	const data = params.data;
	const id = pId+'_'+i+'_svg';
	
	var cfg = {
			factor: 1,
			factorLegend: .85,
			levels: 3,
			maxValue: 0,
			radians: 2 * Math.PI,
			opacityArea: 0.5,
			ToRight: 5,
			TranslateX: 80,
			TranslateY: 30,
			ExtraWidthX: 100,
			ExtraWidthY: 100,
			color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"])
	};
	
	var g = d3.select('#'+pId)
	.append('svg')
	.attr('id', id)
	.attr('viewBox', [0, 0, width, height])
	.style('pointer-events', 'all')
		
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

//  var g = d3.select(id)
//      .append("svg")
//      .attr("width", width+cfg.ExtraWidthX)
//      .attr("height", height+cfg.ExtraWidthY)
//      .append("g")
//      .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

	var tooltip;
		
  //Circular segments
  for(var j=0; j<cfg.levels; j++){
  	var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
  	
  	g.selectAll(".levels")
	    	.data(allAxis)
	    	.enter()
	    	.append("svg:line")
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
  	g.selectAll(".levels")
  	.data([1]) //dummy data
  	.enter()
  	.append("svg:text")
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

  var axis = g.selectAll(".axis")
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
	 
  data.forEach(function(y, x){
  	dataValues = [];
  	g.selectAll(".nodes")
  	.data(y, function(j, i){
  		dataValues.push([
  			width/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
  			height/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
  		]);
  	});
  	dataValues.push(dataValues[0]);
  	
		g.selectAll(".area")
		.data([dataValues])
		.enter()
		.append("polygon")
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
}

// when close Dialog 
QEDialogUI.prototype._dismiss = function() {
	this.statData = {};
	_QEDialogUI = null;
	
	DialogSystem.dismissUntil(this._level - 1);
};
