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
	var propertyVal = getExtraPropertyVal();
	
	$('span[name="corrected_column"]').text(OBJ.setting.correctedIndexName + (propertyVal == undefined ? '' : '(' + propertyVal + ')'));
	
	this._elmts.export_iris_Legend.text($.i18n('core-index-data-ei/export-title'));
	this._elmts.index_columnName_label.text($.i18n('core-index-data-ei/export-iris-index-column-name') + ':');
	this._elmts.date_columnName_label.text($.i18n('core-index-data-ei/export-iris-date-column-name') + ':');
	this._elmts.tableName_label.text($.i18n('core-index-data-ei/export-iris-table-name') + ':');
	
	// set Iris properties (select)
	var newColumns = [];
	OBJ.columns.forEach((c) => {
		newColumns.push({id:c.cellIndex, text:c.name});
	})
	addSELECT(this, newColumns, 'indexColumnName');
	addSELECT(this, newColumns, 'dateColumnName');
	// Update Class info
	$('select#indexColumnName').addClass('pure-input-1-3');
	$('select#dateColumnName').addClass('pure-input-1-3');
	
	// get data
	const columnData = this._getTestData();
	
	const chartLabels = OBJ.setting.correctedObj.chartLabels;
	const tCount = columnData.totalCount;
	var rPer = getPer(columnData.rightCount, tCount); 
	
	// 무조건 r과 w count는 있다고 가정한다.
	data.push({name : chartLabels.rText, value : rPer})
	data.push({name : chartLabels.wText, value : getPer(columnData.wrongCount, tCount)})
	
	if (columnData.hasOwnProperty('errorCount')) {
		data.push({name : chartLabels.eText, value : getPer(columnData.errorCount, tCount)})
	}
	
	this._elmts.ei_editing_total_per.text(per + '%');
	this._elmts.ei_editing_total_title.text($.i18n('core-index-data-ei/quality-total-cnt'))
	this._elmts.ei_editing_count_title.text($.i18n('core-index-data-ei/editing-count-cnt'))
	this._elmts.ei_editing_after_title.text($.i18n('core-index-data-ei/editing-after-cnt'))
	
	this._elmts.ei_editing_total_value.text(OBJ.setting.totalCount_before.numberWithCommas());
	this._elmts.ei_editing_count_value.text(OBJ.setting.wrongCount.numberWithCommas());
	this._elmts.ei_editing_after_value.text(columnData.totalCount.numberWithCommas());
	
	// ei-right에 chart를 그린다.
	this._createPieChart('card4_pie_chart', data);
	
	const _self = this;
	this._elmts.save_iris.text($.i18n('core-buttons/save-iris'));
	this._elmts.save_iris.click(function() {
		_self._setSaveToIris();
	});
}