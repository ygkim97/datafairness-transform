Number.prototype.numberWithCommas = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// for window resize event.
var _EIDialogUI = null;
var OBJ = {
		columns : [],
		setting : {
			columnId : null,
			columnName : null,
			columnType : null,
			indexId : null,
			indexName : null,
			testIndex : null,
			correctedIndex : null,
			testIndexName : null,
			correctedIndexName : null,
			wrongCount : 0,
			totalCount_before : 0
		}
}

function EIDialogUI(index, name) {
	OBJ.setting.columnId = index;
	OBJ.setting.columnName = name;
	this._createDialog();
} 

EIDialogUI.prototype._createDialog = function() {
	var self = this;
	this.statData = {};
	
	var frame = $(DOM.loadHTML("core", "scripts/dialogs/evaluation-index-dialog.html"));
	this._elmts = DOM.bind(frame);

	this._level = DialogSystem.showDialog(frame);
	
	// btn setting
	this._elmts.closeButton.html($.i18n('core-buttons/close'));
	this._elmts.closeButton.click(function() {
		self._dismiss();
		Refine.OpenProjectUI.prototype._addTagFilter()
	});

	// title setting
	var title = $('<h5>').text($.i18n('core-index-dialog-ei/title'));
	
	this._elmts.ei_prev.text($.i18n('core-index-dialog-ei/next-prev-btn-'+2));
	this._elmts.ei_next.text($.i18n('core-index-dialog-ei/next-prev-btn-'+1));
	
	$('#ei_dialog #graph-title').append(title);
	
	this._setNavigators();
	this._setCard1();
}
EIDialogUI.prototype._setNavigators = function() {
	// set navigator divs
	this._elmts.navi_item1.html($.i18n('core-index-dialog-ei/navi1'));
	this._elmts.navi_item2.html($.i18n('core-index-dialog-ei/navi2'));
	this._elmts.navi_item3.html($.i18n('core-index-dialog-ei/navi3'));
	this._elmts.navi_item4.html($.i18n('core-index-dialog-ei/navi4'));
	
	// set btns
	const $div1 = $('#ei_card1');
	const $div2 = $('#ei_card2');
	const $div3 = $('#ei_card3');
	const $div4 = $('#ei_card4');
	
	const $next = $('#ei_next');
	const $prev = $('#ei_prev');
	
    var currentDiv = 1;
    
    const naviItems = $('.navi-item');
    
	$('#ei_next').click((e) => {
		nextDiv = currentDiv + 1;
		if (nextDiv == 2) {
			// go to next
			const checked = $('.evaluation_index input[type="radio"]:checked');
			
			if (checked.parent().parent().parent().attr('data-available') == 'false') {
				alert($.i18n('core-index-data-ei/not-available-btn'));
				return;
			}
			
			OBJ.setting.indexId = checked.attr('data-id');
			
			if (checked.length == 0) {
				alert($.i18n('core-index-dialog-ei/no-selected-evaluation-index'));
				return;
			}
		}
		if (nextDiv == 2) {
			this._setCard2();
			
			$div1.toggle('slide', {direction: 'left'}, 'slow');
			$div2.toggle('slide', {direction: 'right'}, 'slow');
		} else if (nextDiv == 3) {
			this._saveCard2Data();
			this._setCard3();
			
			$div2.toggle('slide', {direction: 'left'}, 'slow');
		    $div3.toggle('slide', {direction: 'right'}, 'slow');
		} else if (nextDiv == 4) {
			this._setCorrectedData();
			this._setCard4();
			
			$div3.toggle('slide', {direction: 'left'}, 'slow');
		    $div4.toggle('slide', {direction: 'right'}, 'slow');
		}
		currentDiv = nextDiv;
		
		// set navi-item active class 
		naviItems.removeClass('active');
		$(naviItems[currentDiv-1]).addClass('active');
		
		// set prev, next btn 
		$prev.show();
		if (currentDiv == 4) {
			$next.hide();
		} else {
			$next.show();
		}
	});
	$('#ei_prev').click((e) => {
		nextDiv = currentDiv - 1;

		if (nextDiv == 3) {
			$div3.toggle('slide', {direction: 'left'}, 'slow');
			$div4.toggle('slide', {direction: 'right'}, 'slow');
		} else if (nextDiv == 2) { 
		    $div2.toggle('slide', {direction: 'left'}, 'slow');
		    $div3.toggle('slide', {direction: 'right'}, 'slow');
		} else if (nextDiv == 1) { 
			$div1.toggle('slide', {direction: 'left'}, 'slow');
			$div2.toggle('slide', {direction: 'right'}, 'slow');
		}
		currentDiv = nextDiv;
		
		// set navi-item active class
		naviItems.removeClass('active');
		$(naviItems[currentDiv-1]).addClass('active');

		// set prev, next btn 
		$next.show();
		if (currentDiv == 1) {
			$prev.hide();
		} else {
			$prev.show();
		}
	});
}
EIDialogUI.prototype._setCard1 = function() {
	var labelList = getEvaluationIndex().properties;
	
	var lineMax = 4;
	
	var template = '';
	template += '<table class="card1-table">';	
	template += '<tr>';
	
	const ei_wrap = this._elmts.ei_card1.empty();
	
	labelList.forEach((li, i)=>{
		if (i == lineMax) {
			template += '<tr>';
		}
		
		template += '<td class="evaluation_index" data-available="'+li.isAvailable+'">';
		template += '<div>';
		template += '<div class="id">';
		template += '<input type="radio" name="ei_radio" class="radio" data-id="'+li.id+'"/>';
		template += '<label>';
		template += li.text;
		template += '</label>';
		template += '</div>';
		template += '<div class="desc">';
		template += li.desc;
		template += '</div>';
		template += '</div>';
		template += '</td>';
	});
	template += '</tr>';
	template += '</table>';
	
	ei_wrap.append(template);
	
	$('td.evaluation_index').click((e)=>{
		const el = $(e.target);
		
		if (el[0].tagName.toLowerCase() == 'td' ) {
//			if (el.attr('data-available') == 'false') {
//				alert($.i18n('core-index-data-ei/not-available-btn'));
//				e.preventDefault();
//			} else {
				$('.evaluation_index').removeClass('active');		
				$(e.target).addClass('active');
				$(e.target).find('input').click();
//			}
		}
	})
}

