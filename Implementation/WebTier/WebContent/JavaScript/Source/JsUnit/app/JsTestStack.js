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
      this.testSuites = new Array();
   },
   
   //Public accessors and mutators
   addTestPage : function( testPage ) {
      this.testPages.include( testPage );
   },
   
   addTestSuite : function( testSuite ){
      this.testSuites.include( testSuite );
   },
   
   currentSuite : function(){
      return this.testSuites[this.testSuiteIndex];
   },

   hasMorePages : function() {
      return (this.testPageIndex < this.testPages.length ) ||
      this.currentSuite().hasMorePages() ||
      this.hasMoreSuite();
   },
   
   hasMoreSuite : function() { return this.testSuiteIndex < this.testSuites.length; },

   nextPage : function() {
      if( this.testPageIndex < this.testPages.length ) return this.testPages[this.testPageIndex++]; 
      else if( this.currentSuite().hasMorePages() ) return this.currentSuite().nextPage();
      else if( this.hasMoreSuite() ) return this.nextSuite().nextPage();
      else return null;
   },
   
   nextSuite : function() {
      return this.testSuites[this.testSuiteIndex++]; 
   },
   
   //Properties
   getCurrentPage : function() { return this.testPages[this.index]; },
   getTestPages : function() { return this.testPages; }
});
