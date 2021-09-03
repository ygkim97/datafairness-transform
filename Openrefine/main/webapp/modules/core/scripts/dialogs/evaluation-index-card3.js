/**
 * set Evaluation Index Card.
 */
EIDialogUI.prototype._setCard3 = function() {
	this._getModelInfo();
	
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

	// 예외처리
	try {
		// get data
		const chartLabels = OBJ.setting.correctedObj.chartLabels;
		const response = this._getCard3Row(chartLabels.rText.text, MAX_RECORD_COUNT, false);
		
		var data = [];
		
		const tCount = response.total;
		const rightCount = response.filtered;
		const wrongCount = response.total - response.filtered; 
		
		var rPer = getPer(rightCount, tCount); 
		
		// 무조건 r과 w count는 있다고 가정한다.
		data.push({name : chartLabels.rText.text, value : rPer, color : chartLabels.rText.color})
		data.push({name : chartLabels.wText.text, value : getPer(wrongCount, tCount), color : chartLabels.wText.color})

		var per = getPer(rightCount, tCount);
		
		OBJ.setting.wrongCount = wrongCount;
		OBJ.setting.totalCount_before = tCount;
		
		this._elmts.ei_total_per.text(rPer + '%');
		this._elmts.ei_total_value.text(tCount.numberWithCommas());
		this._elmts.ei_total_title.text($.i18n('core-index-data-ei/quality-total-cnt'));
		this._elmts.ei_right_value.text(rightCount.numberWithCommas());
		this._elmts.ei_right_title.text($.i18n('core-index-data-ei/quality-right-cnt'));
		this._elmts.ei_wrong_value.text(wrongCount.numberWithCommas());
		this._elmts.ei_wrong_title.text($.i18n('core-index-data-ei/quality-wrong-cnt'));
				
		// ei-right에 chart를 그린다.
		this._createPieChart('card3_pie_chart', data);
	} catch {
		return 'failed';
	}
}

function getPer(cnt, totalCnt) {
	const val1 = (cnt/totalCnt*100).toFixed(10);
	return Math.floor(val1*100)/100;
}
