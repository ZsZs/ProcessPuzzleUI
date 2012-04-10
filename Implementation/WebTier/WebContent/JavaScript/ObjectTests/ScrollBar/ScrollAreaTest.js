window.ScrollAreaTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialize_whenScrollableElementNotDefined_throwsExeption', isAsynchron : false },
         { method : 'construct_adjustsScrollableElementSize', isAsynchron : false },
         { method : 'construct_createsScrollBarElements', isAsynchron : false }]
   },

   constants : {
      SCROLLABLE_ELEMENT_ID : 'scrollableContent'
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.scrollArea;
      this.scrollableElement;
      this.windowFxScroll;
   },   

   beforeEachTest : function(){
      this.scrollableElement = $( this.constants.SCROLLABLE_ELEMENT_ID );
      this.windowFxScroll = new Fx.Scroll( document.window, { wait : false });
      this.scrollArea = new ScrollArea( this.scrollableElement, this.windowFxScroll, {} );
   },
   
   afterEachTest : function (){
      this.scrollArea.destroy();
   },
   
   initialize_whenScrollableElementNotDefined_throwsExeption : function() {
      assertThat( this.instantiateScrollAreaWithoutArguments, raises( JsUnit.Failure ));
   },
   
   construct_adjustsScrollableElementSize : function() {
      this.scrollArea.construct();
      
      assertThat( this.scrollableElement.getStyle( 'overflow-x' ), equalTo( 'hidden' ));
      assertThat( this.scrollableElement.getStyle( 'overflow-y' ), equalTo( 'hidden' ));
      assertThat( this.scrollableElement.getStyle( 'padding' ), equalTo( '0px' ));
   },
      
   construct_createsScrollBarElements : function() {
      this.scrollArea.construct();
      
      assertThat( this.scrollableElement.getChildren( 'div.' + this.scrollArea.options.contentElementClass ).length, equalTo( 1 ));
      assertThat( this.scrollableElement.getElements( 'div.' + this.scrollArea.options.paddingElementClass ).length, equalTo( 1 ));
   },
      
   //Protected, private helper methods
   instantiateScrollAreaWithoutArguments : function(){
      new ScrollArea();
   }

});