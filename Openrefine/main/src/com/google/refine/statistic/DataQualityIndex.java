package com.google.refine.statistic;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface DataQualityIndex {
	public Map<String, Object> test(String testIndex);
	public void corrected(String editIndex, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException;
}
