/* JsTestFunctionRunner
 *
 */
var JsTestFunctionRunner = new Class( {
   Extends : JsTestRunner,

   options : {
   },

   // Constructor
   initialize : function( testDefinitions, options ) {
      this.parent( testDefinitions, options );
   },

   // Public accessor and mutator methods
   runTests : function() {
      this.parent();
   },

   // Properties

   // Protected, private helper methods
   collectTestCases : function(){
      this.testDefinitions.each( function( testFunctionName, index ){
         this.instantiateTestFunction( testFunctionName );
      }, this );      
   }.protect(),
   
   instantiateTestFunction : function( testFunctionName ){
      try{
         var testFunction = new JsTestFunction( testFunctionName, { functionNamePrefix : 'top.testManager.testFrame.' });
         this.testCases.include( testFunction );
      }catch( e ){
         alert( "Instantiating test function:'" + testFunctionName + "' failed." );
      }
   }.protect(),
});