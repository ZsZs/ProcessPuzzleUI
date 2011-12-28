var JsClassicUiManager = new Class( {
   Extends : JsBaseUiManager,

   //Constructor
   initialize : function( testManager ) {
      this.closeTraceWindowOnNewRun;
      this.runButton;
      this.popupWindowsBlocked;
      this.problemsListField;
      this.progressBar;
      this.setUpPageTimeout;
      this.stopButton;
      this.testFileName;
      this.testManager = testManager;
      this.timeout;
      this.traceLevel;
      this.traceWindow;
      this.uiFrames;
      this.windowForAllProblemMessages;
   },

   //Public accessor and mutator methods
   onLoad : function( mainFrame ) {
      var mainData = mainFrame.frames.mainData;

      // form elements on mainData frame
      this.testFileName = mainData.document.testRunnerForm.testFileName;
      this.runButton = mainData.document.testRunnerForm.runButton;
      this.stopButton = mainData.document.testRunnerForm.stopButton;
      this.traceLevel = mainData.document.testRunnerForm.traceLevel;
      this.closeTraceWindowOnNewRun = mainData.document.testRunnerForm.closeTraceWindowOnNewRun;
      this.timeout = mainData.document.testRunnerForm.timeout;
      this.setUpPageTimeout = mainData.document.testRunnerForm.setUpPageTimeout;

      // image output
      this.progressBar = mainFrame.frames.mainProgress.document.progress;

      this.problemsListField = mainFrame.frames.mainErrors.document.testRunnerForm.problemsList;

      // 'layer' output frames
      this.uiFrames = new Object();
      this.uiFrames.mainStatus = mainFrame.frames.mainStatus;

      var mainCounts = mainFrame.frames.mainCounts;

      this.uiFrames.mainCountsErrors = mainCounts.frames.mainCountsErrors;
      this.uiFrames.mainCountsFailures = mainCounts.frames.mainCountsFailures;
      this.uiFrames.mainCountsRuns = mainCounts.frames.mainCountsRuns;

      this.windowForAllProblemMessages = null;

      this.traceWindow = null;
      this.popupWindowsBlocked = false;
   },

   starting : function() {
      this._setRunButtonEnabled( false );
      this._clearProblemsList();

      this.initializeTracer();

      var traceLevel = this.getTraceLevel();
      if( traceLevel != JsUnitTraceLevel.NONE ){
         this.openTracer();
      }
   },

   finishing : function() {
      this._setRunButtonEnabled( true );
      this.finalizeTracer();
   },

   submittingResults : function() {
      this.runButton.disabled = true;
      this.stopButton.disabled = true;
   },

   initializeTracer : function() {
      if( this.traceWindow != null && this.closeTraceWindowOnNewRun.checked )
         this.traceWindow.close();
      this.traceWindow = null;
   },

   finalizeTracer : function() {
      if( this.traceWindow != null ){
         this.traceWindow.document.write( '<\/body>\n<\/html>' );
         this.traceWindow.document.close();
      }
   },

   openTracer : function() {
      var traceWindow = this._getTraceWindow();
      if( traceWindow ){
         traceWindow.focus();
      }else{
         this.fatalError( 'Tracing requires popup windows, and popups are blocked in your browser.\n\nPlease enable popups if you wish to use tracing.' );
      }
   },

   _clearProblemsList : function() {
      var listField = this.problemsListField;
      var initialLength = listField.options.length;

      for( var i = 0; i < initialLength; i++ )
         listField.remove( 0 );
   },

   _setRunButtonEnabled : function( b ) {
      this.runButton.disabled = !b;
      this.stopButton.disabled = b;
   },

   _setTextOnLayer : function( layerName, str ) {
      try{
         var content = this.uiFrames[layerName].document.getElementById( 'content' );
         if( content )
            content.innerHTML = str;
         else
            throw new Error( "No content div found." );
      }catch (e){
         var html = '';
         html += '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';
         html += '<html><head><link rel="stylesheet" type="text/css" href="css/jsUnitStyle.css"><\/head>';
         html += '<body><div id="content">';
         html += str;
         html += '<\/div><\/body>';
         html += '<\/html>';
         this.uiFrames[layerName].document.write( html );
         this.uiFrames[layerName].document.close();
      }
   },

   //Properties
   getTestFileName : function() { return this.testFileName.value; },
   getTraceLevel : function() { var levelNumber = eval( this.traceLevel.value ); return JsUnitTraceLevel.findByLevelNumber( levelNumber ); },
   getUiFrameUrl : function() { return './app/main-frame.html'; },
   setStatus : function( str ) { this._setTextOnLayer( 'mainStatus', '<b>Status:<\/b> ' + str ); },
   _setErrors : function( n ) { this._setTextOnLayer( 'mainCountsErrors', '<b>Errors: <\/b>' + n ); },
   _setFailures : function( n ) { this._setTextOnLayer( 'mainCountsFailures', '<b>Failures:<\/b> ' + n ); },
   _setProgressBarImage : function( imgName ) { this.progressBar.src = imgName; },
   _setProgressBarWidth : function( w ) { this.progressBar.width = w; },
   _setTotal : function( n ) { this._setTextOnLayer( 'mainCountsRuns', '<b>Runs:<\/b> ' + n ); },

   //Protected, private helper methods
   updateProgressIndicators : function( totalCount, errorCount, failureCount, progressBarProportion ) {
      this._setTotal( totalCount );
      this._setErrors( errorCount );
      this._setFailures( failureCount );
      this._setProgressBarWidth( 300 * progressBarProportion );

      if( errorCount > 0 || failureCount > 0 )
         this._setProgressBarImage( '../images/red.gif' );
      else
         this._setProgressBarImage( '../images/green.gif' );
   },

   testCompleted : function( test ) {
      if( test.status != 'success' ){
         var listField = this.problemsListField;
         var exceptionText = this.problemDetailMessageFor( test.exception );
         this.testManager._addOption( listField, exceptionText, test.message );
      }
   },

   showMessageForSelectedProblemTest : function() {
      var problemTestIndex = this.problemsListField.selectedIndex;
      if( problemTestIndex != -1 )
         this.fatalError( this.problemsListField[problemTestIndex].value );
   },

   showMessagesForAllProblemTests : function() {
      if( this.problemsListField.length == 0 )
         return;

      this._tryToCloseWindow( this.windowForAllProblemMessages );

      var body = '<p>Tests with problems (' + this.problemsListField.length + ' total) - JsUnit<\/p>' + '<p>Running on ' + navigator.userAgent + '</p>';

      for( var i = 0; i < this.problemsListField.length; i++ ){
         body += '<p class="jsUnitDefault">';
         body += '<b>' + (i + 1) + '. ';
         body += this.problemsListField[i].text;
         body += '<\/b><\/p><p><pre>';
         body += this.makeHTMLSafe( this.problemsListField[i].value );
         body += '<\/pre><\/p>';
      }

      this.windowForAllProblemMessages = this._createWindow( "Tests with problems", body );
   },

   showLog : function() {
      this._tryToCloseWindow( this.logWindow );

      var body = "<pre>";

      var log = this.testManager.log;
      for( var i = 0; i < log.length; i++ ){
         body += log[i];
         body += "\n";
      }

      body += "</pre>";

      this.logWindow = this._createWindow( "Log", body );
   },

   _tryToCloseWindow : function( w ) {
      try{
         if( w && !w.closed )
            w.close();
      }catch (e){
      }
   },

   _createWindow : function( title, body ) {
      var w = window.open( '', '', 'width=600, height=350,status=no,resizable=yes,scrollbars=yes' );
      var resDoc = w.document;
      resDoc.write( '<html><head><link rel="stylesheet" href="../css/jsUnitStyle.css"><title>' );
      resDoc.write( title );
      resDoc.write( ' - JsUnit<\/title><head><body>' );
      resDoc.write( body );
      resDoc.write( '<\/body><\/html>' );
      resDoc.close();
   },

   fatalError : function( aMessage ) {
      if( this.testManager._params.shouldSuppressDialogs() ) // todo: huh?
         this.setStatus( aMessage );
      else
         alert( aMessage );
   },

   userConfirm : function( aMessage ) {
      if( this.testManager._params.shouldSuppressDialogs() ) // todo: huh?
         return false;
      else
         return confirm( aMessage );
   },

   addedTraceData : function( theTest, traceMessage ) {
      if( this.getTraceLevel().matches( traceMessage.traceLevel ) ){
         var traceString = traceMessage.message;
         if( traceMessage.value )
            traceString += ': ' + traceMessage.value;
         var prefix = theTest.testPage.url + ":" + theTest.testName + " - ";
         this._writeToTraceWindow( prefix, traceString, traceMessage.traceLevel );
      }
   },

   _writeToTraceWindow : function( prefix, traceString, traceLevel ) {
      var htmlToAppend = '<p class="jsUnitDefault">' + prefix + '<font color="' + traceLevel.getColor() + '">' + traceString + '</font><\/p>\n';
      this._getTraceWindow().document.write( htmlToAppend );
   },

   _getTraceWindow : function() {
      if( this.traceWindow == null && !this.testManager._params.shouldSubmitResults() && !this.popupWindowsBlocked ){
         this.traceWindow = window.open( '', '', 'width=600, height=350,status=no,resizable=yes,scrollbars=yes' );
         if( !this.traceWindow )
            this.popupWindowsBlocked = true;
         else{
            var resDoc = this.traceWindow.document;
            resDoc.write( '<html>\n<head>\n<link rel="stylesheet" href="css/jsUnitStyle.css">\n<title>Tracing - JsUnit<\/title>\n<head>\n<body>' );
            resDoc.write( '<h2>Tracing - JsUnit<\/h2>\n' );
            resDoc.write( '<p class="jsUnitDefault"><i>(Traces are color coded: ' );
            resDoc.write( '<font color="' + JsUnitTraceLevel.WARNING.getColor() + '">Warning</font> - ' );
            resDoc.write( '<font color="' + JsUnitTraceLevel.INFO.getColor() + '">Information</font> - ' );
            resDoc.write( '<font color="' + JsUnitTraceLevel.DEBUG.getColor() + '">Debug</font>' );
            resDoc.write( ')</i></p>' );
         }
      }
      return this.traceWindow;
   },

   learnedOfTestPage : function() { },

});