/**
 * create DIV Tag
 * @param text : div Text
 * @param descText : desc Text
 * @param _class : if you add special class, use this.
 * @returns
 */
function createDIV(text, descText, _class) {
	var divTemplate = '';
	
	divTemplate += '<div class="ei-items '+(_class == undefined ? '' : _class)+'">';
	divTemplate += '<span>' + text + '</span>';
	
	if (descText != undefined) {
		divTemplate += '<span class="desc"><i class="fas fa-asterisk"></i>' + descText + '</span>';
	}
	divTemplate += '</div>';
	
	return divTemplate;
}

/**
 * create SELECT BOX Tag
 * @param list : array. option list
 * @param selectId : select box id
 * @param descText : desc Text
 * @param _class : if you add special class, use this.
 * @returns
 */
function addSELECT(self, list, selectId, descText, _class) {
	var selectTemplate = '';
	const parent = $('select#'+selectId).empty();
	
	list.forEach((l) => {
		selectTemplate += '<option value="'+l.id+'" text="'+l.text+'">';
		selectTemplate += '<span>';
		selectTemplate += l.text;
		selectTemplate += '</span>';
		selectTemplate += '</option>';
	})
	
	parent.append(selectTemplate);
	if (descText != undefined) {
		self._elmts[selectId + '_desc'].html('<i class="fas fa-asterisk"></i>' + descText);
	}
}
/**
 * set SETTING Card.
 */
