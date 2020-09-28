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
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.google.refine.commands.Command;
import com.google.refine.model.ColumnModel;
import com.google.refine.model.Project;
import com.google.refine.model.Row;
import com.google.refine.util.ParsingUtilities;

public class GetQuantitativeEvaluationCommand extends Command {

	public static enum CHART_TYPE {
		BAR, LINE, DOT, RADAR, DATAHEATMAP
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

			String chartTypeParam = request.getParameter("chartType");
			
			List<String> columnNames = projectModel.getColumnNames();
			String[] selectedColumns = request.getParameter("headers").split(",");
			List<List<Object>> chartRows = createChartRows(project, columnNames, selectedColumns);

			Iterator<List<Object>> it = chartRows.iterator();
			
			JSONArray data = new JSONArray();
			while (it.hasNext()) {
				it.next();
				JSONArray eachData = new JSONArray();
				if (CHART_TYPE.BAR.name().equals(chartTypeParam)) {
					eachData = getData_BAR(selectedColumns);
				} else if (CHART_TYPE.LINE.name().equals(chartTypeParam)) {
					eachData = getData_LINE(selectedColumns);
				} else if (CHART_TYPE.DOT.name().equals(chartTypeParam)) {
					eachData = getData_DOT(selectedColumns);
				} else if (CHART_TYPE.RADAR.name().equals(chartTypeParam)) {
					eachData = getData_RADAR(selectedColumns);
				} else if (CHART_TYPE.DATAHEATMAP.name().equals(chartTypeParam)) {
					eachData = getData_DATAHEATMAP(selectedColumns);
				}
				data.add(eachData);
			}

			
			Map<String, Object> result = new HashMap<String, Object>();
			// add params
			result.put("chartType", chartTypeParam);
			result.put("data", data);

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

	private JSONArray getData_BAR(String[] selectedColumns) throws ParseException {
		String str = "[{\"name\":\"E\",\"value\":0.12702},{\"name\":\"T\",\"value\":0.09056},{\"name\":\"A\",\"value\":0.08167},{\"name\":\"O\",\"value\":0.07507},{\"name\":\"I\",\"value\":0.06966},{\"name\":\"N\",\"value\":0.06749},{\"name\":\"S\",\"value\":0.06327},{\"name\":\"H\",\"value\":0.06094},{\"name\":\"R\",\"value\":0.05987},{\"name\":\"D\",\"value\":0.04253},{\"name\":\"L\",\"value\":0.04025},{\"name\":\"C\",\"value\":0.02782},{\"name\":\"U\",\"value\":0.02758},{\"name\":\"M\",\"value\":0.02406},{\"name\":\"W\",\"value\":0.0236},{\"name\":\"F\",\"value\":0.02288},{\"name\":\"G\",\"value\":0.02015},{\"name\":\"Y\",\"value\":0.01974},{\"name\":\"P\",\"value\":0.01929},{\"name\":\"B\",\"value\":0.01492},{\"name\":\"V\",\"value\":0.00978},{\"name\":\"K\",\"value\":0.00772},{\"name\":\"J\",\"value\":0.00153},{\"name\":\"X\",\"value\":0.0015},{\"name\":\"Q\",\"value\":0.00095},{\"name\":\"Z\",\"value\":0.00074}]";

		JSONParser jsonParser = new JSONParser();
		return (JSONArray) jsonParser.parse(str);
	}

