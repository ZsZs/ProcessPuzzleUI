window.FixedComponentOrderedTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onComponentStateParse'],

   options : {
      testMethods : [
         { method : 'parse_transformsStringToObject', isAsynchron : false },
         { method : 'toString_transformsStateObjectsToString', isAsynchron : false }]
   },

   constants : {
      COMPONENT_LIST : ["TestComponentOne", "TestComponentTwo"],
      STATE_AS_STRING : "'State-one';{subStateOne:'SubStateOne',subStateTwo:'SubStateTwo'}",
      STATE_ONE : "State-one",
      STATE_TWO : { subStateOne: "SubStateOne", subStateTwo: "SubStateTwo" },
      TEST_COMPONENT_ONE : "TestComponentOne",
      TEST_COMPONENT_TWO : "TestComponentTwo"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.stateMachine = new LinkedHashMap();
      this.stateTransformer;
   },   

   beforeEachTest : function(){
      this.stateTransformer = new FixedComponentOrderedTransformer( this.stateMachine, this.constants.COMPONENT_LIST, { onComponentStateParse : this.onComponentStateParse });
      this.addComponentStates();
   },
   
   afterEachTest : function (){
      this.stateMachine.clear();
   },
   
   parse_transformsStringToObject : function() {
      //EXCERCISE:
      this.stateTransformer.parse( this.constants.STATE_AS_STRING );
      
      //VERIFY:
      assertEquals( 'State-one', this.stateMachine.get( "TestComponentOne" ));
      assertEquals( 'SubStateOne', this.stateMachine.get( "TestComponentTwo" )['subStateOne'] );
      assertEquals( 'SubStateTwo', this.stateMachine.get( "TestComponentTwo" )['subStateTwo'] );
   },
      
   toString_transformsStateObjectsToString : function(){
      //EXCERCISE, VERIFY:
      assertThat( this.stateTransformer.toString(), equalTo( this.constants.STATE_AS_STRING ));
   },
   
   //Protected, private helper methods
   addComponentStates : function(){
      this.stateMachine.put( this.constants.TEST_COMPONENT_ONE, this.constants.STATE_ONE );
      this.stateMachine.put( this.constants.TEST_COMPONENT_TWO, this.constants.STATE_TWO );
   }.protect(),
   
   onComponentStateParse : function( componentState ){
      this.stateMachine.put( componentState[0].trim(), componentState[1] );
   },
});