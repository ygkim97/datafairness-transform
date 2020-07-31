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
import java.util.Arrays;
import java.util.HashMap;
import java.util.IntSummaryStatistics;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.math3.stat.Frequency;
import org.apache.commons.math3.stat.descriptive.SummaryStatistics;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.refine.commands.Command;
import com.google.refine.model.Project;
import com.google.refine.model.Row;
import com.google.refine.util.ParsingUtilities;

public class GetBasedStatisticCommand extends Command {
	
	private static String DOT_STRING = "%.5f";
	
    protected static class RowNames  {
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
     * This command accepts GET. It is not CSRF-protected as it does not incur any state change.
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
            
            ;
            String[] selectedColumns = request.getParameterValues("headers[]");
            
            List<String> columnNames = project.columnModel.getColumnNames();
            List<List<Object>> chartRows = createChartRows(project, columnNames.size());
            
            Iterator<String> cIt = columnNames.iterator();
            List<Map<String, Object>> columnInfo = new ArrayList<Map<String, Object>>();
            
            List<Map<String, String>> rowNames = getRowNames();

        	List<Map<Object, Long>> frequencyList = new ArrayList<Map<Object, Long>>();
        	
            int i = 0;
            while(cIt.hasNext()) {
            	String column = cIt.next();

            	// 만약 선택된 columns가 있으면, 이 column이 선택되었는지 체크한다.
            	if (selectedColumns != null) {
            		if (!Arrays.asList(selectedColumns).contains(column)) {
            			continue;
            		}
            	}
            	
            	Map<String, Object> obj = new HashMap<String, Object>();
            	
            	// 공통
            	obj.put(getRowKey(rowNames, 0), column);
            	String columnType = getColumnType(chartRows.get(i));
            	
            	// column type
            	obj.put(getRowKey(rowNames, 1), columnType);
            	
            	// 결정된바 없음 (임시)
            	obj.put(getRowKey(rowNames, 2), column+"_logical");
            	
            	List<Object> chartRow = chartRows.get(i);
            	Iterator<Object> chartRowIt = chartRow.iterator();
            	
            	if (columnType.equals("int")) {            	
                	try {
						chartRow = (chartRows.get(i).stream().sorted((a, b) -> {
							int newA = Integer.parseInt(a.toString());
							int newB = Integer.parseInt(b.toString());
							return Integer.compare(newA, newB);
						}).collect(Collectors.toCollection(ArrayList::new)));
						
						chartRows.remove(i);
						chartRows.add(i, chartRow);
					} catch (Exception e1) {
						// do nothing
					}
                    
					SummaryStatistics stats = new SummaryStatistics();

            		int missingCnt = 0;
					while(chartRowIt.hasNext()) {
						try {
							int rowVal = Integer.parseInt(chartRowIt.next().toString());
							stats.addValue(rowVal);
						} catch (NumberFormatException | NullPointerException e) {
							missingCnt++;
						}
            		}
					
					if (Double.isNaN(stats.getMin()) || Double.isNaN(stats.getMax())) {
						obj.put(getRowKey(rowNames, 3), "");
						obj.put(getRowKey(rowNames, 4), "");
						obj.put(getRowKey(rowNames, 5), "");
						obj.put(getRowKey(rowNames, 6), "");
						obj.put(getRowKey(rowNames, 7), "");
						obj.put(getRowKey(rowNames, 8), "");
						obj.put(getRowKey(rowNames, 9), "");
						obj.put(getRowKey(rowNames, 10), "");
					} else {
						obj.put(getRowKey(rowNames, 3), stats.getN());
						obj.put(getRowKey(rowNames, 4), missingCnt);
						obj.put(getRowKey(rowNames, 5), stats.getMin());
						obj.put(getRowKey(rowNames, 6), stats.getMax());
						obj.put(getRowKey(rowNames, 7), addDotString(stats.getMean()));
						obj.put(getRowKey(rowNames, 8), addDotString(stats.getStandardDeviation()));
						obj.put(getRowKey(rowNames, 9), addDotString(stats.getVariance()));
						obj.put(getRowKey(rowNames, 10), "");
					}
					
            	} else if (columnType.equals("double")) {

                	try {
						chartRow = (chartRows.get(i).stream().sorted((a, b) -> {
							Double newA = Double.parseDouble(a.toString());
							Double newB = Double.parseDouble(b.toString());
							return Double.compare(newA, newB);
						}).collect(Collectors.toCollection(ArrayList::new)));
						
						chartRows.remove(i);
						chartRows.add(i, chartRow);
					} catch (Exception e1) {
						// do nothing
					}
                	
            		SummaryStatistics stats = new SummaryStatistics();
            		
            		int missingCnt = 0;
					while(chartRowIt.hasNext()) {
						try {
							double rowVal = Double.parseDouble(chartRowIt.next().toString());
							stats.addValue(rowVal);
						} catch (NumberFormatException | NullPointerException e) {
							missingCnt++;
						}
            		}
					
					if (Double.isNaN(stats.getMin()) || Double.isNaN(stats.getMax())) {
						obj.put(getRowKey(rowNames, 3), "");
						obj.put(getRowKey(rowNames, 4), "");
						obj.put(getRowKey(rowNames, 5), "");
						obj.put(getRowKey(rowNames, 6), "");
						obj.put(getRowKey(rowNames, 7), "");
						obj.put(getRowKey(rowNames, 8), "");
						obj.put(getRowKey(rowNames, 9), "");
						obj.put(getRowKey(rowNames, 10), "");
					} else {
						obj.put(getRowKey(rowNames, 3), stats.getN());
	            		obj.put(getRowKey(rowNames, 4), missingCnt);
	            		obj.put(getRowKey(rowNames, 5), stats.getMin());
	            		obj.put(getRowKey(rowNames, 6), stats.getMax());
	            		obj.put(getRowKey(rowNames, 7), addDotString(stats.getMean()));
	            		obj.put(getRowKey(rowNames, 8), addDotString(stats.getStandardDeviation()));
	            		obj.put(getRowKey(rowNames, 9), addDotString(stats.getVariance()));
	            		obj.put(getRowKey(rowNames, 10), "");
					}
            	} else {
            		int missingCnt = 0;
					while(chartRowIt.hasNext()) {
						Object str = chartRowIt.next();
						if (str == null || str.equals("") || str.toString().toLowerCase().equals("null")) {
							missingCnt++;
						}
					}
					obj.put(getRowKey(rowNames, 3), chartRow.size());
            		obj.put(getRowKey(rowNames, 4), missingCnt);
            	}
            	
				frequencyList.add(
						chartRow.stream()
						.collect(Collectors.groupingBy(e -> Optional.ofNullable(e), Collectors.counting())));
				
            	columnInfo.add(obj);
            	i++;
            }
            
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("columnInfo", columnInfo);
            result.put("chartRows", chartRows);
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
		
