/* JsTestClassRunner
 * 
 */
var JsTestClassRunner = new Class({
   Extends : JsTestRunner,
   Implements: [Options],
   Binds: ['collectTestCases', 'runTests'],
   options: {
      componentName : "JsTestClassRunner",
   },

   //Constructor
   initialize: function( testFrame, options ){
      this.parent( testFrame, options );
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
      var frameAnalyser = new JsTestFrameAnalyser( this.testFrame );
      frameAnalyser.getTestClassNames().each( function( className, index ){
         var windowName = this.testFrame.name ? "this." + this.testFrame.name + "." : "window."; 
         var testClass = eval( windowName + className );
         this.instantiateTestMethodOfClass( className, testClass );
      }, this );
   }.protect(),
   
   instantiateTestMethodOfClass : function( className, testClass ){
      this.testObject = new testClass();
      this.testObject.options.testMethods.each( function( testMethodProperties, index ){
         var testMethodOptions = { 
            isAfterEachTestAsynchron : this.testObject.options.isAfterEachTestAsynchron,
            isBeforeEachTestAsynchron : this.testObject.options.isBeforeEachTestAsynchron, 
            url : this.options.url };
         this.testCases.include( new JsTestMethod( className, testClass, testMethodProperties, testMethodOptions ));
      }, this );
   }.protect(),
      
});

