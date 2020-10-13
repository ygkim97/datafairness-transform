package com.google.refine.statistic;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AccuracyIndex implements DataQualityIndex {

	private List<Object> chartRow = null;

	public AccuracyIndex(List<Object> chartRow) {
		this.chartRow = chartRow;
	}

	@Override
	public Map<String, Object> test(String testIndex) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void corrected(String editIndex, HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		
	}
}
