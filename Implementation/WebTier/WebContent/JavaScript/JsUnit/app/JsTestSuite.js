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
      this.parentSuite;
      this.suiteIndex = 0;

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
      this.testSuites.include( suite );
      suite.setParentSuite( this );
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

   hasMorePage : function() {
      return this.pageIndex < this.testPages.length;
   },
   
   hasMoreSuite : function(){
      return this.suiteIndex < this.testSuites.length;
   },

   nextPage : function() {
      return this.testPages[this.pageIndex++];
   },

   nextSuite : function() {
      return this.testSuites[this.suiteIndex++];
   },

   // Properties
   getParentSuite : function() { return this.parentSuite; },
   getTestPages : function(){ return this.testPages; },
   getTestSuites : function() { return this.testSuites; },
   setParentSuite : function( parentSuite ) { this.parentSuite = parentSuite ;},

// Protected, private helper mehtods
});

// For legacy support - JsUnitTestSuite used to be called jsUnitTestSuite
jsUnitTestSuite = JsTestSuite;
