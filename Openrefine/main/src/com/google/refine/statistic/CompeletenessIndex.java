package com.google.refine.statistic;

import java.io.IOException;
import java.util.ArrayList;
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
	
	public static enum TEST_INDEX {
		ACCURACY_RECORD,
		ACCURACY_RECORD2
	}

	public static enum CORRECTED_INDEX {
		REMOVE_NULL,
		REMOVE_NULL2
	}

	public CompeletenessIndex(List<Object> chartRow) {
		this.chartRow = chartRow;
	}

	/**
	 * get Rows filtered testIndex
	 * @return 
	 */
	@Override
	public Map<String, Object> test(String testIndex) {
		if (testIndex.equals(TEST_INDEX.ACCURACY_RECORD.name())) {
			return getAccuracy_record();
		} else if (testIndex.equals(TEST_INDEX.ACCURACY_RECORD.name())) {
			
		}
		return null;
	}

	private Map<String, Object> getAccuracy_record() {
		// 기록의 완전성
		// null 이 포함되어있는지 여부를 체크한다.
		
		List<Object> resultList1 = new ArrayList<Object>();
		List<Object> resultList2 = new ArrayList<Object>();
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("totalCount", chartRow.size());
		
		int rCnt = 0;
		int wCnt = 0;
		
		Iterator<Object> it = this.chartRow.iterator();
		while (it.hasNext()) {
			Object row = it.next();
			if (row == null || row.equals("")) {
				wCnt++;
				resultList1.add(row);
			} else {
				rCnt++;
				resultList2.add(row);
			}
		}
		result.put("rightCount", rCnt);
		result.put("wrongCount", wCnt);
		result.put("wList", resultList1);
		result.put("rList", resultList2);
		result.put("wText", "NULL");
		result.put("rText", "NOT NULL");
		
		return result;
	}
	
	@Override
	public void corrected(String correctedIndex, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		if (correctedIndex.equals(CORRECTED_INDEX.REMOVE_NULL.name())) {
			setRemoveNull(request, response);
		} else if (correctedIndex.equals(CORRECTED_INDEX.REMOVE_NULL2.name())) {
			
		}
	}

	private void setRemoveNull(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		ApplyOperationsCommand command = new ApplyOperationsCommand();
		command.doPost(request, response);
	}
}
