package com.google.refine.statistic;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
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
		SYNTAX_CORRECTNESS
	}
	private enum CorrectedEnum {
		SET_SYNTAX_CORRECTNESS
	}
	
	public AccuracyIndex(List<Object> chartRow) {
		this.setChartRow(chartRow);
	}

	@Override
	public Map<String, Object> getTestData(String testIndex, String property) {
		if (testIndex.equals(TestEnum.SYNTAX_CORRECTNESS.name())) {
			return getSyntaxCorrectness(property);
		}
		return null;
	}
	private Map<String, Object> getSyntaxCorrectness(String property) {
		// 정확성
		// 구문 데이터가 정확한지 판단한다.
		
		Map<String, Object> result = new HashMap<String, Object>();
		
		// 날짜 데이터인것만 뽑아내기.
		result.put("totalCount", getChartRow().size());
		
		int rCnt = 0;
		int wCnt = 0;

		SimpleDateFormat format = new SimpleDateFormat(property);
		
		Iterator<Object> it = this.getChartRow().iterator();
		while (it.hasNext()) {
			
			try {
				String dateStr = it.next().toString();
				format.parse(dateStr);
				wCnt++;
			} catch (Exception e) {
				rCnt++;
			}
		}
		// 만약, Count 값들이 없으면 주석처리 해야한다.
		result.put("rightCount", rCnt);
		result.put("wrongCount", wCnt);
		result.put("errorCount", 1234);
		
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
	
	public static void main(String[] args) throws ParseException {
		List<String> dates = new ArrayList<String>();
		dates.add("2020-08-20");
		dates.add("2020/08/20");
		dates.add("08/20/2020");
		dates.add("08-20");
		
		SimpleDateFormat format = new SimpleDateFormat("YYYY-MM-DD");
		
		Iterator<String> it = dates.iterator();
		while (it.hasNext()) {
			String dateStr = it.next();
			Date date = format.parse(dateStr);
			System.out.println(date);
		}
	}
}
