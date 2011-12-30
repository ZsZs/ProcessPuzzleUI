var JsTestGroup = new Class({
   Implements : [Events, Options],
   Binds : ['onTestCaseFinished', 'onTestCaseStarted', 'onTestSuiteFinished'],
   
   options : {
      verbose : false
   },
   
   //Constructor
   initialize : function( options ) {
      this.setOptions( options );
      this._testPages = [];
      this._index = 0;
   },

   addTestPage : function( testPageUrl, testFrame ) {
      var testPage = new JsTestPage( testPageUrl, testFrame, { onTestCaseFinished : this.onTestCaseFinished, onTestCaseStarted : this.onTestCaseStarted, onTestSuiteFinished : this.onTestSuiteFinished, verbose : this.options.verbose });
      JsUnit.Util.push( this._testPages, testPage );
      return testPage;
   },

   hasMorePages : function() {
      return this._index < this._testPages.length;
   },

   nextPage : function() {
      return this._testPages[this._index++];
   },
   
   onTestCaseFinished : function( testCaseName, result ){
      this.fireEvent( 'testCaseFinished', [ testCaseName, result ] );
   },
   
   onTestCaseStarted : function( testCaseName ){
      this.fireEvent( 'testCaseStarted', testCaseName );
   },
   
   onTestSuiteFinished : function( testSuiteName ){
      this.fireEvent( 'testSuiteFinished', testSuiteName );
   }
});
