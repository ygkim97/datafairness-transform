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
			testIndexName : null,
			correctedIndex : null,
			correctedIndexName : null,
			wrongCount : 0,
			totalCount_before : 0,
			propertyType : null,
			correctedObj : {}
		}
}
// Dialog-card1 Index Table max row count.
const INDEX_TABLE_MAX_ROW = 4;

// call API ("get-rows") need limit.
const MAX_RECORD_COUNT = 100000000;

function EIDialogUI(index, name, projectRowsRefresh) {
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
	
	// reset
	OBJ.columns = [];
	
	$('#ei_dialog #graph-title').append(title);
	
	this._setNavigators();
	this._setCard1();
}
EIDialogUI.prototype._setNavigators = function() {
	// set navigator divs text
	this._elmts.navi_item1.html($.i18n('core-index-dialog-ei/navi1'));
	this._elmts.navi_item2.html($.i18n('core-index-dialog-ei/navi2'));
	this._elmts.navi_item3.html($.i18n('core-index-dialog-ei/navi3'));
	this._elmts.navi_item4.html($.i18n('core-index-dialog-ei/navi4'));
	
	// cards
	const $div1 = $('#ei_card1');
	const $div2 = $('#ei_card2');
	const $div3 = $('#ei_card3');
	const $div4 = $('#ei_card4');
	
	// btns
	const $next = $('#ei_next');
	const $prev = $('#ei_prev');
	
	// slider variable
	let p1 = null;
	let p2 = null;
	
    var currentDiv = 1;
    
    const naviItems = $('.navi-item');

    // when next btn click,
	$('#ei_next').click((e) => {
		// prevent dbl click
		$(this).blur();
		
		// set next/prev btn disable
		var resp = setNaviBtnStatus(true);
		
		nextDiv = currentDiv + 1;
		
		// when go to page2
		if (nextDiv == 2) {
			// go to next
			const checked = $('.evaluation_index input[type="radio"]:checked');

			// checked Item, not available
			if (checked.parent().parent().parent().attr('data-available') == 'false') {
				setNaviBtnStatus(false);
				alert($.i18n('core-index-data-ei/not-available-btn'));
				return;
			}
			
			// no checked 'Evaluation Index' view alert.
			if (checked.length == 0) {
				setNaviBtnStatus(false);
				alert($.i18n('core-index-dialog-ei/no-selected-evaluation-index'));
				return;
			}
			
			const newIndexId = checked.attr('data-id');
			if (OBJ.setting.indexId !== newIndexId) {
				OBJ.setting.correctedIndex = null;
				OBJ.setting.correctedIndexName = null;
				OBJ.setting.testIndex = null;
				OBJ.setting.testIndexName = null;
				OBJ.setting.correctedObj = null;
			}
			OBJ.setting.indexId = checked.attr('data-id');
			
			this._setCard2();
			
			p1 = $div1.toggle('slide', {direction: 'left'}).promise();
			p2 = $div2.toggle('slide', {direction: 'right'}).promise();
		} else if (nextDiv == 3) {
			this._saveCard2Data();
			const response = this._setCard3();
			
			if (response === 'failed') {
				setNaviBtnStatus(false);
				alert($.i18n('core-index-data-ei/fail-load-result'))
				return;
			}			
			p1 = $div2.toggle('slide', {direction: 'left'}).promise();
			p2 = $div3.toggle('slide', {direction: 'right'}).promise();
		} else if (nextDiv == 4) {
			const answer = window.prompt('['+OBJ.setting.correctedIndexName+'] ' + $.i18n('core-index-data-ei/confirm-execute'));
			
			// No input, click cancel 
			if (answer == null || answer =='' || answer == undefined) {
				setNaviBtnStatus(false);
				return;
			}
			// input something, but is not 'y' or 'yes'
			if (!(answer.trim().toLowerCase() == 'yes' || answer.trim().toLowerCase() == 'y')) {
				setNaviBtnStatus(false);
				return;
			}
			
			this._setCorrectedData();
			this._setCard4();
			
			p1 = $div3.toggle('slide', {direction: 'left'}).promise();
			p2 = $div4.toggle('slide', {direction: 'right'}).promise();
		}
		
		currentDiv = nextDiv;
		
		// when finished page slide, set btn acitve.
		$.when(p1, p2).then(_=>{
			// set navi-item active class 
			naviItems.removeClass('active');
			$('.navi-arrows').removeClass('active');
			
			const naviItem = $(naviItems[currentDiv-1]);
			naviItem.addClass('active');
			$(naviItem[0].nextElementSibling).addClass('active');
			
			// set prev, next btn 
			$prev.attr('disabled', false);
			$prev.removeClass('btn-hide');
			
			if (currentDiv == 4) {
				$next.attr('disabled', true);
				$next.addClass('btn-hide');
				$prev.attr('disabled', true);
				$prev.addClass('btn-hide');
			} else {
				$next.attr('disabled', false);
				$next.removeClass('btn-hide');
			}
		})
		
	});
    
	$('#ei_prev').click((e) => {
		$(this).blur();
		setNaviBtnStatus(true);
		
		nextDiv = currentDiv - 1;

		if (nextDiv == 3) {
			p1 = $div3.toggle('slide', {direction: 'left'}).promise();
			p2 = $div4.toggle('slide', {direction: 'right'}).promise();
		} else if (nextDiv == 2) { 
			p1 = $div2.toggle('slide', {direction: 'left'}).promise();
			p2 = $div3.toggle('slide', {direction: 'right'}).promise();
		} else if (nextDiv == 1) { 
			p1 = $div1.toggle('slide', {direction: 'left'}).promise();
			p2 = $div2.toggle('slide', {direction: 'right'}).promise();
		}
		currentDiv = nextDiv;
		
		// when finished page slide, set btn acitve.
		$.when(p1, p2).then(_=>{
			// set navi-item active class
			naviItems.removeClass('active');
			$('.navi-arrows').removeClass('active');
			
			const naviItem = $(naviItems[currentDiv-1]);
			naviItem.addClass('active');
			$(naviItem[0].nextElementSibling).addClass('active');
			
			// set prev, next btn 
			$next.attr('disabled', false);
			$next.removeClass('btn-hide');
			
			if (currentDiv == 1) {
				$prev.attr('disabled', true);
				$prev.addClass('btn-hide');
			} else {
				$prev.attr('disabled', false);
				$prev.removeClass('btn-hide');
			}
		})
		
	});
}

