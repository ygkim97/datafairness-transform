package com.google.refine.statistic;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.refine.commands.history.ApplyOperationsCommand;

public class CompeletenessIndex implements DataQualityIndex {

	private List<Object> chartRow = null;
	private List<Object> getChartRow() {
		return chartRow;
	}
	private void setChartRow(List<Object> chartRow) {
		this.chartRow = chartRow;
	}
	private enum TestEnum {
		ACCURACY_RECORD
	}
	private enum CorrectedEnum {
		REMOVE_NULL
	}
	
	/**
	 * constructor
	 */
	public CompeletenessIndex(List<Object> chartRow) {
		this.setChartRow(chartRow);
	}

	/**
	 * get Rows filtered testIndex
	 */
	@Override
	public Map<String, Object> getTestData(String testIndex) {
		if (testIndex.equals(TestEnum.ACCURACY_RECORD.name())) {
			return getAccuracyRecord();
		}
		return null;
	}

	private Map<String, Object> getAccuracyRecord() {
		// 기록의 완전성
		// null 이 포함되어있는지 여부를 체크한다.
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("totalCount", getChartRow().size());
		
		int rCnt = 0;
		int wCnt = 0;
		
		Iterator<Object> it = this.getChartRow().iterator();
		while (it.hasNext()) {
			Object row = it.next();
			if (row == null || row.equals("")) {
				wCnt++;
			} else {
				rCnt++;
			}
		}
		result.put("rightCount", rCnt);
		result.put("wrongCount", wCnt);
		result.put("wText", "NULL");
		result.put("rText", "NOT NULL");
		
		return result;
	}

	/**
	 * set correctedIndex
	 */
	@Override
	public void setCorrectedData(String correctedIndex, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		if (correctedIndex.equals(CorrectedEnum.REMOVE_NULL.name())) {
			setRemoveNull(request, response);
		}
	}

	private void setRemoveNull(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		ApplyOperationsCommand command = new ApplyOperationsCommand();
		command.doPost(request, response);
	}
}