	private JSONArray getData_LINE(String[] selectedColumns) throws ParseException {
		String str = "[{\"date\":\"2007-11-25T00:00:00.000Z\",\"value\":172.54},{\"date\":\"2007-11-26T00:00:00.000Z\",\"value\":174.81},{\"date\":\"2007-11-27T00:00:00.000Z\",\"value\":180.22},{\"date\":\"2007-11-28T00:00:00.000Z\",\"value\":184.29},{\"date\":\"2007-11-29T00:00:00.000Z\",\"value\":182.22},{\"date\":\"2007-12-03T00:00:00.000Z\",\"value\":178.86},{\"date\":\"2007-12-04T00:00:00.000Z\",\"value\":179.81},{\"date\":\"2007-12-05T00:00:00.000Z\",\"value\":185.5},{\"date\":\"2007-12-06T00:00:00.000Z\",\"value\":189.95},{\"date\":\"2007-12-07T00:00:00.000Z\",\"value\":194.3},{\"date\":\"2007-12-09T00:00:00.000Z\",\"value\":194.21},{\"date\":\"2007-12-10T00:00:00.000Z\",\"value\":188.54},{\"date\":\"2007-12-11T00:00:00.000Z\",\"value\":190.86},{\"date\":\"2007-12-12T00:00:00.000Z\",\"value\":191.83},{\"date\":\"2007-12-13T00:00:00.000Z\",\"value\":190.39},{\"date\":\"2007-12-16T00:00:00.000Z\",\"value\":184.4},{\"date\":\"2007-12-17T00:00:00.000Z\",\"value\":182.98},{\"date\":\"2007-12-18T00:00:00.000Z\",\"value\":183.12},{\"date\":\"2007-12-19T00:00:00.000Z\",\"value\":187.21},{\"date\":\"2007-12-20T00:00:00.000Z\",\"value\":193.91},{\"date\":\"2007-12-23T00:00:00.000Z\",\"value\":198.8},{\"date\":\"2007-12-25T00:00:00.000Z\",\"value\":198.95},{\"date\":\"2007-12-26T00:00:00.000Z\",\"value\":198.57},{\"date\":\"2007-12-27T00:00:00.000Z\",\"value\":199.83},{\"date\":\"2007-12-30T00:00:00.000Z\",\"value\":198.08},{\"date\":\"2008-01-02T00:00:00.000Z\",\"value\":194.84},{\"date\":\"2008-01-03T00:00:00.000Z\",\"value\":194.93},{\"date\":\"2008-01-04T00:00:00.000Z\",\"value\":180.05},{\"date\":\"2008-01-07T00:00:00.000Z\",\"value\":177.64},{\"date\":\"2008-01-08T00:00:00.000Z\",\"value\":171.25},{\"date\":\"2008-01-09T00:00:00.000Z\",\"value\":179.4},{\"date\":\"2008-01-09T00:00:00.000Z\",\"value\":178.02},{\"date\":\"2008-01-10T00:00:00.000Z\",\"value\":172.69},{\"date\":\"2008-01-13T00:00:00.000Z\",\"value\":178.78},{\"date\":\"2008-01-14T00:00:00.000Z\",\"value\":169.04},{\"date\":\"2008-01-15T00:00:00.000Z\",\"value\":159.64},{\"date\":\"2008-01-16T00:00:00.000Z\",\"value\":160.89},{\"date\":\"2008-01-17T00:00:00.000Z\",\"value\":161.36},{\"date\":\"2008-01-21T00:00:00.000Z\",\"value\":155.64},{\"date\":\"2008-01-22T00:00:00.000Z\",\"value\":139.07},{\"date\":\"2008-01-23T00:00:00.000Z\",\"value\":135.6},{\"date\":\"2008-01-24T00:00:00.000Z\",\"value\":130.01},{\"date\":\"2008-01-27T00:00:00.000Z\",\"value\":130.01},{\"date\":\"2008-01-28T00:00:00.000Z\",\"value\":131.54},{\"date\":\"2008-01-29T00:00:00.000Z\",\"value\":132.18},{\"date\":\"2008-01-30T00:00:00.000Z\",\"value\":135.36},{\"date\":\"2008-02-01T00:00:00.000Z\",\"value\":133.75},{\"date\":\"2008-02-04T00:00:00.000Z\",\"value\":131.65},{\"date\":\"2008-02-05T00:00:00.000Z\",\"value\":129.36},{\"date\":\"2008-02-06T00:00:00.000Z\",\"value\":122}]";

		JSONParser jsonParser = new JSONParser();
		return (JSONArray) jsonParser.parse(str);
	}