EIDialogUI.prototype._setCard2 = function() {
	OBJ.columns = [];
	
	// set setting page
	const indexProperty = getEvaluationIndexById();
	const settingProperty = indexProperty.setting;
	const descProperty = getDescPropertyByIndex();
	
	OBJ.setting.indexName = indexProperty.text;

	this._elmts.column_name.text($.i18n('core-index-data-ei/left-title-column-name'));
	this._elmts.evaluation_index.text($.i18n('core-index-data-ei/left-title-evaluation-index'));
	this._elmts.test_column.text($.i18n('core-index-data-ei/left-title-test-column'));
	this._elmts.corrected_column.text($.i18n('core-index-data-ei/left-title-corrected-column'));
	
	$('span[name="column_name_value"]').text(OBJ.setting.columnName);
	$('span[name="index_name"]').text(OBJ.setting.indexName);
	this._elmts.index_name_desc.html('<i class="fas fa-asterisk"></i>' + descProperty.indexId);
	
	// set settting
	addSELECT(this, settingProperty.test_items, 'testIndex', descProperty.testIndex);
	addSELECT(this, settingProperty.quality_correction_items, 'correctedIndex', descProperty.correctedIndex);
}
/**
 * save SETTING Card data.
 */
EIDialogUI.prototype._saveCard2Data = function() {
	// save Test Column
	const testIndex = $('select#testIndex option:selected');
	OBJ.setting.testIndex = testIndex.val();
	OBJ.setting.testIndexName = testIndex.text();
	
	// save corrected Column
	const correctedIndex = $('select#correctedIndex option:selected');
	OBJ.setting.correctedIndex = correctedIndex.val();
	OBJ.setting.correctedIndexName = correctedIndex.text();
}

/**
 * set Evaluation Index Card.
 */
EIDialogUI.prototype._setCard3 = function() {
	// reset grid div
	this._elmts.card3_grid.empty();
	this._elmts.card3_notice_wrap.show();
	
	// set setting page
	this._elmts.setting_title.text($.i18n('core-index-data-ei/left-title-setting'));
	this._elmts.quality_score.text($.i18n('core-index-data-ei/left-title-quality-score'));
	this._elmts.grid_notice.text($.i18n('core-index-data-ei/grid-notice'));
	
	$('span[name="column_name_value"]').text(OBJ.setting.columnName);
	$('span[name="index_name"]').text(OBJ.setting.indexName);
	$('span[name="test_column"]').text(OBJ.setting.testIndexName);

	// get data
	const columnData = this._getTestData();
	var per = getPer(columnData.rightCount, columnData.totalCount);
	
	// 초기값일때만 값을 저장한다.
	// 만약 페이지 이동으로 다시 card3에 진입한 경우, 값을 저장하지 않는다. (고유값으로 유지 필요)
	if (OBJ.setting.wrongCount == 0) {
		OBJ.setting.wrongCount = columnData.wrongCount;
		OBJ.setting.totalCount_before = columnData.totalCount;
	}
	
	this._elmts.ei_total_per.text(per + '%');
	this._elmts.ei_total_title.text($.i18n('core-index-data-ei/quality-total-cnt'))
	this._elmts.ei_right_title.text($.i18n('core-index-data-ei/quality-right-cnt'))
	this._elmts.ei_wrong_title.text($.i18n('core-index-data-ei/quality-wrong-cnt'))
	
	this._elmts.ei_total_value.text(columnData.totalCount.numberWithCommas());
	this._elmts.ei_right_value.text(columnData.rightCount.numberWithCommas());
	this._elmts.ei_wrong_value.text(columnData.wrongCount.numberWithCommas());
	
	const data = [
		{name : columnData.rText, value : per},
		{name : columnData.wText, value : Number((100-per).toFixed(2))}
	]
	
	// ei-right에 chart를 그린다.
	this._createPieChart('card3_pie_chart', data);
}
/**
 * set correcteding Card.
 */
