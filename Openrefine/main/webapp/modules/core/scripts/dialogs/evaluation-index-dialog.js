// for window resize event.
var _EIDialogUI = null;
var EI_SELECTED_HEADER_INDEX = null;

function EIDialogUI(index) {
	EI_SELECTED_HEADER_INDEX = index;
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
	this._setPrevPage();
	this._setNextPage();
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
    
//    $('#ei_next').text($.i18n('core-index-dialog-ei/next-prev-btn-'+currentDiv))
	$('#ei_next').click((e) => {
		nextDiv = currentDiv + 1;
		if (nextDiv == 2) {
			// go to next
			const checked = $('.evaluation_index input[type="radio"]:checked');
			if (checked.length == 0) {
				alert($.i18n('core-index-dialog-ei/no-selected-evaluation-index'));
				return;
			} else {
				var eiList = [];
				// get data
				checked.each((i, e)=>{
					eiList.push($(e).attr('data-id'));
				})
				this._getStatisticData(eiList);
			}
		}
		if (nextDiv == 2) {
			$div1.toggle('slide', {direction: 'left'}, 'slow');
			$div2.toggle('slide', {direction: 'right'}, 'slow');
		} else if (nextDiv == 3) {
			$div2.toggle('slide', {direction: 'left'}, 'slow');
		    $div3.toggle('slide', {direction: 'right'}, 'slow');
		} else if (nextDiv == 4) {
			$div3.toggle('slide', {direction: 'left'}, 'slow');
		    $div4.toggle('slide', {direction: 'right'}, 'slow');
		}
		currentDiv = nextDiv;
		naviItems.removeClass('active');
		$(naviItems[currentDiv-1]).addClass('active');
		
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
		
		naviItems.removeClass('active');
		$(naviItems[currentDiv-1]).addClass('active');
		
		$next.show();
		if (currentDiv == 1) {
			$prev.hide();
		} else {
			$prev.show();
		}
	});
}
EIDialogUI.prototype._setPrevPage = function() {
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
	
	// when click label, same effect like click radio.
	$('.evaluation_index label').click((e)=>{
		$(e.target.parentElement).find('input').click();
	})
}

EIDialogUI.prototype._setNextPage = function() {
	// next page setting
	// setting what?
}

/**
 * params
 * - chartTypes : ['chartTypeId', 'chartTypeId'...]
 */
EIDialogUI.prototype._getStatisticData = function(chartTypes) {
	const warningDialog1 = DialogSystem.showBusy();
	var response = null;
	
	$.ajax({
		type : 'POST',
		url : "command/core/get-evaluation-index?" + $.param({ project: UI_CHART_INFO.selectedPId}),
		data : {
			headers : EI_SELECTED_HEADER_INDEX,
			chartType : chartTypes.join(',')
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

function getEvaluationIndex() {
	return {"properties": [
		{
			"id": "ACCURACY",
			"text": "정확성",
			"desc": "구문 데이터 정확성, 의미 데이터 정확성, 데이터 세트의 부정확성의 위험, 데이터 범위 정확성등을 측정합니다.",
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
			"id": "COMPLETENESS",
			"text": "완전성",
			"desc": "기록 완정성, 데이터 값 완정성 등을 측정합니다."
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