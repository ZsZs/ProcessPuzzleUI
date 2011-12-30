/* JsTestClassRunner
 * 
 */
var JsTestClassRunner = new Class({
   Extends : JsTestRunner,
   Implements: [Options],
   Binds: [],
   options: {
   },

   //Constructor
   initialize: function( testDefinitions, options ){
      this.parent( testDefinitions, options );
      this.testMethodChain;
      this.testObject;
      this.waitList = new Array();
   },
   
   //Public accessor and mutator methods
   runTests : function(){
      this.parent();
   },
   
   //Properties
   getTestClass: function(){ return this.testClass; },
   
   //Protected, private helper methods
   collectTestCases : function(){
      this.testDefinitions.each( function( testClass, index ){
         this.instantiateTestMethodOfClass( testClass );
      }, this );      
   }.protect(),
   
   instantiateTestMethodOfClass : function( testClass ){
      this.testObject = new testClass();
      this.testObject.options.testMethods.each( function( testMethodProperties, index ){
         this.testCases.include( new JsTestMethod( testClass, testMethodProperties ));
      }, this );
   }.protect(),
      
});

