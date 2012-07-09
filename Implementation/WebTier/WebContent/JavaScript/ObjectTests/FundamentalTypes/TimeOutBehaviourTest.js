window.TimeOutBehaviourTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'startTimeOutTimer_whenNotStoppedInTime_throwsTimeOutException', isAsynchron : true }]
   },

   constants : {
      DELAY : 100,
      MAX_TRIES : 5
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.timeGuardedObject;
   },

   beforeEachTest : function(){
      this.timeGuardedObject = new TimeGuardedClass({ delay : this.constants.DELAY, maxTries : this.constants.MAX_TRIES, onFailure : this.onFailure });
   },
   
   afterEachTest : function (){
      this.timeGuardedObject.stopTimeOutTimer();
   },
   
   startTimeOutTimer_whenNotStoppedInTime_throwsTimeOutException : function(){
      this.testCaseChain.chain(
         function(){
            this.timeGuardedObject.guardedProcess();
         }.bind( this ),
         function(){
            assertThat( this.error, JsHamcrest.Matchers.instanceOf( TimeOutException ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onFailure : function( error ){
      this.error = error;
      this.testCaseChain.callChain();
   },

   onSuccess : function(){
      this.testCaseChain.callChain();
   }
});

var TimeGuardedClass = new Class({
   Implements : [Events, Options, TimeOutBehaviour],
   Binds : [ 'checkTimeOut' ],
   options : {
      componentName : "TimeGuardedClass"
   },
   initialize : function( options ){
      this.setOptions( options );
   },
   
   guardedProcess : function(){
      this.startTimeOutTimer( "TimeGuardedClass.guardedProcess" );
   },
   
   //Protected, private helper methods
   timeOut : function( exception ){
      this.fireEvent( 'failure', exception );
   }.protect()
});