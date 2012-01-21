var JsTestManager = new Class({
   Implements : [Events, Options],
   Binds : ['addTestSuite', 'checkIfTestPageLoaded', 'onTestCaseFinished', 'onTestCaseStarted', 'onTestPageFinished', 'onTestPageLoaded', 'onTestPageStarted'],

   options : {
      componentName : "JsTestManager",
      delay: 200,
      emptyTestPage : "app/emptyPage.html",
      maxTries: 20,
      verbose : false
   },
   
   initialize : function( params, options ) {
      this.setOptions( options );
      //Instance variables
      this.container;
      this.containerController;
      this.currentTestPage;
      this.log;
      this.numberOfTries;
      this.params = params ? params : new JsUnit.Params();
      this.resultsForm;
      this.resultsFrame;
      this.resultsTimeField;
      this.testCaseResultsField;
      this.testFrame;
      this.testPages;
      this.testResults;
      this.testerContextRoot;
      this.testsContextRoot;
      this.testStack;
      this.timer;
      this.timeRunStarted;
      this.totalCount;
      this.tracer;
      this.uiManager;
      this.verbose = true;
      
      this.initializeInstanceVariables();
      this.instantiateUiManager();
      this.instantiateTracer();
   },
   
   //Public accessor and muntator methods
   abort : function() {
      this.setStatus( 'Aborted' );
      this.finalizeTestRun();
   },

   addTestSuite : function( testSuite ){
      var self = top.testManager;
      self.testStack.addTestSuite( testSuite );
      self.testResults.processTestSuite( testSuite );
   },
   
   kickOffTests : function() {
      if( JsUnit.Util.isBlank( this.getTestFileName() ) ){
         this.fatalError( 'No Test Page specified.' );
         return;
      }

      this.initializeInstanceVariables();
      this.instantiateTestPage( this.resolveUserEnteredTestFileName() );
      this.initializeUIManager();
      this.testsContextRoot = this.determineContextRoot( this.resolveUserEnteredTestFileName() );
      this.testerContextRoot = this.determineContextRoot( top.window.document.location.href );
      this.loadPage();
   },

   maybeRun : function() {
      if( this.params.shouldKickOffTestsAutomatically() ){
         this.kickOffTests();
      }
   },

   onLoad : function() { // called after all frames have loaded
      var topLevelFrames = top.frames;

      this.container = topLevelFrames.testContainer;
      this.documentLoader = topLevelFrames.documentLoader;

      this.containerController = this.container.frames.testContainerController;
      this.testFrame = this.container.frames.testFrame;

      this.uiManager.onLoad( topLevelFrames.mainFrame );

      this.resultsFrame = topLevelFrames.mainResults;
      this.resultsForm = this.resultsFrame.document.resultsForm;
      this.testCaseResultsField = this.resultsFrame.document.resultsForm.testCaseResults;
      this.resultsTimeField = this.resultsFrame.document.resultsForm.time;

      var testRunnerFrameset = document.getElementById( 'testRunnerFrameset' );
      if( this.params.shouldShowTestFrame() && testRunnerFrameset ){
         testRunnerFrameset.rows = '*,0,0,' + this.params.getShowTestFrameHeight();
      }
   },
   
   onTestCaseFinished : function( testCaseResult ){
      var self = top.testManager;
      self.testResults.processTestCaseResult( testCaseResult );
      
      self.tracer.onTestCaseFinished( testCaseResult );
      self.uiManager.onTestCaseFinished( testCaseResult, self.testResults );

      //var serializedTestCaseString = self._currentTestFunctionNameWithTestPageName( true ) + "|" + testCaseResult.getTimeTaken() + "|";
      var serializedTestCaseString = testCaseResult.getFullName() + "|" + testCaseResult.getTimeTaken() + "|";
      
      var exception = testCaseResult.getException();
      if( exception == null ) serializedTestCaseString += "S||";
      else{
         if( exception.isJsUnitFailure ) serializedTestCaseString += "F|";
         else serializedTestCaseString += "E|";

         serializedTestCaseString += self.uiManager.problemDetailMessageFor( exception );
      }
      self._addOption( self.testCaseResultsField, serializedTestCaseString, serializedTestCaseString );
   },
   
   onTestCaseStarted : function( testCaseResult ){
      var self = top.testManager;
      self.setStatus( 'Running test "' + testCaseResult.getName() + '"' );
      self.uiManager.onTestCaseStarted( testCaseResult );
   },
   
   onTestPageLoaded : function(){
      this.currentTestPage.runTests();      
   },
   
   onTestPageFinished : function( testPage ){
      var self = top.testManager;
      self.uiManager.onTestPageFinished( testPage );
      self.resetTestFrame();
      self.nextPage();
   },
   
   onTestPageStarted : function( testPage ){
      var self = top.testManager;
      self.testResults.processTestPage( testPage );
      self.uiManager.onTestPageStarted( testPage );
   },
   
   //Properties
   getBaseURL : function() { return this.testsContextRoot; },
   getParameters : function() { return this.params; },
   getTestFunctionName : function() { return this._testFunctionName; },
   getTracer : function() { return this.tracer; },
   getUiFrameUrl : function() { return this.uiManager.getUiFrameUrl(); },
   getUiManager : function() { return this.uiManager; },
   isBeingRunOverHTTP : function() { return this.getTestFileProtocol() == "http://"; },
   isFileProtocol : function() { return this.getTestFileProtocol() == 'file:///'; },
   isFirefox3 : function() { return navigator.userAgent.toLowerCase().indexOf( "firefox/3" ) != -1; },
   isIE7 : function() { return navigator.userAgent.toLowerCase().indexOf( "msie 7" ) != -1; },
   isOpera : function() { return navigator.userAgent.toLowerCase().indexOf( "opera" ) != -1; },
   isSafari4 : function() { return navigator.userAgent.toLowerCase().indexOf( "4.0 safari" ) != -1; },

   //Protected, private helper methods
   checkIfTestPageLoaded : function(){
      var self = top.testManager;
      self.numberOfTries++;
//console.log( self.numberOfTries + "-nd try to load: " + self.currentTestPage.getUrl() );

      var positionOfQuestionMark = self.testFrame.document ? self.testFrame.document.location.href.indexOf( "?" ) : -1;
      positionOfQuestionMark = positionOfQuestionMark >= 0 ? positionOfQuestionMark : 0;
      var testFrameUrl = self.testFrame.document ? self.testFrame.document.location.href.substring( 0, positionOfQuestionMark ) : "";
      
      var positionOfLastSlash = self.currentTestPage.getUrl().lastIndexOf( "./" );
      positionOfLastSlash = positionOfLastSlash == -1 ? 0 : positionOfLastSlash +2;
      var currentPageUri = self.currentTestPage.getUrl().substring( positionOfLastSlash );
      
      if( self.testFrame.document && self.testFrame.document.readyState == 'complete' && testFrameUrl.contains( currentPageUri )){
//console.log( "Loading: " + self.currentTestPage.getUrl() + "succseeded!" );
         clearInterval( self.timer );
         self.onTestPageLoaded();
      }else if( self.numberOfTries >= self.options.maxTries ){
         clearInterval( self.timer );
         self.fatalError( 'Reading Test Page ' + self.currentTestPage.url + ' timed out.\nMake sure that the file exists and is a Test Page.' );
         if( self.userConfirm( 'Retry Test Run?' ) ){
            self.loadPage( self.currentTestPage );
            return;
         }else{
            self.abort();
            return;
         }
      }
   },
   
   determineContextRoot : function( url ) {
      var firstQuery = url.indexOf( "?" );
      if( firstQuery >= 0 ){
         url = url.substring( 0, firstQuery );
      }
      var lastSlash = url.lastIndexOf( "/" );
      var lastRevSlash = url.lastIndexOf( "\\" );
      if( lastRevSlash > lastSlash ){
         lastSlash = lastRevSlash;
      }
      if( lastSlash > 0 ){
         url = url.substring( 0, lastSlash + 1 );
      }
      return url;
   }.protect(),
   
   finalizeTestRun : function(){
      if( this.testFrame && this.testFrame.removeEvents ) this.testFrame.removeEvents();
      this.containerController.setTestPage( this.testerContextRoot + this.options.emptyTestPage );
      this.uiManager.finishing();
   }.protect(),
   
   initializeInstanceVariables : function() {
      this.testsContextRoot = "";
      this.totalCount = 0;
      this.errorCount = 0;
      this.failureCount = 0;
      this.log = new Array();
      this.testPages = new Array();
      this.testResults = new JsTestSuiteResults();
      this.testStack = new JsTestStack();
      this.timeRunStarted = new Date();
   }.protect(),

   initializeUIManager : function() {
      this.setStatus( 'Initializing...' );
      this.uiManager.starting();
      this.uiManager.updateProgressIndicators( this.testResults );      
      this.setStatus( 'Done initializing' );
   }.protect(),
   
   instantiateTestPage : function( testPageUrl ){
      this.currentTestPage = new JsTestPage( testPageUrl, this.testFrame, {
         onAddTestSuite : this.addTestSuite,
         onTestCaseFinished : this.onTestCaseFinished, 
         onTestCaseStarted : this.onTestCaseStarted, 
         onTestPageFinished : this.onTestPageFinished, 
         onTestPageStarted : this.onTestPageStarted, 
         verbose : this.options.verbose 
      });
      
      this.testPages.include( this.currentTestPage );
   }.protect(),
   
   instantiateTracer: function(){
      this.tracer = new JsTracer( this.params );
      this.tracer.addEvent( 'traceMessage', function( arguments ) { 
         this.uiManager.onTraceMessage( arguments ); 
      }.bind( this ));
   }.protect(),

   instantiateUiManager: function(){
      if( this.params.get( "ui" ) == "modern" ) this.uiManager = new JsModernUiManager( this );
      else this.uiManager = new JsClassicUiManager( this );
   }.protect(),
   
   loadPage : function() {
      this.setStatus( 'Opening Test Page "' + this.currentTestPage.url + '"' );
      
      this.containerController.setTestPage( this.currentTestPage.url );
      this.numberOfTries = 0;
      this.timer = this.checkIfTestPageLoaded.periodical( this.options.delay );
   }.protect(),

   nextPage : function(){
      if( this.testStack.hasMorePages() ){
         var nextPageUrl = this.testStack.nextPage();
         this.instantiateTestPage( nextPageUrl );
         this.loadPage();
      }else {
         this.setStatus( 'Finished' );
         this.finalizeTestRun();
      }
   },
   
   notifyUiOfTestPage : function( testPage ) {
      if( testPage.alreadyNotifiedUi ) return;

      this.uiManager.learnedOfTestPage( testPage );
      testPage.alreadyNotifiedUi = true;
   }.protect(),

   resetTestFrame : function(){
      this.testFrame.removeEvents();
      this.containerController.setTestPage( this.options.emptyTestPage );
   },
   
   setWindowStatus : function( string ) {
      top.status = string;
   },

   _populateHeaderFields : function( id, browserId, userAgent, jsUnitVersion, baseURL ) {
      this.resultsForm.id.value = id;
      this.resultsForm.browserId.value = browserId;
      this.resultsForm.userAgent.value = userAgent;
      this.resultsForm.jsUnitVersion.value = jsUnitVersion;
      this.resultsForm.url.value = baseURL;
      this.resultsForm.cacheBuster.value = new Date().getTime();
   },

   _submitResultsForm : function() {
      var testCasesField = this.testCaseResultsField;
      for( var i = 0; i < testCasesField.length; i++ ){
         testCasesField[i].selected = true;
      }

      this.resultsForm.action = this.getSubmitUrl();
      this.resultsForm.submit();
   },

   submitResults : function() {
      this.uiManager.submittingResults();
      this._populateHeaderFields( this.params.getResultId(), this.params.getBrowserId(), navigator.userAgent, JSUNIT_VERSION, this.resolveUserEnteredTestFileName() );
      this._submitResultsForm();
   },

   _done : function() {
      var secondsSinceRunBegan = (new Date() - this.timeRunStarted) / 1000;
      this.setStatus( 'Done (' + secondsSinceRunBegan + ' seconds)' );

      // call the suite teardown function, if defined
      if( typeof top.suiteTearDown === 'function' ){
         top.suiteTearDown();
      }

      this.finalizeTestRun();
      if( this.params.shouldSubmitResults() ){
         this.resultsTimeField.value = secondsSinceRunBegan;
         this.submitResults();
      }
   },

   getTimeout : function() {
      var result = JsTestManager.TESTPAGE_WAIT_SEC;
      try{
         if( this.timeout ){
            result = eval( this.timeout.value );
         }
      }catch (e){
      }
      return result;
   },

   getsetUpPageTimeout : function() {
      var result = JsTestManager.SETUPPAGE_TIMEOUT;
      try{
         result = eval( this.setUpPageTimeout.value );
      }catch (e){
      }
      return result;
   },

   isTestPageSuite : function() {
      var result = false;
      if( typeof (this.testFrame.suite) == 'function' ){
         result = true;
      }
      return result;
   },

   _currentTestFunctionNameWithTestPageName : function( useFullyQualifiedTestPageName ) {
      var testURL = this.testFrame.location.href;
      var testQuery = testURL.indexOf( "?" );
      if( testQuery >= 0 ){
         testURL = testURL.substring( 0, testQuery );
      }
      if( !useFullyQualifiedTestPageName ){
         if( testURL.substring( 0, this.testsContextRoot.length ) == this.testsContextRoot )
            testURL = testURL.substring( this.testsContextRoot.length );
      }
      return testURL + ':' + this._testFunctionName;
   },

   setStatus : function( str ) {
      this.uiManager.setStatus( str );
      this.log.push( str );
   },

   getTestFileName : function() {
      var rawEnteredFileName = this.uiManager.getTestFileName();
      var result = rawEnteredFileName;

      while( result.indexOf( '\\' ) != -1 )
         result = result.replace( '\\', '/' );

      return result;
   },

   resolveUserEnteredTestFileName : function( rawText ) {
      var userEnteredTestFileName = this.getTestFileName();

      // only test for file:// since Opera uses a different format
      if( userEnteredTestFileName.indexOf( 'http://' ) == 0 || 
          userEnteredTestFileName.indexOf( 'https://' ) == 0 || 
          userEnteredTestFileName.indexOf( 'file://' ) == 0 )
         return userEnteredTestFileName;

      return this.getTestFileProtocol() + this.getTestFileName();
   },

   storeRestoredHTML : function() {
      if( document.getElementById && this.testFrame.document.getElementById( JsTestManager.RESTORED_HTML_DIV_ID ) )
         this._restoredHTML = this.testFrame.document.getElementById( JsTestManager.RESTORED_HTML_DIV_ID ).innerHTML;
   },

   fatalError : function( aMessage ) {
      this.uiManager.fatalError( aMessage );
   },

   userConfirm : function( aMessage ) {
      return this.uiManager.userConfirm( aMessage );
   },

   getSubmitUrl : function() {
      if( this.params.wasResultUrlSpecified() ){ return this._submitUrlFromSpecifiedUrl();
      } else{ return this._submitUrlFromTestRunnerLocation(); }
   },

   getTestPageString : function() {
      var testPageParameter = this.params.getTestPage();
      var isFileProtocol = this.isFileProtocol();
      var testPageString = "";
      if( testPageParameter ){
         if( !isFileProtocol ){
            var topLocation = top.location;
            if( testPageParameter.indexOf( '/' ) == 0 )
               testPageString += topLocation.host;
            else if( testPageParameter.indexOf( './' ) == 0 ){
               testPageString += topLocation.href.substr( 0, topLocation.href.indexOf( "testRunner.html" ) );
               testPageParameter = testPageParameter.substr( 2, testPageParameter.length );
            }
         }
         testPageString += testPageParameter;
         var testParms = this.params.constructTestParams();
         if( testParms != '' ){
            testPageString += '?';
            testPageString += testParms;
         }
      }
      return testPageString;
   },

   getTestFileProtocol : function() {
      var protocol = top.document.location.protocol;

      if( protocol == "file:" ) return "file:///";
      if( protocol == "http:" ) return "http://";
      if( protocol == 'https:' ) return 'https://';
      if( protocol == "chrome:" ) return "chrome://";

      return null;
   },

   browserSupportsReadingFullPathFromFileField : function() {
      return false; // pretty much all modern browsers disallow this now
   },

   //Protected, private helper methods
   getWebserver : function() {
      if( this.isBeingRunOverHTTP() ){
         var myUrl = location.href;
         var myUrlWithProtocolStripped = myUrl.substring( myUrl.indexOf( "/" ) + 2 );
         return myUrlWithProtocolStripped.substring( 0, myUrlWithProtocolStripped.indexOf( "/" ) );
      }
      return null;
   },

   _addOption : function( listField, problemValue, problemMessage ) {
      if( typeof (listField.ownerDocument) != 'undefined' && typeof (listField.ownerDocument.createElement) != 'undefined' ){
         // DOM Level 2 HTML method.
         // this is required for Opera 7 since appending to the end of the
         // options array does not work, and adding an Option created by new
         // Option()
         // and appended by listField.options.add() fails due to
         // WRONG_DOCUMENT_ERR
         var problemDocument = listField.ownerDocument;
         var errOption = problemDocument.createElement( 'option' );
         errOption.setAttribute( 'value', problemValue );
         errOption.appendChild( problemDocument.createTextNode( problemMessage ) );
         listField.appendChild( errOption );
      }else{
         // new Option() is DOM 0

         var errOption = new Option( problemMessage, problemValue );

         if( typeof (listField.add) != 'undefined' ){
            // DOM 2 HTML
            try{
               listField.add( errOption, null );
            }catch (err){
               listField.add( errOption ); // IE 5.5
            }

         }else if( typeof (listField.options.add) != 'undefined' ){
            // DOM 0
            listField.options.add( errOption, null );
         }else{
            // DOM 0
            listField.options[listField.length] = errOption;
         }
      }
   },

   _submitUrlFromSpecifiedUrl : function() {
      var result = "";
      var specifiedUrl = this.params.getSpecifiedResultUrl();
      if( specifiedUrl.indexOf( "http://" ) != 0 )
         result = "http://";
      result += specifiedUrl;
      return result;
   },

   _submitUrlFromTestRunnerLocation : function() {
      var result = "http://";
      var webserver = this.getWebserver();
      var runningOverFileProtocol = webserver == null;
      if( runningOverFileProtocol )
         webserver = JsTestManager.DEFAULT_SUBMIT_WEBSERVER;
      result += webserver;
      result += "/jsunit/acceptor";
      return result;
   }
   
/*********************** Obsolate methods *****************************/

});

JsTestManager.DEFAULT_TEST_FRAME_HEIGHT = 250;
JsTestManager.DEFAULT_SUBMIT_WEBSERVER = "localhost:8080";
JsTestManager.SETUPPAGE_TIMEOUT = 10; // seconds to wait for setUpPage to complete
JsTestManager.SETUPPAGE_INTERVAL = 100; // milliseconds to wait between polls on setUpPages
JsTestManager.RESTORED_HTML_DIV_ID = "jsUnitRestoredHTML";
JsTestManager.TESTPAGE_WAIT_SEC = 10; // seconds to wait for each test page to load
JsTestManager.TIMEOUT_LENGTH = 20; // milliseoncds between test runs
