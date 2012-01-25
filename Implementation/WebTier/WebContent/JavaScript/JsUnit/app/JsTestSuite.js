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
      this.parentSuite;
      this.testPageIndex = 0;
      this.testPages = Array();
      this.testSuiteIndex = 0;
      this.testSuites = new Array();

//      for( var i = 0; i < arguments.length; i++ ){
//         if( arguments[i]._testPages ){
//            this.addTestSuite( arguments[i] );
//         }else{
//            this.addTestPage( arguments[i] );
//         }
//      }
   },

   // Public accessors and mutators
   addTestPage : function( page ) {
      this.testPages.include( page );
   },

   addTestSuite : function( suite ) {
      this.testSuites.include( suite );
      suite.setParentSuite( this );
   },

   containsTestPages : function() {
      return this.testPages.length > 0;
   },
   
   currentPage : function(){
      return this.testPages[this.testPageIndex];
   },

   currentSuite : function(){
      return this.testPages[this.testPageIndex];
   },

   hasMorePage : function() {
      return this.testPageIndex < this.testPages.length;
   },
   
   hasMoreSuite : function(){
      return this.testSuiteIndex < this.testSuites.length;
   },

   nextPage : function() {
      return this.testPages[this.testPageIndex++];
   },

   nextSuite : function() {
      return this.testSuites[this.testSuiteIndex++];
   },

   // Properties
   getParentSuite : function() { return this.parentSuite; },
   getTestPages : function(){ return this.testPages; },
   getTestSuites : function() { return this.testSuites; },
   setParentSuite : function( parentSuite ) { this.parentSuite = parentSuite ; }

   // Protected, private helper mehtods
});

// For legacy support - JsUnitTestSuite used to be called jsUnitTestSuite
jsUnitTestSuite = JsTestSuite;
