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
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.math3.stat.descriptive.SummaryStatistics;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.refine.commands.Command;
import com.google.refine.model.Column;
import com.google.refine.model.ColumnModel;
import com.google.refine.model.Project;
import com.google.refine.model.Row;
import com.google.refine.util.ParsingUtilities;

public class GetBasedStatisticCommand extends Command {

	private static String DOT_STRING = "%.5f";

	protected static class RowNames {
		@JsonProperty("key")
		protected final String key;
		@JsonProperty("text")
		protected final String text;
		@JsonProperty("obj")
		protected final Map<String, String> obj;

		protected RowNames(String key, String text) {
			this.key = key;
			this.text = text;
//        	this.obj = new JsonObject();
			obj = new HashMap<String, String>();
			this.obj.put("key", key);
			this.obj.put("text", text);
		}
	}

	/**
	 * This command accepts GET. It is not CSRF-protected as it does not incur any
	 * state change.
	 */

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		internalRespond(request, response);
	}

	protected void internalRespond(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		try {
			Project project = null;
			if (project == null) {
				project = getProject(request);
			}

			ColumnModel projectModel = project.columnModel;

			List<String> columnNames = projectModel.getColumnNames();

			// 선택한 column이 없을 경우, 전체 column을 배열에 추가해준다.
			String[] selectedColumns = request.getParameterValues("headers[]");
			if (selectedColumns == null) {
				List<Column> pc = projectModel.columns;
				selectedColumns = new String[pc.size()];
				Iterator<Column> projectColumnIt = pc.iterator();
				int cI = 0;
				while (projectColumnIt.hasNext()) {
					selectedColumns[cI] = String.valueOf(projectColumnIt.next().getCellIndex());
					cI++;
				}
			}
			List<List<Object>> chartRows = createChartRows(project, columnNames, selectedColumns);

			List<Map<String, Object>> columnInfo = new ArrayList<Map<String, Object>>();
			List<Map<String, String>> rowNames = getRowNames();
			List<Map<Object, Long>> frequencyList = new ArrayList<Map<Object, Long>>();

			int i = 0;

			Map<String, Object> obj = null;
			SummaryStatistics stats = null;

			Iterator<List<Object>> it = chartRows.iterator();
			while (it.hasNext()) {
				List<Object> chartRow = it.next();
				obj = new HashMap<String, Object>();

				String column = projectModel.getColumnByCellIndex(Integer.valueOf(selectedColumns[i])).getName();

				// 공통
				obj.put(getRowKey(rowNames, 0), column);
				String columnType = getColumnType(chartRow);

				// column type
				obj.put(getRowKey(rowNames, 1), columnType);

				// 결정된바 없음 (임시)
				obj.put(getRowKey(rowNames, 2), column + "_logical");

				Iterator<Object> chartRowIt = chartRow.iterator();

				if (columnType.equals("int") || columnType.equals("double")) {
					stats = new SummaryStatistics();

					chartRowIt = chartRow.iterator();
					int missingCnt = 0;
					while (chartRowIt.hasNext()) {
						try {
							if (columnType.equals("int")) {
								int rowVal = Integer.parseInt(chartRowIt.next().toString());
								stats.addValue(rowVal);
							} else if (columnType.equals("double")) {
								double rowVal = Double.parseDouble(chartRowIt.next().toString());
								stats.addValue(rowVal);
							}
						} catch (NumberFormatException | NullPointerException e) {
							missingCnt++;
						}
					}

					// 최소값이나 최대값이 NaN일 경우, column Type이 String이라고 가정하고 넘긴다
					if (Double.isNaN(stats.getMin()) || Double.isNaN(stats.getMax())) {
						obj.put(getRowKey(rowNames, 3), "");
						obj.put(getRowKey(rowNames, 4), "");
						obj.put(getRowKey(rowNames, 5), "");
						obj.put(getRowKey(rowNames, 6), "");
						obj.put(getRowKey(rowNames, 7), "");
						obj.put(getRowKey(rowNames, 8), "");
						obj.put(getRowKey(rowNames, 9), "");
						obj.put(getRowKey(rowNames, 11), "");
					} else {
						obj.put(getRowKey(rowNames, 3), stats.getN());
						obj.put(getRowKey(rowNames, 4), missingCnt);
						obj.put(getRowKey(rowNames, 5), stats.getMin());
						obj.put(getRowKey(rowNames, 6), stats.getMax());
						obj.put(getRowKey(rowNames, 7), addDotString(stats.getMean()));
						obj.put(getRowKey(rowNames, 8), addDotString(stats.getStandardDeviation()));
						obj.put(getRowKey(rowNames, 9), addDotString(stats.getVariance()));
						obj.put(getRowKey(rowNames, 11), chartRow.stream().distinct().count());
					}
				} else {
					int missingCnt = 0;
					while (chartRowIt.hasNext()) {
						Object str = chartRowIt.next();
						if (str == null || str.equals("") || str.toString().toLowerCase().equals("null")) {
							missingCnt++;
						}
					}
					obj.put(getRowKey(rowNames, 3), chartRow.size());
					obj.put(getRowKey(rowNames, 4), missingCnt);
					obj.put(getRowKey(rowNames, 5), "-");
					obj.put(getRowKey(rowNames, 6), "-");
					obj.put(getRowKey(rowNames, 7), "-");
					obj.put(getRowKey(rowNames, 8), "-");
					obj.put(getRowKey(rowNames, 9), "-");
					obj.put(getRowKey(rowNames, 11), chartRow.stream().distinct().count());
				}

				// chart를 그리기 위해서, 항목별로 갯수 구함.
				Map<Object, Long> freq = chartRow.stream()
						.collect(Collectors.groupingBy(e -> e == null || e == "" ? "NULL" : e, Collectors.counting()));
				frequencyList.add(freq);

				// Freq : 가장 큰 빈도수를 구함.
				obj.put(getRowKey(rowNames, 10), freq.values().stream().max(Comparator.naturalOrder()).get());

				columnInfo.add(obj);
				i++;
			}
//            }

			Map<String, Object> result = new HashMap<String, Object>();
			result.put("columnInfo", columnInfo);
			result.put("frequencyList", frequencyList);
			result.put("rowNames", rowNames);

			response.setCharacterEncoding("UTF-8");
			response.setHeader("Content-Type", "application/json");

			PrintWriter writer = response.getWriter();
			ParsingUtilities.defaultWriter.writeValue(writer, result);

			// metadata refresh for row mode and record mode
			if (project.getMetadata() != null) {
				project.getMetadata().setRowCount(project.rows.size());
			}
		} catch (Exception e) {
			respondException(response, e);
		}
	}

	private String addDotString(double doubleValue) {

		String stringValue = String.format(DOT_STRING, doubleValue);
		String[] splited = stringValue.split("\\.");

		if (splited[1].equals("00000")) {
			return splited[0];
		} else {
			return stringValue;
		}
	}

	private List<Map<String, String>> getRowNames() {
		List<Map<String, String>> rowNames = new ArrayList<Map<String, String>>();
		rowNames.add(new RowNames("name", "Name").obj);
		rowNames.add(new RowNames("type", "Type").obj);
		rowNames.add(new RowNames("logical", "Logical1").obj);
		rowNames.add(new RowNames("count", "Count").obj);
		rowNames.add(new RowNames("missing", "Missing").obj);
		rowNames.add(new RowNames("min", "Min").obj);
		rowNames.add(new RowNames("max", "Max").obj);
		rowNames.add(new RowNames("mean", "Mean").obj);
		rowNames.add(new RowNames("stdev", "Stdev").obj);
		rowNames.add(new RowNames("vari", "Vari").obj);
		rowNames.add(new RowNames("freq", "Freq").obj);
		rowNames.add(new RowNames("unique", "Unique").obj);
		return rowNames;
	}

	private String getRowKey(List<Map<String, String>> rowNames, int index) {
		return rowNames.get(index).get("key").toString();
	}

	private List<List<Object>> createChartRows(Project project, List<String> columnNames, String[] selectedColumns) {
		List<List<Object>> chartRows = new ArrayList<List<Object>>();
		Iterator<Row> it = project.rows.iterator();

		while (it.hasNext()) {
			Row row = it.next(); // project row

			int chartRowI = 0;
			for (int i = 0, size = selectedColumns.length; i < size; i++) {
				int selectedColumnIndex = Integer.valueOf(selectedColumns[i]);
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
			list.stream().filter(Objects::nonNull).mapToInt((Object v) -> Integer.parseInt(v.toString())).max()
					.getAsInt();

			return "int";
		} catch (Exception e1) {
		}

		try {
			list.stream().filter(Objects::nonNull).mapToDouble((Object v) -> Double.parseDouble(v.toString())).max()
					.getAsDouble();

			return "double";
		} catch (Exception e1) {
		}

		return "string";
	}
}
