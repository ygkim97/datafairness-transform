function BasicStatisticsDialogUI() {
	this._createDialog();
} 

BasicStatisticsDialogUI.prototype._createDialog = function() {
	var self = this;

	var frame = $(DOM.loadHTML("core", "scripts/dialogs/basic-statistics-dialog.html"));
	this._elmts = DOM.bind(frame);

	this._level = DialogSystem.showDialog(frame);
	this._elmts.closeButton.html($.i18n('core-buttons/close'));
	this._elmts.closeButton.click(function() {
		self._dismiss();
		Refine.OpenProjectUI.prototype._addTagFilter()
	});
	
	this._gridColumns = [];

	// title setting
	var title = $('<h5>').text($.i18n('core-index-dialog/title'));
	$('#graph-title').append(title);
	
	// Create Dialog
	this._getStatisticData();
}
BasicStatisticsDialogUI.prototype.resize = function() {
	console.log('resize')
};

BasicStatisticsDialogUI.prototype._getStatisticData = function() {
	var _self = this;
	$.get(
			"command/core/get-based-statistic?" + $.param({ project: UI_CHART_INFO.selectedPId}),
			{engine: {}},	// no history option
			function(data) {
				if(data.code === "error") {
					alert('error')
				} else {
					_self._createGrid(data.columnInfo, data.rowNames);
					_self._createChart_default();
					_self._createChart_tui(data.columnInfo, data.chartRows);
//					_self._createChart_d3(data.columnInfo, data.chartRows);
//					_self._createChart_chartjs(data.columnInfo, data.chartRows);
				}
			},
			"json"
	);
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
	template += '<tr>';
	
	this._gridColumns.forEach( (c,i)=> {
		var divId = '';
		if (c.name !== 'key') {
			divId = 'template_'+i;
			template += '<td>';
			template += '<div id="'+divId+'" class="statistic_chart_warp">'
			template += '</td>';
		}
	})
	
	template += '</tr>';
	template += '</table>';
	dialogChart.append(template);
}

BasicStatisticsDialogUI.prototype._createChart_tui = function(columnInfo, datas) {
	let WIDTH = 0
	let HEIGHT = 0
	
	this._columnInfo = columnInfo;
	
	this._gridColumns.forEach(function(c, i) {
		if (c.name !== 'key') {
			const columnInfo = this._columnInfo[i-1];
			console.log(columnInfo)
			
			if (WIDTH == 0) {
				const parent = $('#template_' + i);
				WIDTH = parent.width();
				HEIGHT = parent.height();
			}
			
			if (columnInfo.type !== 'string') {
				var container = document.getElementById('template_' + i);
				var data = {
						categories: ['','','','',''],
						series: [{
								name: c.name,
								data: [50, 30, 500, 70, 60000]
						}]
				};
				var options = {
						chart: {
							width: WIDTH,
							height: HEIGHT,
							title: {
								text : ''
							},
							format: '1,000'
						},
						yAxis: {
							title: '',
							min: 0,
							max: columnInfo.max,
							showLabel : false
						},
						xAxis: {
							title: '',
							showLabel : false
						},
						legend: {
							visible : false
						},
						chartExportMenu : {
							visible : false
						}
				};
				Chart.registerTheme('myTheme', {
					title : {
						fontSize : 0.1
					}
				})
				options.theme = 'myTheme';
				Chart.columnChart(container, data, options);
			}
		}

	}, this)
}

// d3.js
BasicStatisticsDialogUI.prototype._createChart_d3 = function(columnInfo, datas) {
	const _self = this
	const convertedDatas = [];
	datas.forEach( (d, i) => {
		convertedDatas.push(_self._dataConvert(columnInfo[i].type, d));
	})
	
	var dataset = [9, 19, 29, 39, 29, 19, 9];
	this._gridColumns.forEach( (c, i) => {
		var svg = d3.select('#template_'+i)
			.append("svg")
			.attr('id', 'd3-svg-'+i)
			.attr('width', '100%')
			.attr('height', '100%'); 
		
		var parent = $('#template_'+i);
		var parentHeight = parent.height();
		var parentWidth = parent.width();
		
		svg.selectAll("rect")
	    .data(dataset)
	    .enter().append("rect")
	        .attr("class", "bar")
	        .attr("height", function(d, i) {return (d*3)})
	        .attr("width", 20)
	        .attr("x", function(d, i) {return (22 * i)})
	        .attr("y", function(d, i) {return (parentHeight - d*3)});
	})
	
}

