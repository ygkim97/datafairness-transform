/*******************************************************************************
 * Copyright (C) 2018, OpenRefine contributors
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
package com.google.refine.commands.statistic;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.refine.model.Project;
import com.google.refine.model.Row;

abstract public class DataQualityUtils {
    final static protected Logger logger = LoggerFactory.getLogger("command");

    static public List<List<Object>> createChartRows(Project project, List<String> columnNames, String[] selectedColumns) {
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
}