// btn setting
function setNaviBtnStatus(bool) {
	$('#ei_prev').attr('disabled',bool);
	$('#ei_next').attr('disabled',bool);	
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
	
	if (list != undefined) {
		list.forEach((l) => {
			selectTemplate += '<option value="'+l.id+'" text="'+l.text+'">';
			selectTemplate += '<span>';
			selectTemplate += l.text;
			selectTemplate += '</span>';
			selectTemplate += '</option>';
		})
	}
	parent.append(selectTemplate);
	if (descText != undefined) {
		self._elmts[selectId + '_desc'].html('<i class="fas fa-asterisk"></i>' + descText);
	}
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
		.attr("fill", d => d.data.color)
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
			self._getCard3Row(d.data.name, 50, true);
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
		.attr("fill", d => d.data.color)
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
	 const legendH = 30;
	      
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
			 // i+1
			 cx = 10;
		 } else {
			 // i
			 cx = dH;
		 }
		 cy = parseInt(i/2) * 30;
		 cy = cy + 10;

		 circleG.append("circle")
		 .attr("cx", cx)
		 .attr("cy", cy)
		 .attr("r", 6)
		 .style("fill", d.color)
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
				 self._getCard3Row($(this).attr('data-name'))
			 });
		 }
	 })
}
EIDialogUI.prototype._getGridBody = function(type) {
	var selectBlank = false;
	var selection = [];
	var expression = null;
	
	if (OBJ.setting.indexId == 'ACCURACY') {
		expression = 'if(value.toDate("'+getExtraPropertyVal()+'")=="Unable to convert to a date", "WRONG FORMAT", "DATE")'
			
		if (type == 'passed') {
			// 날짜
			selection = [{"v":{"v":"DATE","l":"DATE"}}];
			
		} else {
			// 날짜인데 포멧이 안맞음
			selection = [{"v":{"v":"WRONG FORMAT","l":"WRONG FORMAT"}}];
		}
			
	} else if (OBJ.setting.indexId == 'COMPLETENESS') {
		expression = "isBlank(value)";
		if (type == 'NULL') {
			selectBlank = true;
			selection =[{"v":{"v":true,"l":"true"}}];
		} else {
			selectBlank = false;
			selection =[{"v":{"v":false,"l":"false"}}];
		}
	}
	
	var facet = [{
			"type":"list",
			"name":OBJ.setting.columnName,
			"columnName":OBJ.setting.columnName,
			"expression": expression,
			"omitBlank":false,
			"omitError":false,
			"selection":selection,
			"selectBlank":selectBlank,
			"selectError":false,
			"invert":false
	}];

	const engin = {"facets":facet,"mode":"row-based"};
	return {
		engine: JSON.stringify(engin),
		sorting: JSON.stringify({"criteria":[]}) 
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
			testIndex : OBJ.setting.testIndex,
			property : getExtraPropertyVal()
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
EIDialogUI.prototype._getCard3Row = function(type, limit, createGrid) {
	const _self = this
	const body = this._getGridBody(type);
	var response = null;
	
	$.ajax({
		type : 'POST',
		url : "command/core/get-rows?" + $.param({ project: UI_CHART_INFO.selectedPId, start: 0, limit: limit }),
		data : body,
		async : false,
		success : function(data) {
			response = data;
			if (createGrid) {
				_self._createSelectRowGrid(data.rows);
			}
		}
	});
	return response;
}
EIDialogUI.prototype._getModelInfo = function(type) {
	const _self = this
	// get models
	$.getJSON("command/core/get-project-metadata?" + $.param({ project: UI_CHART_INFO.selectedPId }), null,
		function(data) {
			if (data.status == "error") {
				alert(data.message);
			} else {
				$.getJSON(
						"command/core/get-models?" + $.param({ project: UI_CHART_INFO.selectedPId }), null,
						function(data) {
							OBJ.columns = data.columnModel.columns;
						},
						'json'
				);
			}
		},
	'json'
	);
}

EIDialogUI.prototype._getSlicedColumns = function() {
	if (OBJ.columns.length > 5) {
		if (Number(OBJ.setting.columnId) -2 < 0) {
			return OBJ.columns.slice(0, 5);
		} else if (OBJ.setting.columnId + 3 > OBJ.columns.length ) {
			return OBJ.columns.slice(OBJ.columns.length-5, OBJ.columns.length);
		} else {
			return OBJ.columns.slice(OBJ.setting.columnId-2, OBJ.setting.columnId+3);
		}
	} else {
		return OBJ.columns;
	}
}
EIDialogUI.prototype._createSelectRowGrid = function(data) {
	this._elmts.card3_notice_wrap.hide();
	const rowGrid = this._elmts.card3_grid.empty();
	
	var template = '';
	
	if (data.length == 0) {
		template += '<span class="grid-notice">';
		template += $.i18n('core-index-data-ei/grid-notice-no-record');
		template += '</span>';
			
		rowGrid.append(template);
		return;
	}
	
	const columns = this._getSlicedColumns();
	template += '<table class="card3-table">';
	
	// table header
	template += '<thead>';
	template += '<tr>';
	columns.forEach((c)=>{
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
		
		columns.forEach((c)=>{
			template += '<td>';
			template += d.cells[c.cellIndex] == null ? '' : d.cells[c.cellIndex].v;
			template += '</td>';
		})
		template += '</tr>';
	})
	
	template += '</tbody>';
	template += '</table>';
	
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
//    			operations : 'deleteNull', 
    			columnName : OBJ.setting.columnName,
	            csrf_token: token,
	            property : getExtraPropertyVal()
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
function getExtraPropertyVal() {
	if (OBJ.setting.propertyType == 'radio') {
		return $('.sub_properties:checked').val();
	} if (OBJ.setting.propertyType == 'checkbox') {
		var values = [];
		$('.sub_properties:checked').each((i, e)=>{
			values.push($(e).val());
		});
		return values.join(',');
	} else {
		return $('.sub_properties').val();
	}
}

// when close Dialog 
EIDialogUI.prototype._dismiss = function() {
	this.statData = {};
	_EIDialogUI = null;
	
	DialogSystem.dismissUntil(this._level - 1);
	_refreshRows();
};

function getEvaluationIndexPropertiesById() {
	return getEvaluationIndexProperties().properties.find((e)=>{
		return e.id == OBJ.setting.indexId
	})
}
function getDescPropertyByIndex() {
	return getEvaluationIndexProperties().desc;
}