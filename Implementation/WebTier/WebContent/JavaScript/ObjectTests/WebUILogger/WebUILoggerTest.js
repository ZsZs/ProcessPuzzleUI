window.WebUILoggerTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : [],

   options : {
      testMethods : [
          { method : 'initialize_configuresAppenders', isAsynchron : false },
          { method : 'initialize_instantiatesLayouts', isAsynchron : false },
          { method : 'initialize_instantiatesAppenders', isAsynchron : false },
          { method : 'initialize_instantiatesLoggers', isAsynchron : false },
          { method : 'log_broadcastsLogMessageToAppenders', isAsynchron : false },
          { method : 'log_whenLevelIsMissing_throwsException', isAsynchron : false }]
   },

   constants : {
      APPENDER_ONE_NAME : "xmlAjaxAppender",
      APPENDER_TWO_NAME : "formattedPopUpAppender",
      APPENDER_THREE_NAME : "formattedInPageAppender",
      APPENDER_FOUR_NAME : "formattedConsoleAppender",
      CONFIGURATION_URI : "../WebUILogger/WebUIConfiguration.xml",
      ERROR_MESSAGE : "An error message.",
      INFO_MESSAGE : "An info message.",
      LAYOUT_ONE_NAME : "formattedLayout",
      LAYOUT_TWO_NAME : "xmlLayout",
      LOG_CONTAINER_ELEMENT_ID : "JavaScriptLogging",
      LOGGER_ONE_NAME : "WebUI",
      LOGGER_TWO_NAME : "ProcessPuzzle",
      LOGGER_THREE_NAME : "LoggerForUnitTest"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.ajaxAppender;
      this.browserConsoleAppender;
      this.configuration;
      this.inPageAppender;
      this.logContainerElement;
      this.logger;
      this.patternLayout;
      this.popUpAppender;
      this.processPuzzleLogger;
      this.unitTestLogger;
      this.xmlLayout;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.configuration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.logger = new WebUILogger( this.configuration );
      if( !this.logger.isConfigured() ) this.logger.configure( this.configuration );
      
      this.patternLayout = this.logger.getLayout( this.constants.LAYOUT_ONE_NAME );
      this.xmlLayout = this.logger.getLayout( this.constants.LAYOUT_TWO_NAME );
   
      this.ajaxAppender = this.logger.getAppender( this.constants.APPENDER_ONE_NAME );
      this.popUpAppender = this.logger.getAppender( this.constants.APPENDER_TWO_NAME );
      this.inPageAppender = this.logger.getAppender( this.constants.APPENDER_THREE_NAME );
      this.browserConsoleAppender = this.logger.getAppender( this.constants.APPENDER_FOUR_NAME );
   
      this.webUILogger = this.logger.getLogger( this.constants.LOGGER_ONE_NAME );
      this.processPuzzleLogger = this.logger.getLogger( this.constants.LOGGER_TWO_NAME );
      this.unitTestLogger = this.logger.getLogger( this.constants.LOGGER_THREE_NAME );
   
      this.logContainerElement = $( this.constants.LOG_CONTAINER_ELEMENT_ID );
   },
   
   afterEachTest : function (){
      this.logger.tearDown();
   },
   
   initialize_configuresAppenders : function() {
      assertEquals( WebUILogger.INFO, this.ajaxAppender.getThreshold() );
      
      assertEquals( WebUILogger.DEBUG, this.popUpAppender.getThreshold() );
      assertTrue( this.popUpAppender.isInitiallyMinimized() );

      assertEquals( WebUILogger.TRACE, this.inPageAppender.getThreshold() );
      assertEquals( 600, this.inPageAppender.getHeight() );
      assertEquals( 800, this.inPageAppender.getWidth() );
      assertFalse( this.inPageAppender.isInitiallyMinimized() );

      assertEquals( WebUILogger.DEBUG, this.browserConsoleAppender.getThreshold() );
   },
   
   initialize_instantiatesLayouts : function() {
      assertEquals( "Configuration contains:", 2, this.logger.getLayouts().length );
      assertEquals( "%d{HH:mm:ss} %-5p - %c: %m%n", this.patternLayout.pattern );
      assertEquals( "[%-5p] %m", this.xmlLayout.pattern );
   },
   
   initialize_instantiatesAppenders : function() {
      assertEquals( "Configuration contains:", 4, this.logger.getAppenders().length );
      assertEquals( this.xmlLayout, this.ajaxAppender.getLayout() );
      assertEquals( this.patternLayout, this.popUpAppender.getLayout() );
      assertEquals( this.patternLayout, this.inPageAppender.getLayout() );
      assertEquals( this.patternLayout, this.browserConsoleAppender.getLayout() );
   },
   
   initialize_instantiatesLoggers : function() {
      assertEquals( "Configuration contains:", 3, this.logger.getLoggers().length );
      assertEquals( "Returns the default logger's name.", this.constants.LOGGER_THREE_NAME, this.logger.getName());
      assertEquals( "DEBUG", this.logger.getLevel().name );
      assertEquals( "INFO", this.webUILogger.getLevel().name );
      assertEquals( "INFO", this.processPuzzleLogger.getLevel().name );
      
      assertEquals( this.popUpAppender, this.webUILogger.getEffectiveAppenders()[0] );
      assertEquals( this.ajaxAppender, this.processPuzzleLogger.getEffectiveAppenders()[0] );
      
      assertEquals( this.unitTestLogger, this.logger.getDefaultLogger() );
   },
   
   log_broadcastsLogMessageToAppenders : function() {
      this.logger.log( WebUILogger.TRACE, this.constants.ERROR_MESSAGE );
   },
   
   log_whenLevelIsMissing_throwsException : function() {
      try{
         this.logger.log( this.constants.ERROR_MESSAGE );
         fail( "Exception was expected. 'logLevel' parameter can't be null, empty or illegal value." );
      }catch( e ) {
         assertTrue( "IllegalArgumentException is expected.", e instanceof IllegalArgumentException );
      }
   }

});