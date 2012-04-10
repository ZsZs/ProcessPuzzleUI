window.ScrollBarTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialize_identifiesTheScrollableElement', isAsynchron : false },
         { method : 'initialize_whenElementNotFound_throwsExeption', isAsynchron : false },
         { method : 'construct_instantiatesScrollArea', isAsynchron : false },
         { method : 'destroy_invokesScrollAreaDestroy', isAsynchron : false }]
   },

   constants : {
      SCROLLABLE_ELEMENT_ID : 'scrollableContent'
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.scrollBar;
   },   

   beforeEachTest : function(){
      this.scrollBar = new ScrollBar( this.constants.SCROLLABLE_ELEMENT_ID, {});
   },
   
   afterEachTest : function (){
   },
   
   initialize_identifiesTheScrollableElement : function() {
      assertThat( this.scrollBar.getScrollableElement(), equalTo( $( this.constants.SCROLLABLE_ELEMENT_ID )));
   },
   
   initialize_whenElementNotFound_throwsExeption : function() {
      assertThat( this.instantiateScrollBarWithoutArguments, raises( NoneExistingScrollableElementException ));
   },
      
   construct_instantiatesScrollArea : function() {
      this.scrollBar.construct();
      
      assertThat( this.scrollBar.getScrollArea(), JsHamcrest.Matchers.instanceOf( ScrollArea ));
   },
      
   destroy_invokesScrollAreaDestroy : function() {
      this.scrollBar.construct();
      
      this.scrollBar.getScrollArea().destroy = spy( this.scrollBar.getScrollArea().destroy );
      this.scrollBar.destroy();
      
      verify( this.scrollBar.getScrollArea().destroy )();
   },
      
   //Protected, private helper methods
   instantiateScrollBarWithoutArguments : function(){
      new ScrollBar();
   }

});