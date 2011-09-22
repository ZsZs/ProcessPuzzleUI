//Configure Browser Interface logging
/**
ProcessPuzzle User Interface
Backend agnostic, desktop like configurable, browser font-end based on MochaUI.
Copyright (C) 2011  Joe Kueser, Zsolt Zsuffa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var WebUILogger = new Class({
   Implements: [Class.Singleton, Options],
   options: {
      defaultLoggerName : "WebUI"
   },

   initialize: function( webUIConfiguration, options ) { return this.check() || this.setUp( webUIConfiguration, options ); },

   setUp : function( webUIConfiguration, options ) {
      this.appenders = new HashMap();
      this.defaultLogger = null;
      this.layouts = new HashMap();
      this.loggers = new HashMap();
      this.loggerIsConfigured = false;
      
      if( webUIConfiguration ) this.configure( webUIConfiguration );
      else this.configureDefaultLogger();
   },
   
   //Public accessors and mutators
   configure : function( webUIConfiguration ) {
      for( i = 0; i < webUIConfiguration.getLoggingLayoutElements().length; i++ ) {
         var layoutName = webUIConfiguration.getLoggingLayoutName( i );
         var layout = this.configureLayout( layoutName, webUIConfiguration );
         this.layouts.put( layoutName, layout );
      }
      
      for( i = 0; i < webUIConfiguration.getLoggingAppenderElements().length; i++ ) {
         var appenderName = webUIConfiguration.getLoggingAppenderName( i );
         var appender = this.configureAppender( appenderName, webUIConfiguration );
         this.appenders.put( appenderName, appender );
      }
      
      for( i = 0; i < webUIConfiguration.getLoggerElements().length; i++ ) {
         var loggerName = webUIConfiguration.getLoggerName( i );
         var logger = this.configureLogger( loggerName, webUIConfiguration );
         this.loggers.put( loggerName, logger );
      }
      
      this.determineDefaultLogger();
      this.loggerIsConfigured = true;
   },
   
   configureDefaultLogger: function(){
   	this.defaultLogger = log4javascript.getDefaultLogger();
   },
   
   debug : function( logMessage ) { this.log( WebUILogger.DEBUG, logMessage ); },
   error : function( logMessage ) { this.log( WebUILogger.ERROR, logMessage ); },
   fatal : function( logMessage ) { this.log( WebUILogger.FATAL, logMessage ); },
   group : function( groupName, initiallyExpanded ) { 
      this.defaultLogger.group( groupName, initiallyExpanded );
   },
   
   groupEnd : function() { 
      this.defaultLogger.groupEnd();
   },
   
   info : function( logMessage ) { this.log( WebUILogger.INFO, logMessage ); },
   
   log : function( logLevel, logMessage ){
      if( !this.logLevelIsValid( logLevel ) ) 
         throw new IllegalArgumentException( "WebUILogger.log( logLevel, logMessage ): logLevel parameter is required, but was: " + logLevel );
      this.defaultLogger.log( logLevel, logMessage );
   },
   
   tearDown : function() {
      var loggerIterator = this.loggers.iterator();
      while( loggerIterator.hasNext() ){
         var aLogger = loggerIterator.next().getValue();
         aLogger.removeAllAppenders();
      }
      
      this.layouts.clear();
      this.appenders.clear();
      this.loggers.clear();
      
      this.loggerIsConfigured = false;
   },
   
   trace : function( logMessage ) { this.log( WebUILogger.TRACE, logMessage ); },
   warn : function( logMessage ) { this.log( WebUILogger.WARN, logMessage ); },
   
   //Properties
   getAppender : function( appenderName ) { return this.appenders.get( appenderName ); },
   getAppenders : function() { return this.appenders; },
   getDefaultLogger : function() { return this.defaultLogger; },
   getLayout : function( layoutName ) { return this.layouts.get( layoutName ); },
   getLayouts : function() { return this.layouts; },
   getLogger : function( loggerName ) { return this.loggers.get( loggerName ); },
   getLoggers : function() { return this.loggers; },
   getName : function() { return this.options.defaultLoggerName;},
   isConfigured : function() { return this.loggerIsConfigured; },
   
   //Private helper methods
   configureAppender : function( appenderName, webUIConfiguration ){
      var appender = null;
      var lazyInit = webUIConfiguration.getLoggingAppenderLazyInit( appenderName );
      var height = webUIConfiguration.getLoggingAppenderHeight( appenderName );
      var initiallyMinimized = webUIConfiguration.getLoggingAppenderInitiallyMinimized( appenderName );
      var useDocumentWrite = webUIConfiguration.getLoggingAppenderUseDocumentWrite( appenderName );
      var width = webUIConfiguration.getLoggingAppenderWidth( appenderName );
      
      switch( webUIConfiguration.getLoggingAppenderType( appenderName ).toUpperCase() ){
      case "WUI:ALERTAPPENDER": 
         appender = new log4javascript.AlertAppender(); 
         break;
      case "WUI:AJAXAPPENDER": 
         var url = webUIConfiguration.getLoggingAppenderURL( appenderName );
         appender = new log4javascript.AjaxAppender( url );
         break;
      case "WUI:BROWSERCONSOLAPPENDER": 
         appender = new log4javascript.BrowserConsoleAppender(); 
         break;
      case "WUI:INPAGEAPPENDER": 
         var containerElementId = webUIConfiguration.getLoggingAppenderContainerElementId( appenderName );
         appender = new log4javascript.InPageAppender( containerElementId, lazyInit, initiallyMinimized, useDocumentWrite, width, height ); 
         break;
      case "WUI:POPUPAPPENDER": 
         var lazyInit = webUIConfiguration.getLoggingAppenderLazyInit( appenderName );
         var initiallyMinimized = webUIConfiguration.getLoggingAppenderInitiallyMinimized( appenderName );
         var useDocumentWrite = webUIConfiguration.getLoggingAppenderUseDocumentWrite( appenderName );
         var width = webUIConfiguration.getLoggingAppenderWidth( appenderName );
         var height = webUIConfiguration.getLoggingAppenderHeight( appenderName );
         appender = new log4javascript.PopUpAppender( lazyInit, initiallyMinimized, useDocumentWrite, width, height ); 
         break;
      default: appender = new log4javascript.PopUpAppender();
      };
      
      if( this.logLevelValueIsValid( webUIConfiguration.getLoggingAppenderThreshold( appenderName )))
         appender.setThreshold( this.parseLevel( webUIConfiguration.getLoggingAppenderThreshold( appenderName )));
      
      var layout = this.layouts.get( webUIConfiguration.getLoggingAppenderLayoutReference( appenderName ));
      appender.setLayout( layout );

      return appender;
   }.protect(),
   
   configureLayout : function( layoutName, webUIConfiguration ) {
      var layoutPattern = webUIConfiguration.getLoggingLayoutPattern( layoutName );
      var layout = new log4javascript.PatternLayout( layoutPattern );
      
      return layout;
   }.protect(),
   
   configureLogger : function( loggerName, webUIConfiguration ){
      var logger = log4javascript.getLogger( loggerName );
      logger.setLevel( this.parseLevel( webUIConfiguration.getLoggerLevel( loggerName )));
      var referencedAppender = this.appenders.get( webUIConfiguration.getLoggingLoggerAppenderReference( loggerName ));
      logger.addAppender( referencedAppender );

      if( webUIConfiguration.getLoggingLoggerIsDefault( loggerName ))
         this.defaultLogger = logger;
      
      return logger;
   }.protect(),
   
   determineDefaultLogger : function() {
      if( this.defaultLogger == null ) this.defaultLogger = this.getLogger( this.options.defaultLoggerName );
   }.protect(),
   
   logLevelIsValid : function( logLevel ){
      switch( logLevel ){
      case log4javascript.Level.ALL: return true;
      case log4javascript.Level.TRACE: return true;
      case log4javascript.Level.DEBUG: return true;
      case log4javascript.Level.INFO: return true;
      case log4javascript.Level.WARN: return true;
      case log4javascript.Level.ERROR: return true;
      case log4javascript.Level.FATAL: return true;
      case log4javascript.Level.NONE: return true;
      default: return false;
   };
   }.protect(),
   
   logLevelValueIsValid : function( logLevelValue ){
      if( this.parseLevel( logLevelValue ) != null ) return true;
      else return false;
   }.protect(),
   
   parseLevel : function( levelString ){
      if( typeOf( levelString ) != 'string' ) return null;
      
      switch( levelString.toUpperCase() ){
         case "ALL": return log4javascript.Level.ALL;
         case "TRACE": return log4javascript.Level.TRACE;
         case "DEBUG": return log4javascript.Level.DEBUG;
         case "INFO": return log4javascript.Level.INFO;
         case "WARN": return log4javascript.Level.WARN;
         case "ERROR": return log4javascript.Level.ERROR;
         case "FATAL": return log4javascript.Level.FATAL;
         case "NONE": return log4javascript.Level.NONE;
         default: return null;
      };
   }.protect()
});

WebUILogger.ALL = log4javascript.Level.ALL;
WebUILogger.TRACE = log4javascript.Level.TRACE;
WebUILogger.DEBUG = log4javascript.Level.DEBUG;
WebUILogger.INFO = log4javascript.Level.INFO;
WebUILogger.WARN = log4javascript.Level.WARN;
WebUILogger.ERROR = log4javascript.Level.ERROR;
WebUILogger.FATAL = log4javascript.Level.FATAL;
WebUILogger.NONE = log4javascript.Level.NONE;
