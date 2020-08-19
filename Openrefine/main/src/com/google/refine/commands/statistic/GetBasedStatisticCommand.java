/*

Copyright 2010, Google Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

    * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
    * Neither the name of Google Inc. nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,           
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY           
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

package com.google.refine.commands.statistic;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.math3.stat.descriptive.SummaryStatistics;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.refine.commands.Command;
import com.google.refine.model.ColumnModel;
import com.google.refine.model.Project;
import com.google.refine.model.Row;
import com.google.refine.util.ParsingUtilities;

public class GetBasedStatisticCommand extends Command {

	private static String DOT_STRING = "%.5f";
	
	private static final String _STRING = "string";
	private static final String _INT = "int";
	private static final String _DOUBLE = "double";
	
	private static Map<String, String> rowNames = null;
	private static List<String> rowNameList = null;
	
	public GetBasedStatisticCommand() {
		if (rowNames == null) {
			rowNames = new LinkedHashMap<String, String>();
			
			rowNames.put("name", "Name");
			rowNames.put("type", "Type");
			rowNames.put("logical", "Logical1");
			rowNames.put("count", "Count");
			rowNames.put("missing", "Missing");
			rowNames.put("min", "Min");
			rowNames.put("max", "Max");
			rowNames.put("mean", "Mean");
			rowNames.put("stdev", "Stdev");
			rowNames.put("vari", "Vari");
			rowNames.put("freq", "Freq");
			rowNames.put("unique", "Unique");
			
			rowNameList = new ArrayList<String>(rowNames.keySet());
		}
	}
	
	protected static class valueObj {
		@JsonProperty("obj")
		protected final Map<String, Object> obj;

		protected valueObj(
				String columnName
				, String columnType
				, String logical
				, Object cnt
				, int missingCnt
				, Object min
				, Object max
				, Object mean
				, Object stde
				, Object vari
				, Object maxFreq
				, Object unique
				) {
        	obj = new HashMap<String, Object>();
    		obj.put(rowNameList.get(0), columnName);
    		obj.put(rowNameList.get(1), columnType);
    		obj.put(rowNameList.get(2), logical);
    		obj.put(rowNameList.get(3), cnt);
    		obj.put(rowNameList.get(4), missingCnt);
    		obj.put(rowNameList.get(5), min);
    		obj.put(rowNameList.get(6), max);
    		obj.put(rowNameList.get(7), mean);
    		obj.put(rowNameList.get(8), stde);
    		obj.put(rowNameList.get(9), vari);
    		obj.put(rowNameList.get(10), maxFreq);
    		obj.put(rowNameList.get(11), unique);
		}
	}
	
	/**
	 * This command accepts POST. It is not CSRF-protected as it does not incur any
	 * state change.
	 */

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		internalRespond(request, response);
	}

	protected void internalRespond(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		PrintWriter writer = null;
		
		try {
			Project project = null;
			if (project == null) {
				project = getProject(request);
			}

			ColumnModel projectModel = project.columnModel;

			List<String> columnNames = projectModel.getColumnNames();

			// 선택한 column이 없을 경우, 전체 column을 배열에 추가해준다.
			String[] selectedColumns = request.getParameter("headers").split(",");
			List<List<Object>> chartRows = createChartRows(project, columnNames, selectedColumns);

			List<Map<String, Object>> columnInfo = new ArrayList<Map<String, Object>>();
			List<Map<Object, Long>> frequencyList = new ArrayList<Map<Object, Long>>();

			int i = 0;
			
			SummaryStatistics stats = null;
			Iterator<List<Object>> it = chartRows.iterator();
			
			Object cnt = null;
			Object min = null;
			Object max = null;
			Object mean = null;
			Object stde = null;
			Object vari = null;
			Object maxFreq = null;
			Object unique = null;
			int missingCnt = 0;
			
			String columnName = null;
			
			while (it.hasNext()) {
				List<Object> chartRow = it.next();
				
				columnName = projectModel.getColumnByCellIndex(Integer.valueOf(selectedColumns[i])).getName();
				String columnType = getColumnType(chartRow);

				Iterator<Object> chartRowIt = chartRow.iterator();

				if (columnType.equals(_INT) || columnType.equals(_DOUBLE)) {
					stats = new SummaryStatistics();

					chartRowIt = chartRow.iterator();
					missingCnt = 0;
					while (chartRowIt.hasNext()) {
						try {
							if (columnType.equals(_INT)) {
								int rowVal = Integer.parseInt(chartRowIt.next().toString());
								stats.addValue(rowVal);
							} else if (columnType.equals(_DOUBLE)) {
								double rowVal = Double.parseDouble(chartRowIt.next().toString());
								stats.addValue(rowVal);
							}
						} catch (NumberFormatException | NullPointerException e) {
							missingCnt++;
						}
					}

					// 최소값이나 최대값이 NaN일 경우, column Type이 String이라고 가정하고 넘긴다
					if (Double.isNaN(stats.getMin()) || Double.isNaN(stats.getMax())) {
						cnt = "";
						min = "";
						max = "";
						mean = "";
						stde = "";
						vari = "";
						unique = "";
					} else {
						cnt = stats.getN();
						min = stats.getMin();
						max = stats.getMax();
						mean = addDotString(stats.getMean());
						stde = addDotString(stats.getStandardDeviation());
						vari = addDotString(stats.getVariance());
						unique = chartRow.stream().distinct().count();
					}
				} else {
					missingCnt = 0;
					while (chartRowIt.hasNext()) {
						Object str = chartRowIt.next();
						if (str == null || str.equals("") || str.toString().toLowerCase().equals("null")) {
							missingCnt++;
						}
					}

					cnt = chartRow.size();
					min = "-";
					max = "-";
					mean = "-";
					stde = "-";
					vari = "-";
					unique = chartRow.stream().distinct().count();
				}

				// chart를 그리기 위해서, 항목별로 갯수 구함.
				Map<Object, Long> freq = chartRow.stream()
						.filter(el -> el != null && !el.toString().trim().isEmpty())
						.collect(Collectors.groupingBy((e) -> {
							if (columnType.equals(_STRING)) {
								return e;
							} else if (columnType.equals(_INT)) {
								return e;
							} else {
								return Math.round(Double.parseDouble(e.toString()));
							}
						}, Collectors.counting()));
				frequencyList.add(freq);

				if (freq.values().size() > 0) {
					// Freq : 가장 큰 빈도수를 구함.
					maxFreq = freq.values().stream().max(Comparator.naturalOrder()).get();
				} else {
					// 모든 값이 null이어서, 빈도수 및 Unique 값이 없음.
					maxFreq = "-";
					unique = "-";
				}

				String logical = columnName + "_logical";
				
				columnInfo.add(new valueObj(columnName, columnType, logical, cnt, missingCnt, min, max, mean, stde, vari, maxFreq, unique).obj);
				i++;
			}

			Map<String, Object> result = new HashMap<String, Object>();
			result.put("columnInfo", columnInfo);
			result.put("frequencyList", frequencyList);
			result.put("rowNames", rowNames);

			response.setCharacterEncoding("UTF-8");
			response.setHeader("Content-Type", "application/json");

			writer = response.getWriter();
			ParsingUtilities.defaultWriter.writeValue(writer, result);

			// metadata refresh for row mode and record mode
			if (project.getMetadata() != null) {
				project.getMetadata().setRowCount(project.rows.size());
			}
		} catch (Exception e) {
			respondException(response, e);
		} finally {
			if (writer != null) {
				writer.close();
			}
		}
	}
	
	private String addDotString(double doubleValue) {
		String stringValue = String.format(DOT_STRING, doubleValue);
		String[] splited = stringValue.split("\\.");

		// double 이 아닌 값에 소숫점을 추가 하게 되면 value.00000으로 변환된다.
		// .00000 일 경우 정수값만 표시한다.
		if (splited[1].equals("00000")) {
			return splited[0];
		} else {
			return stringValue;
		}
	}

	private List<List<Object>> createChartRows(Project project, List<String> columnNames, String[] selectedColumns) {
		List<List<Object>> chartRows = new ArrayList<List<Object>>();
		Iterator<Row> it = project.rows.iterator();
		
		Row row = null;
		int chartRowI = 0;
		int selectedColumnIndex = 0;
		
		while (it.hasNext()) {
			row = it.next(); // project row

			chartRowI = 0;
			for (int i = 0, size = selectedColumns.length; i < size; i++) {
				selectedColumnIndex = Integer.valueOf(selectedColumns[i]);
				if (chartRows.size() <= chartRowI) {
					chartRows.add(new ArrayList<Object>());
				}
				Object columnRow = row.getCellValue(selectedColumnIndex);
				chartRows.get(chartRowI).add(columnRow);

				chartRowI++;
			}
		}

		return chartRows;
	}

	private String getColumnType(List<Object> list) {
		try {
			// max값을 구한다.
			// Int로 떨어지면 INT
			list.stream()
				.filter(el -> el != null && !el.toString().trim().isEmpty())
				.mapToInt((Object v) -> Integer.parseInt(v.toString()))
				.max()
				.getAsInt();
			return _INT;
		} catch (Exception e1) {
			try {
				list.stream()
					.filter(el -> el != null && !el.toString().trim().isEmpty())
					.mapToDouble((Object v) -> Double.parseDouble(v.toString()))
					.max()
					.getAsDouble();
				return _DOUBLE;
			} catch (Exception e2) {
				return _STRING;
			}
		}
	}
}
