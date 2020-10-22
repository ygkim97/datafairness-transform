package com.google.refine.statistic;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AccuracyIndex implements DataQualityIndex {

	private List<Object> chartRow = null;
	private List<Object> getChartRow() {
		return chartRow;
	}
	private void setChartRow(List<Object> chartRow) {
		this.chartRow = chartRow;
	}
	private enum TestEnum {
		SYNTAX_CORRECTNESS,
		SEMEANTIC_ACCURACY,
		DATASET_INACCURACY,
		RANGE_ACCURACY
	}
	private enum CorrectedEnum {
	}
	
	public AccuracyIndex(List<Object> chartRow) {
		this.setChartRow(chartRow);
	}

	@Override
	public Map<String, Object> getTestData(String testIndex) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setCorrectedData(String editIndex, HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		
	}
}
