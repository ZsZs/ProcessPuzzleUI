window.ComponentStateManagerTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
          { method : 'initialize_instantiatesStateTransformers', isAsynchron : false }, 
          { method : 'parse_transformsStringToObject', isAsynchron : false }, 
          { method : 'parseUri_transformsStringToObject', isAsynchron : false }, 
          { method : 'retrieveComponentState_returnsStoredStateOfComponent', isAsynchron : false }, 
          { method : 'storeComponentState_storesComponentStateObject', isAsynchron : false }, 
          { method : 'toString_transformsStateObjectsToString', isAsynchron : false }, 
          { method : 'toUri_transformsStateObjectsToString', isAsynchron : false }, 
          { method : 'persist_storesStatesInBrowser', isAsynchron : false }, 
          { method : 'restore_retrieveStatesFromBrowser', isAsynchron : false }, 
          { method : 'reset_setsComponentStatesToNull', isAsynchron : false }]
   },

   constants : {
      STATE_AS_STRING : "TestComponentOne:'State-one';TestComponentTwo:{subStateOne:'SubStateOne',subStateTwo:'SubStateTwo'}",
      STATE_ONE : "State-one",
      STATE_TWO : { subStateOne: "SubStateOne", subStateTwo: "SubStateTwo" },
      TEST_COMPONENT_ONE : "TestComponentOne",
      TEST_COMPONENT_TWO : "TestComponentTwo",
      URI_AS_STRING : "'State-one';{subStateOne:'SubStateOne',subStateTwo:'SubStateTwo'}",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.stateManager;
   },   

   beforeEachTest : function(){
      this.stateManager = new ComponentStateManager({ componentsInUri : [this.constants.TEST_COMPONENT_ONE, this.constants.TEST_COMPONENT_TWO] });
      this.stateManager.storeComponentState( this.constants.TEST_COMPONENT_ONE, this.constants.STATE_ONE );
      this.stateManager.storeComponentState( this.constants.TEST_COMPONENT_TWO, this.constants.STATE_TWO );
   },
   
   afterEachTest : function (){
      this.stateManager.reset();
      this.stateManager = null;
   },
   
   initialize_instantiatesStateTransformers : function() {
      //VERIFY:
      assertThat( this.stateManager.getDefaultTransformer() );
      assertThat( this.stateManager.getUriTransformer() );
   },
   
   parse_transformsStringToObject : function() {
      //SETUP:
      this.stateManager.reset();
      
      //EXCERCISE:
      this.stateManager.parse( this.constants.STATE_AS_STRING );
      
      //VERIFY:
      assertEquals( 'State-one', this.stateManager.retrieveComponentState( "TestComponentOne" ) );
      assertEquals( 'SubStateOne', this.stateManager.retrieveComponentState( "TestComponentTwo" )['subStateOne'] );
      assertEquals( 'SubStateTwo', this.stateManager.retrieveComponentState( "TestComponentTwo" )['subStateTwo'] );
   },
   
   parseUri_transformsStringToObject : function() {
      //SETUP:
      this.stateManager.reset();
      
      //EXCERCISE:
      this.stateManager.parseUri( this.constants.URI_AS_STRING );
      
      //VERIFY:
      assertEquals( 'State-one', this.stateManager.retrieveComponentState( "TestComponentOne" ) );
      assertEquals( 'SubStateOne', this.stateManager.retrieveComponentState( "TestComponentTwo" )['subStateOne'] );
      assertEquals( 'SubStateTwo', this.stateManager.retrieveComponentState( "TestComponentTwo" )['subStateTwo'] );
   },
   
   retrieveComponentState_returnsStoredStateOfComponent : function(){
      //EXCERCISE, VERIFY:
      assertEquals( this.constants.STATE_ONE, this.stateManager.retrieveComponentState( this.constants.TEST_COMPONENT_ONE )); 
      assertEquals( this.constants.STATE_TWO, this.stateManager.retrieveComponentState( this.constants.TEST_COMPONENT_TWO )); 
   },
   
   storeComponentState_storesComponentStateObject : function(){
      //VERIFY:
      assertEquals( this.constants.STATE_ONE, this.stateManager.retrieveComponentState( this.constants.TEST_COMPONENT_ONE )); 
      assertEquals( this.constants.STATE_TWO, this.stateManager.retrieveComponentState( this.constants.TEST_COMPONENT_TWO )); 
   },
   
   toString_transformsStateObjectsToString : function(){
      assertThat( this.stateManager.toString(), this.constants.STATE_AS_STRING );
   },
   
   toUri_transformsStateObjectsToString : function(){
      assertThat( this.stateManager.toUri(), this.constants.URI_AS_STRING );
   },
   
   persist_storesStatesInBrowser : function(){
      this.stateManager.persist();
      
      assertThat( $.jStorage.get( this.stateManager.options.componentName ), equalTo( this.constants.STATE_AS_STRING ));
   },
   
   restore_retrieveStatesFromBrowser : function(){
      this.stateManager.persist();
      this.stateManager.reset();
      
      this.stateManager.restore();
      
      assertThat( this.stateManager.retrieveComponentState( this.constants.TEST_COMPONENT_ONE ), equalTo( this.constants.STATE_ONE )); 
      //assertThat( this.stateManager.retrieveComponentState( this.constants.TEST_COMPONENT_TWO ), equalTo( this.constants.STATE_TWO )); 
   },
   
   reset_setsComponentStatesToNull : function() {
      //EXCERCISE:
      this.stateManager.reset();
      
      //VERIFY:
      assertNull( "As after initialization component state is null.", this.stateManager.retrieveComponentState( this.constants.TEST_COMPONENT_ONE ));
      assertNull( "As after initialization component state null.", this.stateManager.retrieveComponentState( this.constants.TEST_COMPONENT_ONE ));
   }
});