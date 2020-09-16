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
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.refine.commands.Command;
import com.google.refine.model.Project;
import com.google.refine.util.ParsingUtilities;

public class GetQuantitativeEvaluationCommand extends Command {
	
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

			Map<String, Object> result = new HashMap<String, Object>();
			
			// add params
			result.put("0", getData0(project));
			result.put("1", getData1(project));
			result.put("2", "d2");
			result.put("3", "d3");
			result.put("4", "d4");
			result.put("5", "d5");
			result.put("6", "d6");
			result.put("7", "d7");
			result.put("8", "d8");
			result.put("9", "d9");

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

	// get project, and put result (quantitative evaluation value)
	// 각각의 차트 타입에 맞게 데이터를 가공한다. 
	private List<Map<String, String>> getData0(Project project) {
		List<Map<String, String>> result = new ArrayList<Map<String, String>>();
		
		Map<String, String> map = new HashMap<String, String>();
		map.put("d0_0", "d0_0_val");
		map.put("d0_1", "d0_1_val");
		map.put("d0_2", "d0_2_val");
		map.put("d0_3", "d0_3_val");
		result.add(map);
		
		return result;
	}
	
	private List<Map<String, String>> getData1(Project project) {
		List<Map<String, String>> result = new ArrayList<Map<String, String>>();
		
		Map<String, String> map = new HashMap<String, String>();
		map.put("d1_0", "d1_0_val");
		map.put("d1_1", "d1_1_val");
		map.put("d1_2", "d1_2_val");
		map.put("d1_3", "d1_3_val");
		result.add(map);
		
		return result;
	}
}
