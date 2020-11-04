package com.google.refine.statistic;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import com.google.refine.commands.history.ApplyOperationsCommand;

public class AccuracyIndex implements DataQualityIndex {

	private enum CorrectedEnum {
		SET_DATE_FORMAT
	}
	
	public AccuracyIndex(List<Object> chartRow) {
	}

	@Override
	public void setCorrectedData(String correctedIndex, ModifiableHttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		if (correctedIndex.equals(CorrectedEnum.SET_DATE_FORMAT.name())) {
			setSyntaxCorrectness(request, response);
		}
	}
	private void setSyntaxCorrectness(ModifiableHttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setParameter("operations", "convertDate");
		
		ApplyOperationsCommand command = new ApplyOperationsCommand();
		command.doPost(request, response);
	}

}
