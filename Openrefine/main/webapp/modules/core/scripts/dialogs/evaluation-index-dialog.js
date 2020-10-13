Number.prototype.numberWithCommas = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// for window resize event.
var _EIDialogUI = null;
var OBJ = {
		setting : {
			columnId : null,
			columnName : null,
			indexId : null,
			indexName : null,
			testIndex : null,
			correctedIndex : null,
			testIndexName : null,
			correctedIndexName : null
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
	template += '<table>';	
	template += '<tr>';
	
	const ei_wrap = this._elmts.ei_card1.empty();
	
	labelList.forEach((li, i)=>{
		if (i == lineMax) {
			template += '<tr>';
		}
		template += '<td class="evaluation_index">';
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
			$('.evaluation_index').removeClass('active');		
			$(e.target).addClass('active');
			$(e.target).find('input').click();
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

	list.forEach((l) => {
		selectTemplate += '<option value="'+l.id+'" text="'+l.text+'">';
		selectTemplate += '<span>';
		selectTemplate += l.text;
		selectTemplate += '</span>';
		selectTemplate += '</option>';
	})
	
	$('select#'+selectId).append(selectTemplate);
	if (descText != undefined) {
		self._elmts[selectId + '_desc'].html('<i class="fas fa-asterisk"></i>' + descText);
	}
}
/**
 * set SETTING Card.
 */
EIDialogUI.prototype._setCard2 = function() {
	// set setting page
	const indexProperty = getEvaluationIndexById();
	const settingProperty = indexProperty.setting;
	const descProperty = getDescPropertyByIndex();
	
	OBJ.setting.indexName = indexProperty.text;

	this._elmts.column_name.text($.i18n('core-index-data-ei/left-title-column-name'));
	this._elmts.evaluation_index.text($.i18n('core-index-data-ei/left-title-evaluation-index'));
	this._elmts.test_column.text($.i18n('core-index-data-ei/left-title-test-column'));
//	this._elmts.corrected_column.text($.i18n('core-index-data-ei/left-title-corrected-column'));
	
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
	// set setting page
	this._elmts.setting_title.text($.i18n('core-index-data-ei/left-title-setting'));
	this._elmts.quality_score.text($.i18n('core-index-data-ei/left-title-quality-score'));

	$('span[name="column_name_value"]').text(OBJ.setting.columnName);
	$('span[name="index_name"]').text(OBJ.setting.indexName);
	$('span[name="test_column"]').text(OBJ.setting.testIndexName);
//	$('span[name="corrected_column"]').text(OBJ.setting.correctedIndexName);

	// get data
	const columnData = this._getTestData();
	var per = (columnData.rightCount/columnData.totalCount*100).toFixed(3);
	per = 30;
	this._elmts.ei_total_per.text(per + '%');
	this._elmts.ei_total_title.text($.i18n('core-index-data-ei/left-title-quality-total-cnt'))
	this._elmts.ei_right_title.text($.i18n('core-index-data-ei/left-title-quality-right-cnt'))
	this._elmts.ei_wrong_title.text($.i18n('core-index-data-ei/left-title-quality-wrong-cnt'))
	
	this._elmts.ei_total_value.text(columnData.totalCount.numberWithCommas());
	this._elmts.ei_right_value.text(columnData.rightCount.numberWithCommas());
	this._elmts.ei_wrong_value.text(columnData.wrongCount.numberWithCommas());
	
	const data = [
		{name : columnData.rText, value : per},
		{name : columnData.wText, value : 100-per}
	]
	
	// ei-right에 chart를 그린다.
	this._createPieChart('chard3_pie_chart', data, {});
}
EIDialogUI.prototype._createPieChart = function(parentId, data) {
	
	const self = this;
	
	$('#'+parentId).empty();
	
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
	var outerRadius = 100;
	var innerRadius = 0;
	
	const pie = d3.pie()
	  .sort(null)
	  .value(d => d.value);
	
	var arc = d3.arc()
	    .innerRadius(innerRadius)
	    .outerRadius(outerRadius);

	var arcOutter = d3.arc()
	    .innerRadius(outerRadius)
	    .outerRadius(outerRadius);

	var arcPhantom = d3.arc()
	    .innerRadius(innerRadius)
	    .outerRadius(outerRadius + 20);

	//Set up phantom arc groups
	var phantomArcs = svg.append('g').selectAll("phantom-arc")
	    .data(pie(data))
	    .enter()
	    .append("g")
	    .attr("class", "phantom-arc")
	    .attr("transform", "translate(" + center + ", " + center + ")");

	const color = d3.scaleOrdinal()
	.domain(data.map(d => d.name))
	.range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
	
	const arcs = pie(data);
	const arcLabel = ()=>{
		const radius = Math.min(w, h) / 2 * 0.8;
		return d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
	}
	svg.append("g")
	.attr("class", "outter-arc")
	.attr("transform", "translate(" + center + ", " + center + ")")
	.attr("stroke", "white")
	.attr("stroke-width", "5px")
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
		 self._setCard3Row();
	 })
	 .append("title")
	 .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);	
	
	//Draw phantom arc paths
	phantomArcs.append("path")
	    .attr("fill", 'white')
	    .attr("fill-opacity", 0.1)
	    .attr("d", arcPhantom).style('stroke', 'white')
	    .style('stroke-width', 5);
	
	 svg.append("g")
		 .attr("font-family", "sans-serif")
		 .attr("font-size", 12)
		 .attr("text-anchor", "middle")
	 .selectAll("text")
	 .data(arcs)
	 .join("text")
	 	.attr("transform", d => `translate(${arcLabel().centroid(d)})`)
	 	.call(text => text.append("tspan")
	 			.attr("y", "-0.4em")
	 			.attr("font-weight", "bold")
	 			.text(d => d.data.name))
	 	.call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
	 			.attr("x", 0)
	 			.attr("y", "0.7em")
	 			.attr("fill-opacity", 0.7)
	 			.text(d => d.data.value.toLocaleString()+'%'));	
	