// chartjs
//BasicStatisticsDialogUI.prototype._createChart_chartjs = function(columnInfo, datas) {
//	// chart frame
//	var dialogChart = this._elmts.basic_statistics_chart.empty();
//	
//	var template = '';
//	template += '<table>';
//	template += '<tr>';
//	
//	this._gridColumns.forEach( (c,i)=> {
//		var divId = '';
//		if (c.name !== 'key') {
//			divId = 'template_'+i;
//			template += '<td>';
//			template += '<div id="'+divId+'" class="statistic_chart_warp">'
//			template += '</td>';
//		}
//	})
//	
//	template += '</tr>';
//	template += '</table>';
//	dialogChart.append(template);
//	
//	const _self = this
//	const convertedDatas = [];
//	datas.forEach( (d, i) => {
//		convertedDatas.push(_self._dataConvert(columnInfo[i].type, d));
//	})
//	
//	var dataI = 0;
//	// draw chart
//	var width = 0;
//	var height = 0;
//	this._gridColumns.forEach( (c, i) => {
//		if (c.name !== 'key') {
//			const chartWrap = $('#template_'+i)
//			const td = chartWrap.parent();
//			
//			if (width == 0) {
//				width = td.width()-10;
//				height = td.height()-10;
//			}
//			var chartId = 'statistic_chart_' + i
//			var canvas = $('<canvas>');
//			canvas.attr('id', chartId);
//			canvas.css('width', width+ 'px');
//			canvas.css('height', height + 'px');
//			chartWrap.append(canvas);
//				
//			const data = convertedDatas[dataI]
//			if (data.length > 0) {
//				var ctx = document.getElementById(chartId).getContext('2d');
//				var chart = new Chart(ctx, {
//					type: 'bar',
//					data: {
//						// labels를 이렇게 넣지 말고, 다르게 넣고싶은데.. 어떻게 요약해야하나
//						labels : ['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''],
//						datasets: [{
//							data : data,
//							borderColor: "rgba(255, 201, 14, 1)",
//							backgroundColor: "rgba(255, 201, 14, 0.5)",
//							fill: false,
//						}]
//					},
//					options: {
//						legend: {
//							display: false
//						},
//						responsive: false,
//						maintainAspectRatio: false,
//						title: {
//							display: false,
//							text: ''
//						},
//						tooltips: {
//							mode: 'index',
//							intersect: false,
//							callbacks: {
//								title: function(tooltipItems, data) {
//									return data.labels[tooltipItems[0].datasetIndex];
//								}
//							}
//						},
//						hover: {
//							mode: 'nearest',
//							intersect: true
//						},
//						scales: {
//							xAxes: [{
//								display: true,
//								scaleLabel: {
//									display: false,
//									labelString: 'x축'
//								},
//								ticks: {
//									autoSkip: false
//								}
//							}],
//							yAxes: [{
//								display: false,
//								ticks: {
//									suggestedMin: 0,
//								},
//								scaleLabel: {
//									display: true,
//									labelString: 'y축'
//								}
//							}]
//						}
//					}
//				});
//			}
//			dataI++;
//		}
//	})
//}
	
BasicStatisticsDialogUI.prototype._createGrid = function(data, rowNames) {
//	var template = '<table>';
//	template += '<tbody>';
//	
//	var dialogGrid = this._elmts.basic_statistics_grid.empty();
//	
//	rowNames.forEach( (rowName, i) => {
//		template += '<tr>';
//		template += '<th>'+rowName+'</th>';
//		
//		data.forEach( (ci) => {
//			const val = ci[rowNames[i]]
//			template += '<td>'+(val == undefined ? '' : val)+'</td>';
//		})
//		template += '</tr>';
//	})
//	template += '</tbody>';
//	template+='</table>'
//	
//	dialogGrid.append(template)
	
	
	// use TOAST UI
	
	// create column
	// create data
	
//	1. create data
	// data template
	/**
	 * {
	 * 	key : 'key',
	 * 	name : 'name',
	 *  close : 'close'
	 * },
	 * {
	 * 	key : 'min',
	 * 	name : 123123,
	 * 	close : 345345345 
	 * }
	 */	
	var gridData = []
	rowNames.forEach( (r, i) => {
		var obj = {}
		
		obj['key'] = r.text;
		// name
		data.forEach( (d) => {
			obj[d.name] = (d[r.key] == undefined ? '' : d[r.key])
		})
		gridData.push(obj)
	})
	
	var columns = [];
	Object.keys(gridData[0]).forEach( (column)=>{
		columns.push({
			header : column,
			name : column,
			align : 'right',
		})
	})
	// 90 이상은 화면이 제대로 안나옴
	columns[0].width = 90
	
	this._gridColumns = columns;
	
	// 0번째는 header로 사용했기 때문에 삭제한다.
	gridData = gridData.slice(1);
	
	this.GridInstance = new Grid({
	  el: document.getElementById('basic-statistics-grid'), // Container element
	  columns: columns,
	  data: gridData
	});
}

BasicStatisticsDialogUI.prototype._dismiss = function() {
	DialogSystem.dismissUntil(this._level - 1);
};
