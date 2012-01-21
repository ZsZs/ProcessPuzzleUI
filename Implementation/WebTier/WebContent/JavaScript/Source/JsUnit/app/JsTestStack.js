var JsTestStack = new Class({
   Implements : [Events, Options],
   Binds : [],
   
   options : {
      verbose : false
   },
   
   //Constructor
   initialize : function( options ) {
      this.setOptions( options );
      this.testPageIndex = 0;
      this.testPages = new Array();
      this.testSuiteIndex = 0;
      this.currentTestSuite;
   },
   
   //Public accessors and mutators
   addTestPage : function( testPage ) {
      this.testPages.include( testPage );
   },
   
   addTestSuite : function( testSuite ){
      if( this.currentTestSuite ) this.currentTestSuite.addTestSuite( testSuite );
      this.currentTestSuite = testSuite;
   },
   
   hasMorePages : function() {
      if( this.testPageIndex < this.testPages.length ) return true;
      else if( this.currentTestSuite && this.currentTestSuite.hasMorePage() ) return true;
      else if( this.currentTestSuite && this.currentTestSuite.hasMoreSuite() ) return true;
      else if( this.currentTestSuite && this.currentTestSuite.getParentSuite() ) return true;
      else return false;
   },
   
   hasMoreSuite : function() { return this.testSuiteIndex < this.testSuites.length; },

   nextPage : function() {
      if( this.testPageIndex < this.testPages.length ) return this.testPages[this.testPageIndex++]; 
      else if( this.currentTestSuite.hasMorePage() ) return this.currentTestSuite.nextPage();
      else if( this.currentTestSuite.hasMoreSuite() ) {
         this.currentTestSuite = this.currentTestSuite.nextSuite();
         return currentTestSuite.nextPage();
      }else if( this.currentTestSuite.getParentSuite() ){
         this.currentTestSuite = this.currentTestSuite.getParentSuite();
         return this.nextPage();
      }else return null;
   },
   
   nextSuite : function() {
      return this.testSuites[this.testSuiteIndex++]; 
   },
   
   //Properties
   getCurrentPage : function() { return this.testPages[this.index]; },
   getCurrentSuite : function() { return this.currentTestSuite; },
   getTestPages : function() { return this.testPages; }
});
