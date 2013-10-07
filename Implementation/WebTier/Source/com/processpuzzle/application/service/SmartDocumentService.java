package com.processpuzzle.application.service;

import java.io.InputStream;
import java.io.InputStreamReader;

import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

@Path( "SmartDocumentService" )
public class SmartDocumentService {
   @GET
   @Path( "read" )
   @Produces( MediaType.TEXT_XML )
   public String read( @QueryParam( "documentPath" ) String documentPath, @Context ServletContext context ) {
      String documentResource = readDocument( documentPath, context );
      return documentResource;
   }

   @PUT
   @Path( "update" )
   @Consumes( MediaType.TEXT_PLAIN )
   @Produces( MediaType.TEXT_XML )
   public String update( @QueryParam( "updatedDocument" )
   String updatedDocument ) {
      return "<?xml version=\"1.0\"?>" + "<hello>Jersey updated: " + updatedDocument + "</hello>";
   }

   private String readDocument( String documentPath, ServletContext context ) {
      String smartDocument = null;
      InputStream stream = context.getResourceAsStream( documentPath );
      if( stream == null ){
         smartDocument = "<?xml version=\"1.0\"?>" + "<response>Reading document: " + documentPath + " failed.</response>"; 
      }else{
         InputStreamReader reader = new InputStreamReader( stream );
         smartDocument = "<?xml version=\"1.0\"?>" + "<response>Reading document: " + documentPath + " was successfull.</response>"; 
      }
      return smartDocument;
   }
}
