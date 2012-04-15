window.FixedComponentOrderedTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onComponentStateParse'],

   options : {
      testMethods : [
         { method : 'addComponent_addsComponentNameToTheList', isAsynchron : false },
         { method : 'parse_transformsStringToObject', isAsynchron : false },
         { method : 'parse_whenStateValueIsUnknow_setsValueToNull', isAsynchron : false },
         { method : 'toString_transformsStateObjectsToString', isAsynchron : false },
         { method : 'toString_whenStateIsNull_setsValueToUnknown', isAsynchron : false }]
   },

   constants : {
      COMPONENT_LIST : ["TestComponentOne", "TestComponentTwo"],
      STATE_AS_STRING : "'State-one';{subStateOne:'SubStateOne',subStateTwo:'SubStateTwo'}",
      STATE_AS_STRING_WITH_UNKNOWNS : ";'unknown';{subStateOne:'SubStateOne',subStateTwo:'unknown'}",
      STATE_ONE : "State-one",
      STATE_TWO : { subStateOne: "SubStateOne", subStateTwo: "SubStateTwo" },
      TEST_COMPONENT_ONE : "TestComponentOne",
      TEST_COMPONENT_TWO : "TestComponentTwo",
      TEST_COMPONENT_THREE : "TestComponentThree",
      TEST_COMPONENT_FOUR : "TestComponentFour"
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
   
   addComponent_addsComponentNameToTheList : function(){
      this.stateTransformer.addComponentName( "NewComponent" );
      assertThat( this.stateTransformer.getComponentNames(), hasItem( "NewComponent" ));
   },
   
   parse_transformsStringToObject : function() {
      //EXCERCISE:
      this.stateTransformer.parse( this.constants.STATE_AS_STRING );
      
      //VERIFY:
      assertEquals( 'State-one', this.stateMachine.get( "TestComponentOne" ));
      assertEquals( 'SubStateOne', this.stateMachine.get( "TestComponentTwo" )['subStateOne'] );
      assertEquals( 'SubStateTwo', this.stateMachine.get( "TestComponentTwo" )['subStateTwo'] );
   },
      
   parse_whenStateValueIsUnknow_setsValueToNull : function() {
      //EXCERCISE:
      this.stateTransformer.addComponentName( this.constants.TEST_COMPONENT_THREE );
      this.stateTransformer.addComponentName( this.constants.TEST_COMPONENT_FOUR );
      this.stateTransformer.parse( this.constants.STATE_AS_STRING + this.constants.STATE_AS_STRING_WITH_UNKNOWNS );
      
      //VERIFY:
      assertThat( this.stateMachine.get( this.constants.TEST_COMPONENT_THREE ), is( nil() ));
      assertThat( this.stateMachine.get( this.constants.TEST_COMPONENT_FOUR )['subStateTwo'], is( nil() ));
   },
      
   toString_transformsStateObjectsToString : function(){
      //EXCERCISE, VERIFY:
      assertThat( this.stateTransformer.toString(), equalTo( this.constants.STATE_AS_STRING ));
   },
   
   toString_whenStateIsNull_setsValueToUnknown : function(){
      //SETUP:
      this.addComponentStates();
      this.stateTransformer.addComponentName( this.constants.TEST_COMPONENT_THREE );
      this.stateTransformer.addComponentName( this.constants.TEST_COMPONENT_FOUR );
      this.stateMachine.put( this.constants.TEST_COMPONENT_THREE, null );
      this.stateMachine.put( this.constants.TEST_COMPONENT_FOUR, { subStateOne: "SubStateOne", subStateTwo: null } );
      
      //EXCERCISE, VERIFY:
      assertThat( this.stateTransformer.toString(), equalTo( this.constants.STATE_AS_STRING  + this.constants.STATE_AS_STRING_WITH_UNKNOWNS ));
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