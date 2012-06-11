window.ScrollingBehaviourTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialize_identifiesTheScrollableElement', isAsynchron : false },
         { method : 'initialize_whenElementNotFound_throwsExeption', isAsynchron : false },
         { method : 'construct_createsScrollingBehaviourElements', isAsynchron : false },
         { method : 'destroy_invokesScrollAreaDestroy', isAsynchron : false },
         { method : 'destroy_destroysAllCreatedElements', isAsynchron : false }]
   },

   constants : {
      SCROLLABLE_CONTAINER_ID : 'scrollableContentContainer',
      SCROLLABLE_ELEMENT_ID : 'scrollableContent'
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.scrollingBehaviour;
   },   

   beforeEachTest : function(){
      this.scrollingBehaviour = new ScrollingBehaviour( this.constants.SCROLLABLE_ELEMENT_ID, {});
   },
   
   afterEachTest : function (){
      this.scrollingBehaviour.destroy();
      this.scrollingBehaviour = null;
   },
   
   initialize_identifiesTheScrollableElement : function() {
      assertThat( this.scrollingBehaviour.getScrollableElement(), equalTo( $( this.constants.SCROLLABLE_ELEMENT_ID )));
   },
   
   initialize_whenElementNotFound_throwsExeption : function() {
      assertThat( this.instantiateScrollBarWithoutArguments, raises( NoneExistingScrollableElementException ));
   },
      
   construct_createsScrollingBehaviourElements : function() {
      this.scrollingBehaviour.construct();
      
      assertThat( this.scrollingBehaviour.getScrollArea(), JsHamcrest.Matchers.instanceOf( ScrollArea ));
      assertThat( this.contentViewElementExist(), is( true ));
      assertThat( this.paddingElementExist(), is( true ));
      assertThat( this.scrollControlsElementExist(), is( true ));
   },
      
   destroy_invokesScrollAreaDestroy : function() {
      this.scrollingBehaviour.construct();
      
      var scrollAreaDestroyMethod = this.scrollingBehaviour.getScrollArea().destroy;
      this.scrollingBehaviour.getScrollArea().destroy = spy( this.scrollingBehaviour.getScrollArea().destroy );
      this.scrollingBehaviour.destroy();
      
      verify( this.scrollingBehaviour.getScrollArea().destroy )();
      this.scrollingBehaviour.getScrollArea().destroy = scrollAreaDestroyMethod; 
   },
      
   destroy_destroysAllCreatedElements : function() {
      this.scrollingBehaviour.construct();
      this.scrollingBehaviour.destroy();
      
      assertThat( this.contentViewElementExist(), is( false ));
      assertThat( this.paddingElementExist(), is( false ));
      assertThat( this.scrollControlsElementExist(), is( false ));
   },
   
   //Protected, private helper methods
   contentViewElementExist : function(){
      return $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollingBehaviour.scrollArea.options.contentViewElementClass ).length == 1;
   }.protect(),
   
   instantiateScrollBarWithoutArguments : function(){
      new ScrollingBehaviour();
   },
   
   paddingElementExist : function(){
      return $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollingBehaviour.scrollArea.options.paddingElementClass ).length == 1;
   }.protect(),
   
   scrollControlsElementExist : function(){
      return $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollingBehaviour.scrollArea.scrollControls.options.scrollControlsYClass ).length == 1;
   }.protect()

});