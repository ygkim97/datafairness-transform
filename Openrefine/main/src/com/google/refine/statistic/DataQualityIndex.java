package com.google.refine.statistic;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

public interface DataQualityIndex {
	public void setCorrectedData(String correctedIndex, ModifiableHttpServletRequest request, HttpServletResponse response) throws ServletException, IOException;
}