EIDialogUI.prototype._setCard4 = function() {
	// set setting page
	this._elmts.editing_title.text($.i18n('core-index-data-ei/left-title-editing'));
	this._elmts.editing_score.text($.i18n('core-index-data-ei/left-title-editing-score'));

	$('span[name="column_name_value"]').text(OBJ.setting.columnName);
	$('span[name="index_name"]').text(OBJ.setting.indexName);
	$('span[name="test_column"]').text(OBJ.setting.testIndexName);
	$('span[name="corrected_column"]').text(OBJ.setting.correctedIndexName);
	
	this._elmts.export_iris_Legend.text($.i18n('core-index-data-ei/export-title'));
	this._elmts.index_columnName_label.text($.i18n('core-index-data-ei/export-iris-index-column-name') + ':');
	this._elmts.date_columnName_label.text($.i18n('core-index-data-ei/export-iris-date-column-name') + ':');
	this._elmts.tableName_label.text($.i18n('core-index-data-ei/export-iris-table-name') + ':');
	
	// get data
	const columnData = this._getTestData();
	
	var per = getPer(columnData.rightCount, columnData.totalCount)
	
	this._elmts.ei_editing_total_per.text(per + '%');
	this._elmts.ei_editing_total_title.text($.i18n('core-index-data-ei/quality-total-cnt'))
	this._elmts.ei_editing_count_title.text($.i18n('core-index-data-ei/editing-count-cnt'))
	this._elmts.ei_editing_after_title.text($.i18n('core-index-data-ei/editing-after-cnt'))
	
	this._elmts.ei_editing_total_value.text(OBJ.setting.totalCount_before.numberWithCommas());
	this._elmts.ei_editing_count_value.text(OBJ.setting.wrongCount.numberWithCommas());
	this._elmts.ei_editing_after_value.text(columnData.totalCount.numberWithCommas());
	
	const data = [
		{name : columnData.rText, value : per},
		{name : columnData.wText, value : Number((100-per).toFixed(2))}
	]

	// ei-right에 chart를 그린다.
	this._createPieChart('card4_pie_chart', data);
	
	const _self = this;
	this._elmts.save_iris.text($.i18n('core-buttons/save-iris'));
	this._elmts.save_iris.click(function() {
		_self._setSaveToIris();
	});
}
function getPer(rightCnt, totalCnt) {
	const val1 = (rightCnt/totalCnt*100).toFixed(10);
	const cnt = Math.floor(val1*100)/100
	return cnt;
}
EIDialogUI.prototype._createPieChart = function(parentId, data) {
	// create chart
	const self = this;
	
	$('#'+parentId).empty();
	$('#'+parentId+'_legend').empty();
	
	const w = 250;
	const h = 250;
	
	var svg = d3.select('#'+parentId)
	.append('svg')
	.attr('id', parentId+'_svg')
	.attr('width', w)
	.attr('height', h)
	.style('width', w)
	.style('height', h)
	.style('pointer-events', 'all')
	
	var center = w / 2;
	var outerRadius = 110;
	var innerRadius = 0;
	
	const pie = d3.pie()
	  .sort(null)
	  .value(d => d.value);
	
	var arc = d3.arc()
	    .innerRadius(innerRadius)
	    .outerRadius(outerRadius);

	const color = d3.scaleOrdinal()
	.domain(data.map(d => d.name))
	.range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
	
	const arcs = pie(data);
	const arcLabel = ()=>{
		const radius = Math.min(w, h) / 2 * 0.8;
		return d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
	}
	const path_g = svg.append("g")
	.attr("class", "outter-arc")
	.attr("transform", "translate(" + center + ", " + center + ")")
	
	if (parentId.indexOf('card3') > -1) {
		path_g
		.selectAll("g.path")
		.data(arcs)
		.join("path")
		.attr('id', (d, i)=> 'path_id_'+i)
		.attr('class', 'real-path')
		.attr("fill", d => color(d.data.name))
		.attr("d", arc)
		.on('mouseover', function (d){
			const _this = $(this)
			const _parent = _this.parent();
			
			const children = _parent.children();
			_parent.children().remove();
			children.each((i, c)=>{
				if(c.id ==_this[0].id) {
					_parent.append(c);
				} else {
					_parent.prepend(c);
				}
			})
			
			$(this)[0].classList.add('ei-selected')
		})
		.on('mouseout', function(){
			$(this)[0].classList.remove('ei-selected')
		})		 
		.on('click', function (d){
			self._setCard3Row(d.data.name);
		})
		.append("title")
		.text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);	
	} else {
		path_g
		.selectAll("g.path")
		.data(arcs)
		.join("path")
		.attr('id', (d, i)=> 'path_id_'+i)
		.attr('class', 'real-path')
		.attr("fill", d => color(d.data.name))
		.attr("d", arc)
		.on('mouseover', function (d){
			const _this = $(this)
			const _parent = _this.parent();
			
			const children = _parent.children();
			_parent.children().remove();
			children.each((i, c)=>{
				if(c.id ==_this[0].id) {
					_parent.append(c);
				} else {
					_parent.prepend(c);
				}
			})
			
			$(this)[0].classList.add('ei-selected')
		})
		.on('mouseout', function(){
			$(this)[0].classList.remove('ei-selected')
		})		 
		.append("title")
		.text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);	
	}
	
	 // create chart legend
	 const legendW = 360;
	 const legendH = 20;
	      
	 var svg2 = d3.select('#'+parentId+'_legend')
	 .append('svg')
	 .attr('id', parentId+'_svg')
	 .attr('width', legendW)
	 .attr('height', legendH)
	 .style('pointer-events', 'all')
	 .style('class', 'pie-chart-legend')
		
	 const circleG = svg2.append('g');
	 const textG = svg2.append('g');
	 var cx = 0;
	 var cy = 0;
	 var circleW = 20;
	 var dH = 200;
	 
	 data.forEach((d, i)=> {
		 if (i%2 == 0) {
			 // 1번째
			cx = 10;
			cy = (10*i)+(10*(i+1));
		 } else {
			 // 2번째
			 cx = dH;
		 }
		 
		 circleG.append("circle")
		 .attr("cx", cx)
		 .attr("cy", cy)
		 .attr("r", 6)
		 .style("fill", color(d.name))
		 .attr("data-name",d.name)
		 .attr("data-value",d.value)	 
		 
		 var _text = textG.append("text")
		 .attr("x", cx+circleW)
		 .attr("y", cy)
		 .text(d.name + '(' + d.value + '%)')
		 .attr("alignment-baseline","middle")
		 .attr("data-name",d.name)
		 .attr("data-value",d.value)
		 
		 
		 if (parentId.indexOf('card3') > -1) {
			 _text
			 .attr('class', 'clickable-text')
			 .on('click', function (d){
				 const name = $(this).attr('data-name');
				 const value = $(this).attr('data-value');
				 
				 self._setCard3Row(name);
			 });
		 }
	 })
}
EIDialogUI.prototype._getGridBody = function(type) {
	var valueType = null;
	var blankPosition = null;
	var reverse = null;
	var valueType = null;
	
	if (OBJ.setting.columnType == 'int' || OBJ.setting.columnType == 'double') {
		valueType = 'number';
		reverse = true;
		if (type == 'NULL') {
			blankPosition = 2;
		} else {
			blankPosition = -1;
		}
	} else {
		valueType = 'string';
		blankPosition = -1;
		if (type == 'NULL') {
			reverse = true;
		} else {
			reverse = false;
		}
	}
	
	var sorting = {
		"criteria":
			[{
				"column":OBJ.setting.columnName,
				"valueType": valueType,
				"reverse":reverse,
				"blankPosition":blankPosition,
				"errorPosition":1,
				"caseSensitive":false
			}]
	}
	const engin = {"facets":[],"mode":"record-based"};
	return {
		engine: JSON.stringify(engin),
		sorting: JSON.stringify(sorting) 
	};
}
EIDialogUI.prototype._getTestData = function() {
	const warningDialog1 = DialogSystem.showBusy();
	var response = null;
	
	$.ajax({
		type : 'POST',
		url : "command/core/get-evaluation-index-test?" + $.param({ project: UI_CHART_INFO.selectedPId}),
		data : {
			columnId : OBJ.setting.columnId,
			indexId : OBJ.setting.indexId,
			testIndex : OBJ.setting.testIndex
		},
		async : false,
		success : function(data) {
			warningDialog1();
			response = data.testResultObj;
			OBJ.setting.columnType = data.columnType;
		}
	})
	return response;
}
EIDialogUI.prototype._setCard3Row = function(type) {
	const body = this._getGridBody(type);
	
	const _self = this
	
	function getRowsApi() {
		$.post(
				"command/core/get-rows?" + $.param({ project: UI_CHART_INFO.selectedPId, start: 0, limit: 50 }),
				body,
				function(data) {
					_self._createSelectRowGrid(data.rows);
				},
				"json"
		);
	}
	// get models
	$.getJSON("command/core/get-project-metadata?" + $.param({ project: UI_CHART_INFO.selectedPId }), null,
		function(data) {
			if (data.status == "error") {
				alert(data.message);
			} else {
				if (OBJ.columns.length == 0) {
					$.getJSON(
							"command/core/get-models?" + $.param({ project: UI_CHART_INFO.selectedPId }), null,
							function(data) {
								if (data.columnModel.columns.length > 5) {
									if (Number(OBJ.setting.columnId) -2 < 0) {
										OBJ.columns = data.columnModel.columns.slice(0, 5);
									} else if (OBJ.setting.columnId + 3 > data.columnModel.columns.length ) {
										OBJ.columns = data.columnModel.columns.slice(data.columnModel.columns.length-5, data.columnModel.columns.length);
									} else {
										OBJ.columns = data.columnModel.columns.slice(OBJ.setting.columnId-2, OBJ.setting.columnId+3);
									}
								} else {
									OBJ.columns = data.columnModel.columns;
								}
								getRowsApi();
							},
							'json'
					);
				} else {
					getRowsApi();
				}
			}
		},
	'json'
	);
}

