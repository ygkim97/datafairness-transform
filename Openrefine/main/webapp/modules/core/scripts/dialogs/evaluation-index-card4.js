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
	
	this._elmts.ei_editing_total_per.text(per + '%');
	this._elmts.ei_editing_total_value.text(OBJ.setting.totalCount_before.numberWithCommas());
	this._elmts.ei_editing_total_title.text($.i18n('core-index-data-ei/quality-total-cnt'))
	this._elmts.ei_editing_count_value.text((OBJ.setting.wrongCount - wrongCount).numberWithCommas());
	this._elmts.ei_editing_count_title.text($.i18n('core-index-data-ei/editing-count-cnt'))
	this._elmts.ei_editing_after_value.text(tCount.numberWithCommas());
	this._elmts.ei_editing_after_title.text($.i18n('core-index-data-ei/editing-after-cnt'))
	
	// ei-right에 chart를 그린다.
	this._createPieChart('card4_pie_chart', data);
	
	const _self = this;
	this._elmts.save_iris.text($.i18n('core-buttons/save-iris'));
	this._elmts.save_iris.click(function() {
		_self._setSaveToIris();
	});
}

EIDialogUI.prototype._setSaveToIris = function() {
	const irisKey = this._elmts.indexColumnName.find('option:selected').text();
	const irisDateKey = this._elmts.dateColumnName.find('option:selected').text();
	const tableName = this._elmts.tableName.val();
	
	// value check
	if (irisKey == '' || irisDateKey == '' || tableName == '') {
		alert($.i18n('core-index-data-ei/iris-no-data'))
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
				_self._dismiss();
				_refreshRows();
			}, error: function(data) {
				// alread exist table name
				if (data.statusText.indexOf('already exists') > -1) {
					alert(getIrisAlertMsg(tableName, 'export-already-exist-table-name'));
				} else if (data.statusText.indexOf('Invalid Partition Time') > -1) {
					alert(getIrisAlertMsg(tableName, 'export-invalid_time_column'));
				} else if (data.statusText.indexOf('PARTITIONKEY column') > -1) {
					alert(getIrisAlertMsg(tableName, 'export-invalid_index_column'));
				}
			}, complete : function() {
				warningDialog1();
			}
		});
	}, 10);
}
function getIrisAlertMsg(tableName, msgStr) {
	return '[ ' + tableName + ' ] ' + $.i18n('core-index-data-ei/' + msgStr);
}