	private JSONArray getData_DOT(String[] selectedColumns) throws ParseException {
		String str = "[{\"category\":\"setosa\",\"x\":5.1,\"y\":3.5},{\"category\":\"setosa\",\"x\":4.9,\"y\":3},{\"category\":\"setosa\",\"x\":4.7,\"y\":3.2},{\"category\":\"setosa\",\"x\":4.6,\"y\":3.1},{\"category\":\"setosa\",\"x\":5,\"y\":3.6},{\"category\":\"setosa\",\"x\":5.4,\"y\":3.9},{\"category\":\"setosa\",\"x\":4.6,\"y\":3.4},{\"category\":\"setosa\",\"x\":5,\"y\":3.4},{\"category\":\"setosa\",\"x\":4.4,\"y\":2.9},{\"category\":\"setosa\",\"x\":4.9,\"y\":3.1},{\"category\":\"setosa\",\"x\":5.4,\"y\":3.7},{\"category\":\"setosa\",\"x\":4.8,\"y\":3.4},{\"category\":\"setosa\",\"x\":4.8,\"y\":3},{\"category\":\"setosa\",\"x\":4.3,\"y\":3},{\"category\":\"setosa\",\"x\":5.8,\"y\":4},{\"category\":\"setosa\",\"x\":5.7,\"y\":4.4},{\"category\":\"setosa\",\"x\":5.4,\"y\":3.9},{\"category\":\"setosa\",\"x\":5.1,\"y\":3.5},{\"category\":\"setosa\",\"x\":5.7,\"y\":3.8},{\"category\":\"setosa\",\"x\":5.1,\"y\":3.8},{\"category\":\"setosa\",\"x\":5.4,\"y\":3.4},{\"category\":\"setosa\",\"x\":5.1,\"y\":3.7},{\"category\":\"setosa\",\"x\":4.6,\"y\":3.6},{\"category\":\"setosa\",\"x\":5.1,\"y\":3.3},{\"category\":\"setosa\",\"x\":4.8,\"y\":3.4},{\"category\":\"setosa\",\"x\":5,\"y\":3},{\"category\":\"setosa\",\"x\":5,\"y\":3.4},{\"category\":\"setosa\",\"x\":5.2,\"y\":3.5},{\"category\":\"setosa\",\"x\":5.2,\"y\":3.4},{\"category\":\"setosa\",\"x\":4.7,\"y\":3.2},{\"category\":\"setosa\",\"x\":4.8,\"y\":3.1},{\"category\":\"setosa\",\"x\":5.4,\"y\":3.4},{\"category\":\"setosa\",\"x\":5.2,\"y\":4.1},{\"category\":\"setosa\",\"x\":5.5,\"y\":4.2},{\"category\":\"setosa\",\"x\":4.9,\"y\":3.1},{\"category\":\"setosa\",\"x\":5,\"y\":3.2},{\"category\":\"setosa\",\"x\":5.5,\"y\":3.5},{\"category\":\"setosa\",\"x\":4.9,\"y\":3.6},{\"category\":\"setosa\",\"x\":4.4,\"y\":3},{\"category\":\"setosa\",\"x\":5.1,\"y\":3.4},{\"category\":\"setosa\",\"x\":5,\"y\":3.5},{\"category\":\"setosa\",\"x\":4.5,\"y\":2.3},{\"category\":\"setosa\",\"x\":4.4,\"y\":3.2},{\"category\":\"setosa\",\"x\":5,\"y\":3.5},{\"category\":\"setosa\",\"x\":5.1,\"y\":3.8},{\"category\":\"setosa\",\"x\":4.8,\"y\":3},{\"category\":\"setosa\",\"x\":5.1,\"y\":3.8},{\"category\":\"setosa\",\"x\":4.6,\"y\":3.2},{\"category\":\"setosa\",\"x\":5.3,\"y\":3.7},{\"category\":\"setosa\",\"x\":5,\"y\":3.3},{\"category\":\"versicolor\",\"x\":7,\"y\":3.2},{\"category\":\"versicolor\",\"x\":6.4,\"y\":3.2},{\"category\":\"versicolor\",\"x\":6.9,\"y\":3.1},{\"category\":\"versicolor\",\"x\":5.5,\"y\":2.3},{\"category\":\"versicolor\",\"x\":6.5,\"y\":2.8},{\"category\":\"versicolor\",\"x\":5.7,\"y\":2.8},{\"category\":\"versicolor\",\"x\":6.3,\"y\":3.3},{\"category\":\"versicolor\",\"x\":4.9,\"y\":2.4},{\"category\":\"versicolor\",\"x\":6.6,\"y\":2.9},{\"category\":\"versicolor\",\"x\":5.2,\"y\":2.7},{\"category\":\"versicolor\",\"x\":5,\"y\":2},{\"category\":\"versicolor\",\"x\":5.9,\"y\":3},{\"category\":\"versicolor\",\"x\":6,\"y\":2.2},{\"category\":\"versicolor\",\"x\":6.1,\"y\":2.9},{\"category\":\"versicolor\",\"x\":5.6,\"y\":2.9},{\"category\":\"versicolor\",\"x\":6.7,\"y\":3.1},{\"category\":\"versicolor\",\"x\":5.6,\"y\":3},{\"category\":\"versicolor\",\"x\":5.8,\"y\":2.7},{\"category\":\"versicolor\",\"x\":6.2,\"y\":2.2},{\"category\":\"versicolor\",\"x\":5.6,\"y\":2.5},{\"category\":\"versicolor\",\"x\":5.9,\"y\":3.2},{\"category\":\"versicolor\",\"x\":6.1,\"y\":2.8},{\"category\":\"versicolor\",\"x\":6.3,\"y\":2.5},{\"category\":\"versicolor\",\"x\":6.1,\"y\":2.8},{\"category\":\"versicolor\",\"x\":6.4,\"y\":2.9},{\"category\":\"versicolor\",\"x\":6.6,\"y\":3},{\"category\":\"versicolor\",\"x\":6.8,\"y\":2.8},{\"category\":\"versicolor\",\"x\":6.7,\"y\":3},{\"category\":\"versicolor\",\"x\":6,\"y\":2.9},{\"category\":\"versicolor\",\"x\":5.7,\"y\":2.6},{\"category\":\"versicolor\",\"x\":5.5,\"y\":2.4},{\"category\":\"versicolor\",\"x\":5.5,\"y\":2.4},{\"category\":\"versicolor\",\"x\":5.8,\"y\":2.7},{\"category\":\"versicolor\",\"x\":6,\"y\":2.7},{\"category\":\"versicolor\",\"x\":5.4,\"y\":3},{\"category\":\"versicolor\",\"x\":6,\"y\":3.4},{\"category\":\"versicolor\",\"x\":6.7,\"y\":3.1},{\"category\":\"versicolor\",\"x\":6.3,\"y\":2.3},{\"category\":\"versicolor\",\"x\":5.6,\"y\":3},{\"category\":\"versicolor\",\"x\":5.5,\"y\":2.5},{\"category\":\"versicolor\",\"x\":5.5,\"y\":2.6},{\"category\":\"versicolor\",\"x\":6.1,\"y\":3},{\"category\":\"versicolor\",\"x\":5.8,\"y\":2.6},{\"category\":\"versicolor\",\"x\":5,\"y\":2.3},{\"category\":\"versicolor\",\"x\":5.6,\"y\":2.7},{\"category\":\"versicolor\",\"x\":5.7,\"y\":3},{\"category\":\"versicolor\",\"x\":5.7,\"y\":2.9},{\"category\":\"versicolor\",\"x\":6.2,\"y\":2.9},{\"category\":\"versicolor\",\"x\":5.1,\"y\":2.5},{\"category\":\"versicolor\",\"x\":5.7,\"y\":2.8},{\"category\":\"virginica\",\"x\":6.3,\"y\":3.3},{\"category\":\"virginica\",\"x\":5.8,\"y\":2.7},{\"category\":\"virginica\",\"x\":7.1,\"y\":3},{\"category\":\"virginica\",\"x\":6.3,\"y\":2.9},{\"category\":\"virginica\",\"x\":6.5,\"y\":3},{\"category\":\"virginica\",\"x\":7.6,\"y\":3},{\"category\":\"virginica\",\"x\":4.9,\"y\":2.5},{\"category\":\"virginica\",\"x\":7.3,\"y\":2.9},{\"category\":\"virginica\",\"x\":6.7,\"y\":2.5},{\"category\":\"virginica\",\"x\":7.2,\"y\":3.6},{\"category\":\"virginica\",\"x\":6.5,\"y\":3.2},{\"category\":\"virginica\",\"x\":6.4,\"y\":2.7},{\"category\":\"virginica\",\"x\":6.8,\"y\":3},{\"category\":\"virginica\",\"x\":5.7,\"y\":2.5},{\"category\":\"virginica\",\"x\":5.8,\"y\":2.8},{\"category\":\"virginica\",\"x\":6.4,\"y\":3.2},{\"category\":\"virginica\",\"x\":6.5,\"y\":3},{\"category\":\"virginica\",\"x\":7.7,\"y\":3.8},{\"category\":\"virginica\",\"x\":7.7,\"y\":2.6},{\"category\":\"virginica\",\"x\":6,\"y\":2.2},{\"category\":\"virginica\",\"x\":6.9,\"y\":3.2},{\"category\":\"virginica\",\"x\":5.6,\"y\":2.8},{\"category\":\"virginica\",\"x\":7.7,\"y\":2.8},{\"category\":\"virginica\",\"x\":6.3,\"y\":2.7},{\"category\":\"virginica\",\"x\":6.7,\"y\":3.3},{\"category\":\"virginica\",\"x\":7.2,\"y\":3.2},{\"category\":\"virginica\",\"x\":6.2,\"y\":2.8},{\"category\":\"virginica\",\"x\":6.1,\"y\":3},{\"category\":\"virginica\",\"x\":6.4,\"y\":2.8},{\"category\":\"virginica\",\"x\":7.2,\"y\":3},{\"category\":\"virginica\",\"x\":7.4,\"y\":2.8},{\"category\":\"virginica\",\"x\":7.9,\"y\":3.8},{\"category\":\"virginica\",\"x\":6.4,\"y\":2.8},{\"category\":\"virginica\",\"x\":6.3,\"y\":2.8},{\"category\":\"virginica\",\"x\":6.1,\"y\":2.6},{\"category\":\"virginica\",\"x\":7.7,\"y\":3},{\"category\":\"virginica\",\"x\":6.3,\"y\":3.4},{\"category\":\"virginica\",\"x\":6.4,\"y\":3.1},{\"category\":\"virginica\",\"x\":6,\"y\":3},{\"category\":\"virginica\",\"x\":6.9,\"y\":3.1},{\"category\":\"virginica\",\"x\":6.7,\"y\":3.1},{\"category\":\"virginica\",\"x\":6.9,\"y\":3.1},{\"category\":\"virginica\",\"x\":5.8,\"y\":2.7},{\"category\":\"virginica\",\"x\":6.8,\"y\":3.2},{\"category\":\"virginica\",\"x\":6.7,\"y\":3.3},{\"category\":\"virginica\",\"x\":6.7,\"y\":3},{\"category\":\"virginica\",\"x\":6.3,\"y\":2.5},{\"category\":\"virginica\",\"x\":6.5,\"y\":3},{\"category\":\"virginica\",\"x\":6.2,\"y\":3.4},{\"category\":\"virginica\",\"x\":5.9,\"y\":3}]";

		JSONParser jsonParser = new JSONParser();
		return (JSONArray) jsonParser.parse(str);
	}

