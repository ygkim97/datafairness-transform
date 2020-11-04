package com.google.refine.statistic;

import java.io.IOException;
import java.util.HashMap;
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
		SET_SYNTAX_CORRECTNESS
	}
	
	public AccuracyIndex(List<Object> chartRow) {
		this.setChartRow(chartRow);
	}

	@Override
	public Map<String, Object> getTestData(String testIndex) {
		if (testIndex.equals(TestEnum.SYNTAX_CORRECTNESS.name())) {
			return getSyntaxCorrectness();
		}
		return null;
	}
	private Map<String, Object> getSyntaxCorrectness() {
		// 정확성
		// 구문 데이터가 정확한지 판단한다.
		System.out.println("SYNTAX_CORRECTNESS_RECORD");

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("totalCount", getChartRow().size());
		return result;
	}
	
	@Override
	public void setCorrectedData(String correctedIndex, HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		if (correctedIndex.equals(CorrectedEnum.SET_SYNTAX_CORRECTNESS.name())) {
			setSyntaxCorrectness(request, response);
		}
	}
	private void setSyntaxCorrectness(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("SET_SYNTAX_CORRECTNESS");
	}
}
