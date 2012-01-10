/*
 * JsUniTestSuite
 * A JsUnitTestSuite represents a suite of JsUnit Test Pages.  Test Pages and Test Suites can be added to a JsUnitTestSuite
 */

var JsTestSuite = new Class( {
   Implements : [Events, Options],

   options : {
      componentName : "JsTestSuite"
   },

   // Constructor
   initialize : function( options ) {
      this.setOptions( options );
      this.isJsUnitTestSuite = true;
      this.testPages = Array();
      this.testSuites = new Array();
      this.pageIndex = 0;

      for( var i = 0; i < arguments.length; i++ ){
         if( arguments[i]._testPages ){
            this.addTestSuite( arguments[i] );
         }else{
            this.addTestPage( arguments[i] );
         }
      }
   },

   // Public accessors and mutators
   addTestPage : function( page ) {
      this.testPages[this.testPages.length] = page;
   },

   addTestSuite : function( suite ) {
      for( var i = 0; i < suite.testPages.length; i++ )
         this.addTestPage( suite.testPages[i] );
   },

   clone : function() {
      var clone = new JsUnitTestSuite();
      clone.testPages = this.testPages;
      return clone;
   },

   containsTestPages : function() {
      return this.testPages.length > 0;
   },
   
   currentPage : function(){
      return this.testPages[this.pageIndex];
   },

   currentSuite : function(){
      return this.testPages[this.pageIndex];
   },

   hasMorePages : function() {
      return this.pageIndex < this.testPages.length;
   },

   nextPage : function() {
      return this.testPages[this.pageIndex++];
   },

   // Properties
   getTestPages : function(){ return this.testPages; },
   getTestSuites : function() { return this.testSuites; },

// Protected, private helper mehtods
});

// For legacy support - JsUnitTestSuite used to be called jsUnitTestSuite
jsUnitTestSuite = JsTestSuite;