	private JSONArray getData_RADAR(String[] selectedColumns) throws ParseException {
		String str = "[[{\"area\": \"Central \", \"value\": 80},{\"area\": \"Kirkdale\", \"value\": 40},{\"area\": \"Kensington \", \"value\": 40},{\"area\": \"Everton \", \"value\": 90},{\"area\": \"Picton \", \"value\": 60},{\"area\": \"Riverside \", \"value\": 80}]]";

		JSONParser jsonParser = new JSONParser();
		return (JSONArray) jsonParser.parse(str);
	}

	private JSONArray getData_DATAHEATMAP(String[] selectedColumns) throws ParseException {
		String str = "[{\"group\":\"A\",\"variable\":\"v1\",\"value\":\"30\"},{\"group\":\"A\",\"variable\":\"v2\",\"value\":\"95\"},{\"group\":\"A\",\"variable\":\"v3\",\"value\":\"22\"},{\"group\":\"A\",\"variable\":\"v4\",\"value\":\"14\"},{\"group\":\"A\",\"variable\":\"v5\",\"value\":\"59\"},{\"group\":\"A\",\"variable\":\"v6\",\"value\":\"52\"},{\"group\":\"A\",\"variable\":\"v7\",\"value\":\"88\"},{\"group\":\"A\",\"variable\":\"v8\",\"value\":\"20\"},{\"group\":\"A\",\"variable\":\"v9\",\"value\":\"99\"},{\"group\":\"A\",\"variable\":\"v10\",\"value\":\"66\"},{\"group\":\"B\",\"variable\":\"v1\",\"value\":\"37\"},{\"group\":\"B\",\"variable\":\"v2\",\"value\":\"50\"},{\"group\":\"B\",\"variable\":\"v3\",\"value\":\"81\"},{\"group\":\"B\",\"variable\":\"v4\",\"value\":\"79\"},{\"group\":\"B\",\"variable\":\"v5\",\"value\":\"84\"},{\"group\":\"B\",\"variable\":\"v6\",\"value\":\"91\"},{\"group\":\"B\",\"variable\":\"v7\",\"value\":\"82\"},{\"group\":\"B\",\"variable\":\"v8\",\"value\":\"89\"},{\"group\":\"B\",\"variable\":\"v9\",\"value\":\"6\"},{\"group\":\"B\",\"variable\":\"v10\",\"value\":\"67\"},{\"group\":\"C\",\"variable\":\"v1\",\"value\":\"96\"},{\"group\":\"C\",\"variable\":\"v2\",\"value\":\"13\"},{\"group\":\"C\",\"variable\":\"v3\",\"value\":\"98\"},{\"group\":\"C\",\"variable\":\"v4\",\"value\":\"10\"},{\"group\":\"C\",\"variable\":\"v5\",\"value\":\"86\"},{\"group\":\"C\",\"variable\":\"v6\",\"value\":\"23\"},{\"group\":\"C\",\"variable\":\"v7\",\"value\":\"74\"},{\"group\":\"C\",\"variable\":\"v8\",\"value\":\"47\"},{\"group\":\"C\",\"variable\":\"v9\",\"value\":\"73\"},{\"group\":\"C\",\"variable\":\"v10\",\"value\":\"40\"},{\"group\":\"D\",\"variable\":\"v1\",\"value\":\"75\"},{\"group\":\"D\",\"variable\":\"v2\",\"value\":\"18\"},{\"group\":\"D\",\"variable\":\"v3\",\"value\":\"92\"},{\"group\":\"D\",\"variable\":\"v4\",\"value\":\"43\"},{\"group\":\"D\",\"variable\":\"v5\",\"value\":\"16\"},{\"group\":\"D\",\"variable\":\"v6\",\"value\":\"27\"},{\"group\":\"D\",\"variable\":\"v7\",\"value\":\"76\"},{\"group\":\"D\",\"variable\":\"v8\",\"value\":\"24\"},{\"group\":\"D\",\"variable\":\"v9\",\"value\":\"1\"},{\"group\":\"D\",\"variable\":\"v10\",\"value\":\"87\"},{\"group\":\"E\",\"variable\":\"v1\",\"value\":\"44\"},{\"group\":\"E\",\"variable\":\"v2\",\"value\":\"29\"},{\"group\":\"E\",\"variable\":\"v3\",\"value\":\"58\"},{\"group\":\"E\",\"variable\":\"v4\",\"value\":\"55\"},{\"group\":\"E\",\"variable\":\"v5\",\"value\":\"65\"},{\"group\":\"E\",\"variable\":\"v6\",\"value\":\"56\"},{\"group\":\"E\",\"variable\":\"v7\",\"value\":\"9\"},{\"group\":\"E\",\"variable\":\"v8\",\"value\":\"78\"},{\"group\":\"E\",\"variable\":\"v9\",\"value\":\"49\"},{\"group\":\"E\",\"variable\":\"v10\",\"value\":\"36\"},{\"group\":\"F\",\"variable\":\"v1\",\"value\":\"35\"},{\"group\":\"F\",\"variable\":\"v2\",\"value\":\"80\"},{\"group\":\"F\",\"variable\":\"v3\",\"value\":\"8\"},{\"group\":\"F\",\"variable\":\"v4\",\"value\":\"46\"},{\"group\":\"F\",\"variable\":\"v5\",\"value\":\"48\"},{\"group\":\"F\",\"variable\":\"v6\",\"value\":\"100\"},{\"group\":\"F\",\"variable\":\"v7\",\"value\":\"17\"},{\"group\":\"F\",\"variable\":\"v8\",\"value\":\"41\"},{\"group\":\"F\",\"variable\":\"v9\",\"value\":\"33\"},{\"group\":\"F\",\"variable\":\"v10\",\"value\":\"11\"},{\"group\":\"G\",\"variable\":\"v1\",\"value\":\"77\"},{\"group\":\"G\",\"variable\":\"v2\",\"value\":\"62\"},{\"group\":\"G\",\"variable\":\"v3\",\"value\":\"94\"},{\"group\":\"G\",\"variable\":\"v4\",\"value\":\"15\"},{\"group\":\"G\",\"variable\":\"v5\",\"value\":\"69\"},{\"group\":\"G\",\"variable\":\"v6\",\"value\":\"63\"},{\"group\":\"G\",\"variable\":\"v7\",\"value\":\"61\"},{\"group\":\"G\",\"variable\":\"v8\",\"value\":\"54\"},{\"group\":\"G\",\"variable\":\"v9\",\"value\":\"38\"},{\"group\":\"G\",\"variable\":\"v10\",\"value\":\"93\"},{\"group\":\"H\",\"variable\":\"v1\",\"value\":\"39\"},{\"group\":\"H\",\"variable\":\"v2\",\"value\":\"26\"},{\"group\":\"H\",\"variable\":\"v3\",\"value\":\"90\"},{\"group\":\"H\",\"variable\":\"v4\",\"value\":\"83\"},{\"group\":\"H\",\"variable\":\"v5\",\"value\":\"31\"},{\"group\":\"H\",\"variable\":\"v6\",\"value\":\"2\"},{\"group\":\"H\",\"variable\":\"v7\",\"value\":\"51\"},{\"group\":\"H\",\"variable\":\"v8\",\"value\":\"28\"},{\"group\":\"H\",\"variable\":\"v9\",\"value\":\"42\"},{\"group\":\"H\",\"variable\":\"v10\",\"value\":\"7\"},{\"group\":\"I\",\"variable\":\"v1\",\"value\":\"5\"},{\"group\":\"I\",\"variable\":\"v2\",\"value\":\"60\"},{\"group\":\"I\",\"variable\":\"v3\",\"value\":\"21\"},{\"group\":\"I\",\"variable\":\"v4\",\"value\":\"25\"},{\"group\":\"I\",\"variable\":\"v5\",\"value\":\"3\"},{\"group\":\"I\",\"variable\":\"v6\",\"value\":\"70\"},{\"group\":\"I\",\"variable\":\"v7\",\"value\":\"34\"},{\"group\":\"I\",\"variable\":\"v8\",\"value\":\"68\"},{\"group\":\"I\",\"variable\":\"v9\",\"value\":\"57\"},{\"group\":\"I\",\"variable\":\"v10\",\"value\":\"32\"},{\"group\":\"J\",\"variable\":\"v1\",\"value\":\"19\"},{\"group\":\"J\",\"variable\":\"v2\",\"value\":\"85\"},{\"group\":\"J\",\"variable\":\"v3\",\"value\":\"53\"},{\"group\":\"J\",\"variable\":\"v4\",\"value\":\"45\"},{\"group\":\"J\",\"variable\":\"v5\",\"value\":\"71\"},{\"group\":\"J\",\"variable\":\"v6\",\"value\":\"64\"},{\"group\":\"J\",\"variable\":\"v7\",\"value\":\"4\"},{\"group\":\"J\",\"variable\":\"v8\",\"value\":\"12\"},{\"group\":\"J\",\"variable\":\"v9\",\"value\":\"97\"},{\"group\":\"J\",\"variable\":\"v10\",\"value\":\"72\"}]";

		JSONParser jsonParser = new JSONParser();
		return (JSONArray) jsonParser.parse(str);
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
}
