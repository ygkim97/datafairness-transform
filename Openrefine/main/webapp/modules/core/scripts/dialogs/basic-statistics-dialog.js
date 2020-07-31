function BasicStatisticsDialogUI(headerOriginalNames) {
	this._createDialog(headerOriginalNames);
} 

BasicStatisticsDialogUI.prototype._createDialog = function(selectedHeaders) {
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
	this._getStatisticData(selectedHeaders);
}
BasicStatisticsDialogUI.prototype.resize = function() {
	console.log('resize')
};

BasicStatisticsDialogUI.prototype._getStatisticData = function(selectedHeaders) {
	if (selectedHeaders == 'all') {
		selectedHeaders = [];
	}
	var _self = this;
	$.get(
			"command/core/get-based-statistic?" + $.param({ project: UI_CHART_INFO.selectedPId, headers : selectedHeaders}),
			{engine: {}},	// no history option
			function(data) {
				if(data.code === "error") {
					alert('error')
				} else {
					_self._createGrid(data.columnInfo, data.rowNames);
					_self._createChart_default();
//					_self._createChart_tui(data.columnInfo, data.frequencyList);
					_self._createChart_d3(data.columnInfo, data.frequencyList);
//					_self._createChart_chartjs(data.columnInfo, data.frequencyList);
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
			template += '<div id="'+divId+'" class="statistic_chart_warp">';
			template += '<div id="tooltip_'+divId+'" class="chart_tooltip">';
			template += '</div>';
			template += '</div>';
			template += '</td>';
		}
	})
	
	template += '</tr>';
	template += '</table>';
	dialogChart.append(template);
}

BasicStatisticsDialogUI.prototype._getD3ChartSeries = function(data) {
	const keys = Object.keys(data);
	const values = Object.values(data);
	
	var data = []
	
	keys.forEach( (_k, i)=> {
		data.push({
			key : _k,
			value : values[i]
		})
	})
	return data
}

// d3.js
BasicStatisticsDialogUI.prototype._createChart_d3 = function(columnInfo, datas) {
	const _self = this
	
	const td = $('#template_'+1)
	const width = td.width();
	const height = td.height();
	const margin = {top: 10, right: 10, bottom: 10, left: 30}

	for (var i = 0, size = this._gridColumns.length; i < size; i++) {
		const c = this._gridColumns[i];
		
		const svg = d3.select('#template_'+i).append('svg').style('width', width).style('height', height);
		
		if (c.name != 'key' && columnInfo[i-1].type != 'string') {
			const data = this._getD3ChartSeries(datas[i-1]);
			
			const x = d3.scaleBand()
				.domain(data.map(d => d.key))
				.range([margin.left, width - margin.right])
				.padding(0.4);
			 
			const y = d3.scaleLinear()
				.domain([0, d3.max(data, d => d.value)]).nice()
				.range([height - margin.bottom, margin.top]);
			 
			const xAxis = g => g
				.attr('transform', `translate(0, ${height - margin.bottom})`)
				.call(d3.axisBottom(x).tickSizeOuter(0))
				.call(g => g.select('.domain').remove())
				.call(g => g.selectAll('line').remove())
				.selectAll('text')
				.style('display', 'none');
			 
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
			svg.append('g')
				.selectAll('rect').data(data).enter().append('rect')
				.attr('x', d => x(d.key))
				.attr('y', d => y(d.value))
				.attr('height', d => y(0) - y(d.value))
				.attr('width', x.bandwidth())
				.attr('fill', 'skyblue')
				.attr('data-x', d => d.key)
				.attr('data-y', d => d.value);
			 
			const rectEl = document.getElementById('template_'+i).getElementsByTagName('rect');
			for(const el of rectEl) {
				el.addEventListener('mouseover', (event) => {
					const target = event.target;
					const tooltip = target.parentElement.parentElement.previousElementSibling;
					
					const tQuery = $(tooltip);
					tQuery.css('visibility', 'visible')
					
					const positionLeft = Number(target.getAttribute('x')) + Number(x.bandwidth()/2) - tooltip.clientWidth/2;
					const positionTop = height - margin.top - target.getAttribute('height') - tooltip.clientHeight - 5;
					const color = target.dataset.color;
					const value = target.dataset.y;
					const key = target.dataset.x;
					
					tQuery.empty();
					var tQueryTemplate = '';
					
					tQueryTemplate += '<div class="tooltip_text">';
					tQueryTemplate += '<p>freq</p>';
					tQueryTemplate += '<p>key : ' + key + '</p>';
					tQueryTemplate += '<p>count : ' + value + '</p>';
					tQueryTemplate += '</div>';
					
					
						
					tQuery.append(tQueryTemplate)
					tooltip.style.top = positionTop + 'px';
					tooltip.style.left = positionLeft + 'px';
					tooltip.style.opacity = 1;
				});
				el.addEventListener('mouseout', (event) => {
					const target = event.target;
					const tooltip = target.parentElement.parentElement.previousElementSibling;
					
					$(tooltip).css('visibility', 'hidden')
				});
			}
		}
	};
}
	
BasicStatisticsDialogUI.prototype._createGrid = function(data, rowNames) {
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
//			columnOptions : {minWidth : 200}, 
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
