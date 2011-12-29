/* JsTestClassRunner
 * 
 */
var JsTestClassRunner = new Class({
   Extends : JsTestRunner,
   Implements: [Options],
   Binds: ['callAfterEachTest', 'callBeforeEachTest', 'checkTimeOut', 'onTestMethodReady'],
   options: {
   },

   //Constructor
   initialize: function( testCases, options ){
      this.parent( testCases, options );
      this.testCaseChain = new Chain();
      this.testObject;
      this.waitList = new Array();
   },
   
   //Public accessor and mutator methods
   onTestMethodReady: function(  testMethod  ){
      var testCaseName = null;
      if( testMethod && typeOf( testMethod ) == 'function' ) testCaseName = testMethod.$name;

      this.onTestCaseFinished( testCaseName );
      this.testCaseChain.callChain();
   },
      
   runTests : function(){
      this.parent();
   },
   
   //Properties
   getTestClass: function(){ return this.testClass; },
   
   //Protected, private helper methods
   callAfterEachTest: function(){
      this.testObject.afterEachTest();
      this.testCaseChain.callChain();
   }.protect(),
   
   callBeforeEachTest: function(){
      this.testObject.beforeEachTest();
      this.testCaseChain.callChain();
   }.protect(),
   
   compileTestMethodChain: function(){
      this.testObject.options.testMethods.each( function( testCaseProperties, index ){
         var testMethodName = testCaseProperties['method'];
         var isAsynchron = testCaseProperties['isAsynchron'] ? testCaseProperties['isAsynchron'] : false; 
         this.testCaseChain.chain(
            this.callBeforeEachTest,
            function(){ 
               this.runTestMethod( testMethodName, isAsynchron ); 
            }.bind( this ),
            this.callAfterEachTest
         );
      }, this );
   }.protect(),
   
   runTestMethod: function( testMethodName, isAsynchron ){
      try{
         testMethod = eval( "this.testObject." + testMethodName );
         testMethod();
         
         if( isAsynchron ) this.waitForTestMethod( testMethodName );
         else this.testCaseChain.callChain();
      }catch( e ){
         alert( "Running of test method '" + testMethodName + "' caused the following error: " + e.message );
      }
   }.protect(),
   
   runTestCase: function( testClass ){
      this.testObject = new testClass({ onReady : this.onTestMethodReady });
      this.testObject.beforeAllTests();
      this.compileTestMethodChain();
      this.testCaseChain.callChain();
      this.testObject.afterAllTests();
   }.protect(),
   
});