EIDialogUI.prototype._createSelectRowGrid = function(data) {
	var template = '';
	template += '<table class="card3-table">';
	
	// table header
	template += '<thead>';
	template += '<tr>';
	OBJ.columns.forEach((c)=>{
		template += '<th>';
		template += c.name;
		template += '</th>';
	});
	template += '</tr>';
	template += '</thead>';
	
	// table rows
	template += '<tbody>';
	data.forEach((d)=>{
		template += '<tr>';
		
		OBJ.columns.forEach((c)=>{
			template += '<td>';
			template += d.cells[c.cellIndex] == null ? '' : d.cells[c.cellIndex].v;
			template += '</td>';
		})
		template += '</tr>';
	})
	
	template += '</tbody>';
	template += '</table>';
	
	this._elmts.card3_notice_wrap.hide();
	const rowGrid = this._elmts.card3_grid.empty();
	rowGrid.append(template);
}
EIDialogUI.prototype._setCorrectedData = function() {
	const warningDialog1 = DialogSystem.showBusy();
	
    const resp = Refine.wrapCSRFAsync(function(token) {
    	var response = null;
    	$.ajax({
    		type : 'POST',
    		url : "command/core/set-evaluation-index-corrected?" + $.param({
				project: UI_CHART_INFO.selectedPId,
    			columnId : OBJ.setting.columnId,
    			indexId : OBJ.setting.indexId,
    			correctedIndex : OBJ.setting.correctedIndex,
    			operations : 'deleteNull', 
    			columnName : OBJ.setting.columnName,
	            csrf_token: token
    		}),
    		async : false,
    		success : function(data) {
    			// get response by chartTypes
    			warningDialog1();
    			response = JSON.parse(data).code;
    		}
    	})
    	return response;
    });
}
EIDialogUI.prototype._setSaveToIris = function() {
	const irisKey = this._elmts.indexColumnName.val();
	const irisDateKey = this._elmts.dateColumnName.val();
	const tableName = this._elmts.tableName.val()
	
	// value check
	if (irisKey == '' || irisDateKey == '' || tableName == '') {
		alert('no data')
		return;
	}
	var options = {
			iris  : true,
			irisKey : irisKey,	// INDEX COLUMN
			irisDateKey : irisDateKey,	// 
			tableName : tableName,
			columns : ''
	};
	
	const _self = this;
	const warningDialog1 = DialogSystem.showBusy();
	
	setTimeout(()=>{
		$.ajax({
			type : 'POST',
			url : "command/core/export-rows?" + $.param({
				'options' : JSON.stringify(options),
				'encoding' :"UTF-8",
				'format' : "sql",
				'preview' : false,
				'project' : UI_CHART_INFO.selectedPId
			}),
			async : false,
			success : function(data) {
				alert($.i18n('core-index-data-ei/saved-project-iris'));
			}, error: function(data) {
				// alread exist table name
				if (data.statusText.indexOf('already exists') > -1) {
					alert('[' + tableName + '] ' + $.i18n('core-index-data-ei/export-already-exist-table-name'));
				} else if (data.statusText.indexOf('Invalid Partition Time') > -1) {
					alert('[' + irisDateKey + '] ' + $.i18n('core-index-data-ei/export-invalid_time_column'));
				} else if (data.statusText.indexOf('PARTITIONKEY column') > -1) {
					alert('[' + irisKey + '] ' + $.i18n('core-index-data-ei/export-invalid_index_column'));
				}
			}, complete : function() {
				warningDialog1();
			}
		});
	}, 10);
}

