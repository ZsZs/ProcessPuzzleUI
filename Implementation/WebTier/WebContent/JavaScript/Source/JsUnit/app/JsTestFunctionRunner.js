/* JsTestFunctionRunner
*
*/

var JsTestFunctionRunner = new Class({
   Extends : JsTestRunner,
   
   options : {
   },
   
   //Constructor
   initialize : function( testCases, options ){
      this.parent( testCases, options );
   },
   
   //Public accessor and mutator methods
   runTests : function(){
      this.parent();
   },
   
   //Properties   
   
   //Protected, private helper methods
   
   runTestCase : function( testFunction ){
   }.protect(),
      
});