//	
////	var defs = svg.append("defs");
////	var filter = defs.append("filter")
////	    .attr("id", "drop-shadow")
////	    .attr("height", "130%")
////		.attr("width", "130%");
////	filter.append("feGaussianBlur")
////	    .attr("in", "SourceAlpha")
////	    .attr("stdDeviation", 4)
////	    .attr("result", "blur");
////	filter.append("feOffset")
////	    .attr("in", "blur")
////	    .attr("dx", 2)
////	    .attr("dy", 2)
////	    .attr("result", "offsetBlur");
////	var feMerge = filter.append("feMerge");
////	feMerge.append("feMergeNode")
////	    .attr("in", "offsetBlur");
////	feMerge.append("feMergeNode")
////		.attr("in", "SourceGraphic");
////	
//	
//	const color = d3.scaleOrdinal()
//    .domain(data.map(d => d.name))
//    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
//	
//	var arc = d3.arc()
//    .innerRadius(0)
//    .outerRadius(Math.min(width, height) / 2 - 1);
//	
//	const arcLabel = ()=>{
//		const radius = Math.min(width, height) / 2 * 0.8;
//		return d3.arc().innerRadius(radius).outerRadius(radius);
//	}
//	
//	const pie = d3.pie()
//    .sort(null)
//    .value(d => d.value);
//	
//	const arcs = pie(data);
//	
//	const self = this;
//	
//	 svg.append("g")
//	 	.attr("stroke", "white")
//	 .selectAll("path")
//	 .data(arcs)
//	 .join("path")
//	 	.style("paint-order", "stroke")
//	 	.style("stroke", "transparent")
//	 	.style("stroke-width", "0")
//	 	.attr("fill", d => color(d.data.name))
//	 	.attr("d", arc)
//	 	.on('mouseover', function (d){
////			 $(this).css('filter', 'url(#drop-shadow)')
////			 $(this).addClass('ei-selected')
//			 $(this)[0].classList.add('ei-selected')
//		 })
//		 .on('mouseout', function(){
////			 $(this).css('filter', '')
////			 $(this).removeClass('ei-selected')
//			 $(this)[0].classList.remove('ei-selected')
//			 
//		 })		 
//		 .on('click', function (d){
//			 self._setCard3Row();
//		 })
//		 .append("title")
//		 .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);
//
//	 svg.append("g")
//		 .attr("font-family", "sans-serif")
//		 .attr("font-size", 12)
//		 .attr("text-anchor", "middle")
//	 .selectAll("text")
//	 .data(arcs)
//	 .join("text")
//	 	.attr("transform", d => `translate(${arcLabel().centroid(d)})`)
//	 .call(text => text.append("tspan")
//			 .attr("y", "-0.4em")
//			 .attr("font-weight", "bold")
//			 .text(d => d.data.name))
//	 .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
//			 .attr("x", 0)
//			 .attr("y", "0.7em")
//			 .attr("fill-opacity", 0.7)
//			 .text(d => d.data.value.toLocaleString()+'%'));
}
EIDialogUI.prototype._setCard3Row = function() {
	console.log('set new grid')
}
/**
 * set correcteding Card.
 */