// when close Dialog 
EIDialogUI.prototype._dismiss = function() {
	this.statData = {};
	_EIDialogUI = null;
	
	DialogSystem.dismissUntil(this._level - 1);
};

function getEvaluationIndexById() {
	return getEvaluationIndex().properties.find((e)=>{
		return e.id == OBJ.setting.indexId
	})
}
function getDescPropertyByIndex() {
	return getEvaluationIndex().desc;
}
function getEvaluationIndex() {
	return {
		"desc" : {
			"indexId" : "측정하고자 하는 품질 지표를 선택합니다.",
			"testIndex" : "시험 항목을 선택합니다.",
			"correctedIndex" : "데이터 품질 보정 알고리즘을 선택합니다.",
		},
		"properties": [
		{
			"isAvailable" : false,
			"id": "ACCURACY",
			"text": "정확성",
			"desc": "구문 데이터 정확성, 의미 데이터 정확성, 데이터 세트의 부정확성의 위험, 데이터 범위 정확성등을 측정합니다."
		},
		{
			"isAvailable" : true,
			"id": "COMPLETENESS",
			"text": "완전성",
			"desc": "기록 완정성, 데이터 값 완정성 등을 측정합니다.",
			"setting": {
				"test_items": [
					{
						"id": "ACCURACY_RECORD",
						"text": "기록의 완전성"
					}
				],
				"quality_correction_items": [
					{
						"id": "REMOVE_NULL",
						"text": "NULL 데이터 삭제"
					}
				]
			}
		},
		{
			"isAvailable" : false,
			"id": "CONSISTENCY",
			"text": "일관성",
			"desc": "참조 무결성, 데이터 불일치의 위험, 의미론적 일관성 등을 측정합니다."
		},
		{
			"isAvailable" : false,
			"id": "PRESENT",
			"text": "현재성",
			"desc": "업데이트 주기와 조건에 맞게 업데이트 요청이 있는 정보 아이템의 비율을 측정합니다."
		},
		{
			"isAvailable" : false,
			"id": "COMPLIANCE",
			"text": "준수성",
			"desc": "표준, 협약 또는 규정에 부합하는 데이터 아이템의 비율을 측정합니다."
		},
		{
			"isAvailable" : false,
			"id": "PRECISION",
			"text": "정밀성",
			"desc": "명세서의 정밀도를 만족하는 데이터 값의 비율을 측정합니다."
		},
		{
			"isAvailable" : false,
			"id": "TRACEABILITY",
			"text": "추적성",
			"desc": "요청된 접근 추적성 값이 존재하는 데이터 값의 비율을 측정합니다."
		},
		{
			"isAvailable" : false,
			"id": "UNDERSTANDING",
			"text": "이해성",
			"desc": "이해 가능한 기호로 표시되는데이터  값의 비율을 측정합니다."
		}
	]}
}