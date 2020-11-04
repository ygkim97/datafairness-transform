/**
 * set SETTING Card.
 */
EIDialogUI.prototype._setCard2 = function() {
	// set setting page
	const indexProperty = getEvaluationIndexPropertiesById();
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
	
	const defaultTestItem = settingProperty.test_items[0];
	
	// set values default 
	addSELECT(this, settingProperty.test_items, 'testIndex', descProperty.testIndex);
	OBJ.setting.testIndex = defaultTestItem.id;
	OBJ.setting.testIndexName = defaultTestItem.text;

	addSELECT(this, defaultTestItem.correctedOptions, 'correctedIndex', descProperty.correctedIndex);
	if (defaultTestItem.correctedOptions == undefined) {
		$('select#correctedIndex').hide();
	}	
	
	/**
	 * 시험항목 선택 이벤트
	 * 품질보정 항목을 새로 셋팅하고 선택 이벤트를 발생시킨다.
	 */
	const self = this;
	$('select#testIndex').change(function(e) {
		const obj = getEvaluationIndexPropertiesById().setting["test_items"].find((ti)=> {
			return ti.id == $(this).val()
		})
		OBJ.setting.testIndex = obj.id;
		OBJ.setting.testIndexName = obj.text;
			
		addSELECT(self, obj.correctedOptions, 'correctedIndex', descProperty.correctedIndex);
		if (obj.correctedOptions == undefined) {
			$('select#correctedIndex').hide();
			OBJ.setting.correctedIndex = null;
			OBJ.setting.correctedIndexName = null;
		} else {
			$('select#correctedIndex').show();
			OBJ.setting.correctedIndex = obj.id;
			OBJ.setting.correctedIndexName = obj.text;
		}
		setDescription(obj.desc, 'testExlamation');
		
		$('select#correctedIndex').change();
	});
	$('select#testIndex').change();
	
	/**
	 * 품질보정 선택 이벤트
	 * 추가된 값 property obj가 있으면 (text/select/radio) 등등을 화면에 표시한다. 
	 */
	const _self = this
	$('select#correctedIndex').change(function(e) {
		const property = _self._getIndexProperty(OBJ.setting.indexId);
		const subDiv = $('div#corrected_select_sub');
		subDiv.empty();
		OBJ.setting.propertyType = null;
		
		const testItem = findValueById(property.setting.test_items, OBJ.setting.testIndex);
		var correctedObj = null;
		
		if (testItem.hasOwnProperty('correctedOptions')) {
			correctedObj = findValueById(testItem.correctedOptions, $(this).val());
		}
		var propertyObj = null;
		if (correctedObj != null) {
			propertyObj = correctedObj.property;
		}
		
		OBJ.setting.correctedObj = correctedObj;
		
		if (propertyObj!== null && propertyObj!== undefined) {
			subDiv.show();
			subDiv.addClass('no_bottom_line');
			
			subDiv.append(getTemplateInput(propertyObj));
			
			setDescription(correctedObj.desc, 'correctedExlamation');
		} else {
			// hide sub div
			subDiv.hide();
			subDiv.removeClass('no_bottom_line');
			
			setDescription(null, 'correctedExlamation');
		}
	})
	$('select#correctedIndex').change();
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


EIDialogUI.prototype._getIndexProperty = function(indexId) {
	return getEvaluationIndexProperties().properties.find((p) => {
		return p.id == indexId;
	}) 
}

function findValueById(arr, id) {
	return arr.find((o)=>{
		return o.id == id;
	})
}

function setDescription(descVal, descId) {
	if (descVal == null || descVal == undefined) {
		$('#'+descId).hide();
	} else {
		$('#'+descId).show();
		$('#'+descId+' .ei-tooltip').html(descVal);
	}
//	$('#correctedExlamation .ei-tooltip').html(defaultTestItem.correctedOption[0].desc);
}

function getTemplateInput(param) {
	OBJ.setting.propertyType = param.type;
	
	const className ="sub_properties";
	
	var template = '';
	template += '<fieldset class="ei-box-shadow">';
	template += '<legend class="new-connection-legend pure-input-1-2">'+$.i18n('core-index-data-ei/corrected-fieldset-title')+'</legend>'
	template += '<div class="pure-control-group">';
	template += '<label for="'+param.id+'">';
	template += param.text + ' : ';
	template += '</label>';
	
	if (param.type == 'text' || param.type == 'number') {
		template += '<input type="'+param.type+'" id="'+param.id+'" class="'+className+'" data-type="'+param.type+'" />';
	} else if (param.type == 'select') {
		template += '<select id="'+param.id+'" class="'+className+'" data-type="'+param.type+'" >';
		param.options.forEach((p)=>{
			template += '<option value="'+p.value+'" text="'+p.text+'">';
			template += '<span>';
			template += p.text;
			template += '</span>';
			template += '</option>';
		})
		template += '<select>';
	} else if (param.type == 'radio') {
		template += '<div class="sub-radio">';
		param.options.forEach((p, pI)=>{
			template += '<label>';
			template += '<input type="radio" name="'+param.id+'" value="'+p.value+'" class="'+className+'" data-type="'+param.type+'" '+((pI < 1) ? ' checked' : '')+'/>';
			template += p.text;
			template += '</label>';
		})
		template += '</div>';
	} else if (param.type == 'checkbox') {
		template += '<div class="sub-checkbox">';
		param.options.forEach((p, pI)=>{
			template += '<label>';
			template += '<input type="checkbox" name="'+param.id+ '_' + pI + '" value="'+p.value+'" class="'+className+'" data-type="'+param.type+'" '+((pI < 1) ? ' checked' : '')+'/>';
			template += p.text;
			template += '</label>';
		})
		template += '</div>';
	}
	template += '</div>';
	template += '</fieldset>';
	return template;
}