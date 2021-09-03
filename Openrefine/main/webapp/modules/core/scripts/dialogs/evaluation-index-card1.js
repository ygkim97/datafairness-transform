EIDialogUI.prototype._setCard1 = function() {
	var labelList = getEvaluationIndexProperties().properties;
	
	var template = '';
	template += '<table class="card1-table">';	
	template += '<tr>';
	
	const ei_wrap = this._elmts.ei_card1.empty();
	
	labelList.forEach((li, i)=>{
		if (i == INDEX_TABLE_MAX_ROW) {
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
			$('.evaluation_index').removeClass('active');		
			$(e.target).addClass('active');
			$(e.target).find('input').click();
		}
	})
}