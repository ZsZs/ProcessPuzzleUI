/* JsTestFunctionRunner
 *
 */
var JsTestFunctionRunner = new Class( {
   Extends : JsTestRunner,

   options : {
      componentName : "JsTestFunctionRunner",
      functionNamePrefix : "top.testManager.testFrame."
   },

   // Constructor
   initialize : function( testFrame, options ) {
      this.parent( testFrame, options );
   },

   // Public accessor and mutator methods
   runTests : function() {
      this.parent();
   },

   // Properties

   // Protected, private helper methods
   collectTestCases : function(){
      var frameAnalyser = new JsTestFrameAnalyser( this.testFrame );
      var testFunctionNames = frameAnalyser.getTestFunctionNames();
      if( testFunctionNames ){
         testFunctionNames.each( function( functionName, index ){
            this.instantiateTestFunction( functionName );
         }, this );
         
         var windowName = this.testFrame.name ? "this." + this.testFrame.name + "." : "window."; 
         try{
            eval( windowName + "JsTestFunction.current = {}" );
            eval( windowName + "JsTestFunction.current.onReady = {}" );
            eval( windowName + "JsTestFunction.current.asynchron = false" );
         }catch( e ){
            alert( "Please include JsObjectTest related files into your test." );
         }
      }
   }.protect(),
   
   instantiateTestFunction : function( testFunctionName ){
      try{
         var testFunction = new JsTestFunction( testFunctionName, { functionNamePrefix : this.options.functionNamePrefix, url : this.options.url });
         this.testCases.include( testFunction );
      }catch( e ){
         alert( "Instantiating test function:'" + testFunctionName + "' failed." );
      }
   }.protect(),
});