EIDialogUI.prototype._setCard4 = function() {
	console.log(OBJ);
	
//	this._getStatisticData();
}

EIDialogUI.prototype._getTestData = function() {
	console.log(OBJ);
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
		}
	})
	return response;
}
EIDialogUI.prototype._setCorrectedData = function() {
	console.log(OBJ);
	const warningDialog1 = DialogSystem.showBusy();
	var response = null;
	
	$.ajax({
		type : 'POST',
		url : "command/core/set-evaluation-index-corrected?" + $.param({ project: UI_CHART_INFO.selectedPId}),
		data : {
			columnId : OBJ.setting.columnId,
			indexId : OBJ.setting.indexId,
			correctedIndex : OBJ.setting.correctedIndex,
			operations : 'deleteNull', 
			columnName : OBJ.setting.columnName
		},
		async : false,
		success : function(data) {
			// get response by chartTypes
			warningDialog1();
			response = data.data;
		}
	})
	return response;
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
			"id": "ACCURACY",
			"text": "정확성",
			"desc": "구문 데이터 정확성, 의미 데이터 정확성, 데이터 세트의 부정확성의 위험, 데이터 범위 정확성등을 측정합니다."
		},
		{
			"id": "COMPLETENESS",
			"text": "완전성",
			"desc": "기록 완정성, 데이터 값 완정성 등을 측정합니다.",
			"setting": {
				"test_items": [
					{
						"id": "ACCURACY_RECORD",
						"text": "기록의 완전성"
					},
					{
						"id": "ACCURACY_RECORD2",
						"text": "기록의 완전성2"
					}
				],
				"quality_correction_items": [
					{
						"id": "REMOVE_NULL",
						"text": "NULL 데이터 삭제"
					},
					{
						"id": "REMOVE_NULL2",
						"text": "NULL 데이터 삭제2"
					}
				]
			}
		},
		{
			"id": "CONSISTENCY",
			"text": "일관성",
			"desc": "참조 무결성, 데이터 불일치의 위험, 의미론적 일관성 등을 측정합니다."
		},
		{
			"id": "PRESENT",
			"text": "현재성",
			"desc": "업데이트 주기와 조건에 맞게 업데이트 요청이 있는 정보 아이템의 비율을 측정합니다."
		},
		{
			"id": "COMPLIANCE",
			"text": "준수성",
			"desc": "표준, 협약 또는 규정에 부합하는 데이터 아이템의 비율을 측정합니다."
		},
		{
			"id": "PRECISION",
			"text": "정밀성",
			"desc": "명세서의 정밀도를 만족하는 데이터 값의 비율을 측정합니다."
		},
		{
			"id": "TRACEABILITY",
			"text": "추적성",
			"desc": "요청된 접근 추적성 값이 존재하는 데이터 값의 비율을 측정합니다."
		},
		{
			"id": "UNDERSTANDING",
			"text": "이해성",
			"desc": "이해 가능한 기호로 표시되는데이터  값의 비율을 측정합니다."
		}
	]}
}