		if(splited[1].equals("00000")) {
			return splited[0]; 
		} else {
			return stringValue;
		}
	}
	
	private List<Map<String, String>> getRowNames() {
//        JsonArray rowNames = new JsonArray();
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

	private List<List<Object>> createChartRows(Project project, int columnNamesSize) {
        List<List<Object>> chartRows = new ArrayList<List<Object>>();
        Iterator<Row> it = project.rows.iterator();
        
        // rows를 먼저 구한다.
        while(it.hasNext()) {
        	Row row = it.next(); // project row
        	
        	for (int i = 0; i < columnNamesSize; i++) {
        		if (chartRows.size() <= i) {
					chartRows.add(new ArrayList<Object>());
        		}
        		Object columnRow = row.getCellValue(i);
        		chartRows.get(i).add(columnRow);
        	}
        }
        
        return chartRows;
	}

	private String getColumnType(List<Object> list) {
		Object firstVal = list.get(0);
	    try {
	        Double.parseDouble(firstVal.toString());
	        
	        if (NumberUtils.isDigits(firstVal.toString())) {
	        	return "int";
	        } else {
	        	return "double";
	        }
	    } catch (NumberFormatException e) {
	        return "string";
	    }
	}

	public static void main(String[] args) {
		// array 건수 별 소요 시간 계산
		// getStatisticsTest();
		
//		double num = 8.479179458244507E11;
//		double num2 = 8.479179;
//		NumberFormat f = NumberFormat.getInstance();
//		f.setGroupingUsed(false);
//		
//		System.out.println(f.format(num));
//		System.out.println(f.format(num2));
		
//		List<Object> arr = new ArrayList<Object>();
//		arr.add("3");
//		arr.add("5");
//		arr.add("1");
//		
////		List<Object> newArr = arr.stream().sorted().collect(Collectors.toCollection(ArrayList::new));
////		
//		arr.remove(1);
//		arr.add(1, 4);
//		Iterator<Object> it = arr.iterator();
//		while (it.hasNext()) {
//			System.out.println(it.next());
//		}
		// 빈도수
//		getFrequency();
		
		// 소숫점 계산
//		
//		double doubleValue1 = 123.0;
//		System.out.println(addDotString(doubleValue1));
//		
//		double doubleValue2 = 123.123123;
//		System.out.println(addDotString(doubleValue2));
				
//		
//		Object a = null;
//		Object b = "";
//		Object c = "null";
//		
//		System.out.println(a == null);
////		System.out.println(a.equals(null));
//		System.out.println(b == "");
//		System.out.println(b.equals(""));
//		System.out.println(c == "null".toLowerCase());
		
		String[] a = {"a", "b", "c"};

		String test = "aa";
		System.out.println(Arrays.asList(a).contains(test));
		
//		for (String _t : a) {
//			System.out.println(_t);
//		}
		List<String> arr = new ArrayList<String>();
		arr.add("1");
		arr.add("2");
		arr.add("3");
		Iterator<String> it = arr.iterator();
		while(it.hasNext()) {
			String no = it.next();
			if (no.equals("2")) {
				continue;
			}
			System.out.println(no);
		}
	}
//	
//	private static String addDotString(double doubleValue) {
//		String stringValue = String.format(DOT_STRING, doubleValue);
//		String[] splited = stringValue.split("\\.");
//		
//		if(splited[1].equals("00000")) {
//			return splited[0]; 
//		} else {
//			return stringValue;
//		}
	
//	Object headers = "[1,2,3]";
	
	
//	}
	
	private static void getFrequency() {
		// 빈도수 테스트
		List<String> arr = new ArrayList<String>();
		arr.add("1");
		arr.add("2");
		arr.add("3");
		arr.add("2");
		arr.add("1");
		arr.add("3");
		arr.add("2");
		arr.add("1");
		arr.add("3");
		arr.add("1");
		arr.add("2");
		
		Map<Object, Long> newArr = arr.stream().collect(Collectors.groupingBy(e -> e, Collectors.counting()));
		System.out.println(newArr);
	}

	private static void getStatisticsTest() {
		long start = System.currentTimeMillis();
		IntSummaryStatistics stats = new IntSummaryStatistics();
		
		int size = 100000000; 	// 10 sec
//		int size = 10000000; 	// 1 sec
		for (int i = 0; i < size; i++) {
			int dValue = (int) ((Math.random()*10000)%10);
			stats.accept(dValue);
		}
		System.out.println(stats);
		long end = System.currentTimeMillis();
		System.out.println(end-start);
		System.out.println( "실행 시간 : " + (( end - start )/1000) +"초");
	}
}
