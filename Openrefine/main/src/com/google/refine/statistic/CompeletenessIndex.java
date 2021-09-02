package com.google.refine.statistic;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import com.google.refine.commands.history.ApplyOperationsCommand;

public class CompeletenessIndex implements DataQualityIndex {
	private enum CorrectedEnum {
		REMOVE_NULL
	}
	
	public CompeletenessIndex(List<Object> chartRow) {
	}
	
	@Override
	public void setCorrectedData(String correctedIndex, ModifiableHttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		if (correctedIndex.equals(CorrectedEnum.REMOVE_NULL.name())) {
			setRemoveNull(request, response);
		}
	}

	private void setRemoveNull(ModifiableHttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setParameter("operations", "deleteNull");
		
		ApplyOperationsCommand command = new ApplyOperationsCommand();
		command.doPost(request, response);
	}
}
