/* JsTestRunner
 * 
 */
var JsTestRunner = new Class({
   Implements: [Options],
   Binds: ['callAfterEachTest', 'callBeforeEachTest', 'checkTimeOut', 'onTestMethodReady'],
   options: {
      delay: 200,
      maxTries: 20
   },

   //Constructor
   initialize: function( testClass ){
      this.numberOfTries;
      this.testClass = testClass;
      this.testCaseChain = new Chain();
      this.testObject = new this.testClass({ onReady : this.onTestMethodReady });
      this.timer;
      this.waitList = new Array();
   },
   
   //Public accessor and mutator methods
   onTestMethodReady: function(  testMethod  ){
      clearInterval( this.timer );
      if( testMethod && typeOf( testMethod ) == 'function' ) this.waitList.erase( testMethod.$name );
      this.testCaseChain.callChain();
   },
   
   runTestCases: function(){
      this.testObject.beforeAllTests();
      this.compileTestCaseChain();
      this.testCaseChain.callChain();
      this.testObject.afterAllTests();
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
   
   checkTimeOut: function(){
      this.numberOfTries++;
      console.log( "time out checked" );
      if( this.numberOfTries >= this.options.maxTries ){
         clearInterval( this.timer );
         throw new Error( "One of your asynchron test methods: " + this.waitList.toString() + " didn't fired 'ready' event." );
      }
   },
   
   compileTestCaseChain: function(){
      this.testObject.options.testMethods.each( function( testCaseProperties, index ){
         var testMethodName = testCaseProperties['method'];
         var isAsynchron = testCaseProperties['isAsynchron'] ? testCaseProperties['isAsynchron'] : false; 
         this.testCaseChain.chain(
            this.callBeforeEachTest,
            function(){ 
               this.runTestCase( testMethodName, isAsynchron ); 
            }.bind( this ),
            this.callAfterEachTest
         );
      }, this );
   }.protect(),
   
   runTestCase: function( testMethodName, isAsynchron ){
      try{
         testMethod = eval( "this.testObject." + testMethodName );
         testMethod();
         
         if( isAsynchron ) this.waitForTestMethod( testMethodName );
         else this.testCaseChain.callChain();
      }catch( e ){
         alert( "Running of test method '" + testMethodName + "' caused the following error: " + e.message );
      }
   }.protect(),
   
   waitForTestMethod: function( testMethodName ){
      this.waitList.include( testMethodName );
      this.numberOfTries = 0;
      this.timer = this.checkTimeOut.periodical( this.options.delay );
   }.protect()
});

