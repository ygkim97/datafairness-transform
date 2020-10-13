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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.refine.commands.Command;
import com.google.refine.model.ColumnModel;
import com.google.refine.model.Project;
import com.google.refine.statistic.AccuracyIndex;
import com.google.refine.statistic.CompeletenessIndex;
import com.google.refine.statistic.DataQualityIndex;
import com.google.refine.util.ParsingUtilities;

public class SetEvaluationIndexCorrectedCommand extends Command {

	public static enum INDEX_TYPE {
		ACCURACY,
		COMPLETENESS,
		CONSISTENCY,
		PRESENT,
		COMPLIANCE,
		PRECISION,
		TRACEABILITY,
		UNDERSTANDING
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

			String[] selectedColumns = request.getParameter("columnId").split(",");
			String indexId = request.getParameter("indexId");
			String correctedIndex = request.getParameter("correctedIndex");
			
			List<Object> chartRow = DataQualityUtils.createChartRows(project, columnNames, selectedColumns).get(0);
			
			DataQualityIndex index = getIndexClass(indexId, chartRow);
			if (index == null) {
				// do something 
				throw new Exception();
			}

//			index.corrected(correctedIndex, request, response);
			
			Map<String, Object> result = new HashMap<String, Object>();
			// add params
			result.put("success", true);

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
	
	private DataQualityIndex getIndexClass(String indexId, List<Object> chartRow) {
		if (indexId.equals(INDEX_TYPE.ACCURACY.name())) {
			return new AccuracyIndex(chartRow);
		} else if (indexId.equals(INDEX_TYPE.COMPLETENESS.name())) {
			return new CompeletenessIndex(chartRow);
		} else if (indexId.equals(INDEX_TYPE.CONSISTENCY.name())) {
		} else if (indexId.equals(INDEX_TYPE.PRESENT.name())) {
		} else if (indexId.equals(INDEX_TYPE.PRECISION.name())) {
		} else if (indexId.equals(INDEX_TYPE.TRACEABILITY.name())) {
		} else if (indexId.equals(INDEX_TYPE.UNDERSTANDING.name())) {
		}
		return null;
	}
}
