/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author mohan
 */
@WebServlet(name = "Sub", urlPatterns = {"/Sub"})
public class Sub extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get the servlet context to retrieve the status
        ServletContext context = getServletContext();
        Integer status = (Integer) context.getAttribute("status");

        // If status is not set, default to a value (e.g., -1)
        if (status == null) {
            status = -1;
        }

        // Set the response content type to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Create a JSON object to hold the status
        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("status", status);

        // Write the JSON response to the output stream
        response.getWriter().write(jsonResponse.toString());

        // Set the status in jsonResponse to -1 after writing the response
       if (status != -1) {
            status = -1;
        }
    }

}
