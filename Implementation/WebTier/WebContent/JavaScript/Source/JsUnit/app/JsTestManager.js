var JsTestManager = new Class( {

   initialize : function( params ) {
      //Instance variables
      this.baseURL;
      this.container;
      this.containerController;
      this.currentTestPage;
      this.errorCount;
      this.failureCount;
      this.log;
      this.numberOfTestsInPage;
      this.params = params ? params : new JsUnit.Params();
      this.resultsForm;
      this.resultsFrame;
      this.resultsTimeField;
      this.testCaseResultsField;
      this.testFrame;
      this.testGroupStack;
      this.testIndex;
      this.totalCount;
      this.uiManager;
      
      this.instantiateUiManager();
      this.setup();
   },
   
   //Public accessor and muntator methods
   kickOffTests : function() {
      if( JsUnit.Util.isBlank( this.getTestFileName() ) ){
         this.fatalError( 'No Test Page specified.' );
         return;
      }

      this.setup();
      this._currentTestGroup().addTestPage( this.resolveUserEnteredTestFileName(), this.testFrame );
      this.start();
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
   
   //Properties
   getBaseURL : function() { return this.baseURL; },
   getTestFunctionName : function() { return this._testFunctionName; },
   getTracer : function() { return top.tracer; },
   getUiFrameUrl : function() { return this.uiManager.getUiFrameUrl(); },
   getUiManager : function() { return this.uiManager; },
   isBeingRunOverHTTP : function() { return this.getTestFileProtocol() == "http://"; },
   isFileProtocol : function() { return this.getTestFileProtocol() == 'file:///'; },
   isFirefox3 : function() { return navigator.userAgent.toLowerCase().indexOf( "firefox/3" ) != -1; },
   isIE7 : function() { return navigator.userAgent.toLowerCase().indexOf( "msie 7" ) != -1; },
   isOpera : function() { return navigator.userAgent.toLowerCase().indexOf( "opera" ) != -1; },
   isSafari4 : function() { return navigator.userAgent.toLowerCase().indexOf( "4.0 safari" ) != -1; },

   //Protected, private helper methods
   addTestSuite : function( testSuite ) {
      var testGroup = new JsTestGroup();

      while( testSuite.hasMorePages() ){
         var testPage = testGroup.addTestPage( testSuite.nextPage() );
         this.notifyUiOfTestPage( testPage );
      }

      JsUnit.Util.push( this.testGroupStack, testGroup );
   }.protect(),

   determineBaseUrl : function( url ) {
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
   
   doneLoadingPage : function( testPage ) {
      this.currentTestPage = testPage;
      this.notifyUiOfTestPage( this.currentTestPage );
      if( this.isTestPageSuite() ) this.handleNewSuite();
      else this.handleNewPage();
   },
   
   handleNewPage : function(){
      this.testIndex = 0;
      this.currentTestPage.analyse();
      this.numberOfTestsInPage = this.currentTestPage.totalNumberOfTestCases();
      this.currentTestPage.notify( JsTestPage.READY_EVENT );
      this.runTestFunction();
   }.protect(),

   handleNewSuite : function() {
      var allegedSuite = this.testFrame.suite();
      if( allegedSuite.isJsUnitTestSuite ){
         var newSuite = this._cloneTestSuite( allegedSuite );
         if( newSuite.containsTestPages() )
            this.addTestSuite( newSuite );
         this._nextPage();
      }else{
         this.fatalError( 'Invalid test suite in file ' + this.currentTestPage.url );
         this.abort();
      }
   }.protect(),

   initializeComponents : function() {
      this.setStatus( 'Initializing...' );
      this.uiManager.starting();
      this.updateProgressIndicators();
      this.setStatus( 'Done initializing' );
   }.protect(),

   instantiateUiManager: function(){
      if( this.params.get( "ui" ) == "modern" ) this.uiManager = new JsModernUiManager( this );
      else this.uiManager = new JsClassicUiManager( this );
   }.protect(),
   
   notifyUiOfTestPage : function( testPage ) {
      if( testPage.alreadyNotifiedUi ) return;

      this.uiManager.learnedOfTestPage( testPage );
      testPage.alreadyNotifiedUi = true;
   }.protect(),

   setup : function() {
      this.baseURL = "";
      this.totalCount = 0;
      this.errorCount = 0;
      this.failureCount = 0;
      this.log = [];
      this.testGroupStack = Array();

      var initialSuite = new JsUnitTestSuite();
      this.addTestSuite( initialSuite );      
   }.protect(),

   start : function() {
      var url = this.resolveUserEnteredTestFileName();
      this.baseURL = this.determineBaseUrl( url );

      this._timeRunStarted = new Date();
      this.initializeComponents();
      setTimeout( 'top.testManager._nextPage();', JsTestManager.TIMEOUT_LENGTH );
   },

   /**
    * This function handles cloning of a jsUnitTestSuite object. This was added
    * to replace the clone method of the jsUnitTestSuite class due to an IE bug
    * in cross frame scripting. (See also jsunit bug 1522271)
    */
   _cloneTestSuite : function( suite ) {
      var clone = new jsUnitTestSuite();
      clone._testPages = suite._testPages.concat( new Array( 0 ) );
      return clone;
   },

   runTestFunction : function() {
      if( this.testIndex + 1 > this.numberOfTestsInPage ){
         if( typeof this.testFrame.tearDownPage == 'function' ){    // execute tearDownPage *synchronously* (unlike setUpPage which is asynchronous)
            this.testFrame.tearDownPage();
         }

         this.currentTestPage.running = false;
         this.currentTestPage.notify( JsTestPage.STATUS_CHANGE_EVENT );

         this._nextPage();
         return;
      }

      if( this.testIndex == 0 ){
         this.currentTestPage.running = true;
         this.currentTestPage.notify( JsTestPage.STATUS_CHANGE_EVENT );

         this.storeRestoredHTML();
         if( typeof (this.testFrame.setUpPage) == 'function' ){
            // first test for this page and a setUpPage is defined
            if( typeof (this.testFrame.setUpPageStatus) == 'undefined' ){
               // setUpPage() not called yet, so call it
               this.testFrame.setUpPageStatus = false;
               this.testFrame.startTime = new Date();
               this.testFrame.setUpPage();
               // try test again later
               setTimeout( 'top.testManager.runTestFunction()', JsTestManager.SETUPPAGE_INTERVAL );
               return;
            }

            if( this.testFrame.setUpPageStatus != 'complete' ){
               this.setWindowStatus( 'setUpPage not completed... ' + this.testFrame.setUpPageStatus + ' ' + (new Date()) );
               if( (new Date() - this.testFrame.startTime) / 1000 > this.getsetUpPageTimeout() ){
                  this.fatalError( 'setUpPage timed out without completing.' );
                  if( !this.userConfirm( 'Retry Test Run?' ) ){
                     this.abort();
                     return;
                  }
                  this.testFrame.startTime = (new Date());
               }
               // try test again later
               setTimeout( 'top.testManager.runTestFunction()', JsTestManager.SETUPPAGE_INTERVAL );
               return;
            }
         }
      }

      this.setWindowStatus( '' ); // either not first test, or no setUpPage defined, or setUpPage completed

      var testFunction = this.currentTestPage.nextTestFunction();
      if( testFunction ){
         testFunction.status = 'running';
         testFunction.notify( 'statusChange' );
         this.executeTestFunction( testFunction );
         this.totalCount++;
         this.updateProgressIndicators();
         this.testIndex++;
         setTimeout( 'if (top.testManager) top.testManager.runTestFunction()', JsTestManager.TIMEOUT_LENGTH );
      }
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
      this._populateHeaderFields( this.params.getResultId(), this.params.getBrowserId(), navigator.userAgent, JSUNIT_VERSION, this
            .resolveUserEnteredTestFileName() );
      this._submitResultsForm();
   },

   _done : function() {
      var secondsSinceRunBegan = (new Date() - this._timeRunStarted) / 1000;
      this.setStatus( 'Done (' + secondsSinceRunBegan + ' seconds)' );

      // call the suite teardown function, if defined
      if( typeof top.suiteTearDown === 'function' ){
         top.suiteTearDown();
      }

      this._cleanUp();
      if( this.params.shouldSubmitResults() ){
         this.resultsTimeField.value = secondsSinceRunBegan;
         this.submitResults();
      }
   },

   _nextPage : function() {
      this._restoredHTML = null;
      if( this._currentTestGroup().hasMorePages() ){
         var testPage = this._currentTestGroup().nextPage();
         this.loadPage( testPage );
      }else{
         JsUnit.Util.pop( this.testGroupStack );
         if( this._currentTestGroup() == null )
            this._done();
         else
            this._nextPage();
      }
   },

   _currentTestGroup : function() {
      var suite = null;

      if( this.testGroupStack && this.testGroupStack.length > 0 )
         suite = this.testGroupStack[this.testGroupStack.length - 1];

      return suite;
   },

   calculateProgressBarProportion : function() {
      if( this.totalCount == 0 )
         return 0;
      var currentDivisor = 1;
      var result = 0;

      for( var i = 0; i < this.testGroupStack.length; i++ ){
         var testGroup = this.testGroupStack[i];
         currentDivisor *= testGroup._testPages.length;
         result += (testGroup._index - 1) / currentDivisor;
      }
      result += (this.testIndex + 1) / (this.numberOfTestsInPage * currentDivisor);
      return result;
   },

   _cleanUp : function() {
      this.containerController.setTestPage( './app/emptyPage.html' );
      this.finalize();
   },

   abort : function() {
      this.setStatus( 'Aborted' );
      this._cleanUp();
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

   _extractTestFunctionNamesFromScript : function( aScript ) {
      var result = new Array();
      var remainingScriptToInspect = aScript.text;
      var currentIndex = this._indexOfTestFunctionIn( remainingScriptToInspect );
      while( currentIndex != -1 ){
         var fragment = remainingScriptToInspect.substring( currentIndex, remainingScriptToInspect.length );
         result = result.concat( fragment.substring( 'function '.length, fragment.indexOf( '(' ) ) );
         remainingScriptToInspect = remainingScriptToInspect.substring( currentIndex + 12, remainingScriptToInspect.length );
         currentIndex = this._indexOfTestFunctionIn( remainingScriptToInspect );
      }
      return result;
   },

   _indexOfTestFunctionIn : function( string ) {
      return string.indexOf( 'function test' );
   },

   loadPage : function( testPage ) {
      this.currentTestPage = testPage;
      this._loadAttemptStartTime = new Date();
      this.setStatus( 'Opening Test Page "' + this.currentTestPage.url + '"' );
      this.containerController.setTestPage( this.currentTestPage.url );
      this._callBackWhenPageIsLoaded();
   },

   _callBackWhenPageIsLoaded : function() {
      if( (new Date() - this._loadAttemptStartTime) / 1000 > this.getTimeout() ){
         this.fatalError( 'Reading Test Page ' + this.currentTestPage.url + ' timed out.\nMake sure that the file exists and is a Test Page.' );
         if( this.userConfirm( 'Retry Test Run?' ) ){
            this.loadPage( this.currentTestPage );
            return;
         }else{
            this.abort();
            return;
         }
      }
      if( !this._isTestFrameLoaded() ){
         setTimeout( 'if (top.testManager) top.testManager._callBackWhenPageIsLoaded();', JsTestManager.TIMEOUT_LENGTH );
         return;
      }
      this.doneLoadingPage( this.currentTestPage );
   },

   _isTestFrameLoaded : function() {
      try{
         return this.containerController.isPageLoaded();
      }catch (e){
      }
      return false;
   },

   executeTestFunction : function( testFunction ) {
      this._currentTest = testFunction;
      this._testFunctionName = testFunction.testName;
      this.setStatus( 'Running test "' + this._testFunctionName + '"' );
      var exception = null;
      var timeBefore = new Date();
      try{
         if( this._restoredHTML )
            this.testFrame.document.getElementById( JsTestManager.RESTORED_HTML_DIV_ID ).innerHTML = this._restoredHTML;
         if( this.testFrame.setUp !== JSUNIT_UNDEFINED_VALUE )
            this.testFrame.setUp();
         this.testFrame[this._testFunctionName]();
      }catch (e1){
         exception = e1;
      }finally{
         try{
            if( this.testFrame.tearDown !== JSUNIT_UNDEFINED_VALUE )
               this.testFrame.tearDown();
         }catch (e2){
            // Unlike JUnit, only assign a tearDown exception to excep if there
            // is not already an exception from the test body
            if( exception == null )
               exception = e2;
         }
      }
      testFunction.timeTaken = new Date() - timeBefore;

      var timeTaken = testFunction.timeTaken / 1000;
      this._setTestStatus( testFunction, exception );
      this.uiManager.testCompleted( testFunction );

      var serializedTestCaseString = this._currentTestFunctionNameWithTestPageName( true ) + "|" + timeTaken + "|";
      if( exception == null )
         serializedTestCaseString += "S||";
      else{
         if( exception.isJsUnitFailure )
            serializedTestCaseString += "F|";
         else{
            serializedTestCaseString += "E|";
         }
         serializedTestCaseString += this.uiManager.problemDetailMessageFor( exception );
      }
      this._addOption( this.testCaseResultsField, serializedTestCaseString, serializedTestCaseString );
   },

   _currentTestFunctionNameWithTestPageName : function( useFullyQualifiedTestPageName ) {
      var testURL = this.testFrame.location.href;
      var testQuery = testURL.indexOf( "?" );
      if( testQuery >= 0 ){
         testURL = testURL.substring( 0, testQuery );
      }
      if( !useFullyQualifiedTestPageName ){
         if( testURL.substring( 0, this.baseURL.length ) == this.baseURL )
            testURL = testURL.substring( this.baseURL.length );
      }
      return testURL + ':' + this._testFunctionName;
   },

   setStatus : function( str ) {
      this.uiManager.setStatus( str );
      this.log.push( str );
   },

   updateProgressIndicators : function() {
      this.uiManager.updateProgressIndicators( this.totalCount, this.errorCount, this.failureCount, this.calculateProgressBarProportion() );
   },

   finalize : function() {
      this.uiManager.finishing();
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
      if( userEnteredTestFileName.indexOf( 'http://' ) == 0 || userEnteredTestFileName.indexOf( 'https://' ) == 0
            || userEnteredTestFileName.indexOf( 'file://' ) == 0 )
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
      if( this.params.wasResultUrlSpecified() ){
         return this._submitUrlFromSpecifiedUrl();
      }else{
         return this._submitUrlFromTestRunnerLocation();
      }
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
   addTraceData : function( message, value, traceLevel ) {
      var traceMessage = new JsUnit.TraceMessage( message, value, traceLevel );
      this._currentTest.addTraceMessage( traceMessage );

      if( !this.params.shouldSubmitResults() ){
         this.uiManager.addedTraceData( this._currentTest, traceMessage );
      }
   },

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
   },

   _setTestStatus : function( test, excep ) {
      var message = this._currentTestFunctionNameWithTestPageName( false ) + ' ';

      if( excep == null ){
         test.status = 'success';
         test.testPage.successCount++;
         message += 'passed';
      }else{
         test.exception = excep;

         if( !excep.isJsUnitFailure ){
            this.errorCount++;
            test.status = 'error';
            test.testPage.errorCount++;
            message += 'had an error';
         }else{
            this.failureCount++;
            test.status = 'failure';
            test.testPage.failureCount++;
            message += 'failed';
         }
      }

      test.message = message;
   },

});

JsTestManager.DEFAULT_TEST_FRAME_HEIGHT = 250;
JsTestManager.DEFAULT_SUBMIT_WEBSERVER = "localhost:8080";
JsTestManager.SETUPPAGE_TIMEOUT = 10; // seconds to wait for setUpPage to complete
JsTestManager.SETUPPAGE_INTERVAL = 100; // milliseconds to wait between polls on setUpPages
JsTestManager.RESTORED_HTML_DIV_ID = "jsUnitRestoredHTML";
JsTestManager.TESTPAGE_WAIT_SEC = 10; // seconds to wait for each test page to load
JsTestManager.TIMEOUT_LENGTH = 20; // milliseoncds between test runs
