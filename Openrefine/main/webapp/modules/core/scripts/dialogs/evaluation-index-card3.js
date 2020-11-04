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
		const columnData = this._getTestData();
		
		var data = [];
		
		const chartLabels = OBJ.setting.correctedObj.chartLabels;
		const tCount = columnData.totalCount;
		var rPer = getPer(columnData.rightCount, tCount); 
		
		// 무조건 r과 w count는 있다고 가정한다.
		data.push({name : chartLabels.rText, value : rPer})
		data.push({name : chartLabels.wText, value : getPer(columnData.wrongCount, tCount)})
		
		if (columnData.hasOwnProperty('errorCount')) {
			data.push({name : chartLabels.eText, value : getPer(columnData.errorCount, tCount)})
		}
		
		var per = getPer(columnData.rightCount, columnData.totalCount);
		
		// 초기값일때만 값을 저장한다.
		// 만약 페이지 이동으로 다시 card3에 진입한 경우, 값을 저장하지 않는다. (고유값으로 유지 필요)
		if (OBJ.setting.wrongCount == 0) {
			OBJ.setting.wrongCount = columnData.wrongCount;
			OBJ.setting.totalCount_before = columnData.totalCount;
		}
		
		this._elmts.ei_total_per.text(rPer + '%');
		this._elmts.ei_total_title.text($.i18n('core-index-data-ei/quality-total-cnt'))
		this._elmts.ei_right_title.text($.i18n('core-index-data-ei/quality-right-cnt'))
		this._elmts.ei_wrong_title.text($.i18n('core-index-data-ei/quality-wrong-cnt'))
		
		this._elmts.ei_total_value.text(columnData.totalCount.numberWithCommas());
		this._elmts.ei_right_value.text(columnData.rightCount.numberWithCommas());
		this._elmts.ei_wrong_value.text(columnData.wrongCount.numberWithCommas());
		
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
