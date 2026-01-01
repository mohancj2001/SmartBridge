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
@WebServlet(name = "Main", urlPatterns = {"/Main"})
public class Main extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();

        // Get the 'name' parameter from the request
        String name = req.getParameter("name");

        // If 'name' parameter is missing, return a 400 Bad Request error
        if (name == null || name.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 Bad Request
            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("error", "Missing 'name' parameter");
            resp.setContentType("application/json");
            resp.getWriter().write(gson.toJson(errorResponse));
            return;
        }

        // Get the servlet context to store the status
        ServletContext context = getServletContext();

        // Prepare JSON response based on 'name' parameter and set the status in servlet context
        JsonObject jsonObject = new JsonObject();
        switch (name) {
            case "open_bridge":
                jsonObject.addProperty("status", 1);
                context.setAttribute("status", 1);  // Store status in servlet context
                break;
            case "close_bridge":
                jsonObject.addProperty("status", 0);
                context.setAttribute("status", 0);  // Store status in servlet context
                break;
            case "open_gate":
                jsonObject.addProperty("status", 3);
                context.setAttribute("status", 3);  // Store status in servlet context
                break;
            case "close_gate":
                jsonObject.addProperty("status", 2);
                context.setAttribute("status", 2);  // Store status in servlet context
                break;
            default:
                jsonObject.addProperty("status", -1); // Undefined action
                break;
        }

        // Return the response with the appropriate JSON
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(jsonObject));
    }
}
