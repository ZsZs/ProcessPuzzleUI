var JsTestGroup = new Class({
   Implements : [Events, Options],
   Binds : ['onTestCaseFinished', 'onTestSuiteFinished'],
   
   //Constructor
   initialize : function( options ) {
      this.setOptions( options );
      this._testPages = [];
      this._index = 0;
   },

   addTestPage : function( testPageUrl, testFrame ) {
      var testPage = new JsTestPage( testPageUrl, testFrame, { onTestCaseFinished : this.onTestCaseFinished, onTestSuiteFinished : this.onTestSuiteFinished });
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
   
   onTestSuiteFinished : function( testSuiteName ){
      this.fireEvent( 'testSuiteFinished', testSuiteName );
   }
});
