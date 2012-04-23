window.ScrollAreaTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialize_whenScrollableElementNotDefined_throwsExeption', isAsynchron : false },
         { method : 'construct_adjustsScrollableElementSize', isAsynchron : false },
         { method : 'construct_wrapsContentElementWithPaddingElement', isAsynchron : false },
         { method : 'construct_wrapsContentElementWithContentViewElement', isAsynchron : false },
         { method : 'construct_createsScrollBarElements', isAsynchron : false },
         { method : 'destroy_destroysAllCreatedElements', isAsynchron : false }]
   },

   constants : {
      SCROLLABLE_CONTAINER_ID : 'scrollableContentContainer',
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
      this.scrollArea = null;
   },
   
   initialize_whenScrollableElementNotDefined_throwsExeption : function() {
      assertThat( this.instantiateScrollAreaWithoutArguments, raises( JsUnit.Failure ));
   },
   
   construct_adjustsScrollableElementSize : function() {
      this.scrollArea.construct();

      if( Browser.ie ){
         assertThat( this.scrollableElement.style.height, equalTo( '100%' ));
         assertThat( this.scrollableElement.style.width, equalTo( '100%' ));         
      }else{
         assertThat( this.scrollableElement.getStyle( 'height' ), equalTo( '100%' ));
         assertThat( this.scrollableElement.getStyle( 'width' ), equalTo( '100%' ));
      }
      assertThat( this.scrollableElement.getStyle( 'margin' ), equalTo( '0px' ));
      assertThat( this.scrollableElement.getStyle( 'padding' ), equalTo( '0px' ));
   },
   
   construct_wrapsContentElementWithPaddingElement : function(){
      assumeThat( this.scrollableElement.getParent(), equalTo( $( this.constants.SCROLLABLE_CONTAINER_ID )));
      this.scrollArea.construct();
      
      assertThat( this.scrollableElement.getParent( "." + this.scrollArea.options.paddingElementClass ), not( nil() ));
   },
      
   construct_wrapsContentElementWithContentViewElement : function() {
      assumeThat( this.scrollableElement.getParent(), equalTo( $( this.constants.SCROLLABLE_CONTAINER_ID )));
      this.scrollArea.construct();
      
      assertThat( this.scrollableElement.getParent( "." + this.scrollArea.options.contentViewElementClass ), not( nil() ));
   },
   
   construct_createsScrollBarElements : function() {
      this.scrollArea.construct();
      
      assertThat( $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollArea.options.scrollBarClass ).length, equalTo( 1 ));
   },
      
   destroy_destroysAllCreatedElements : function() {
      this.scrollArea.construct();
      this.scrollArea.destroy();
      
      assertThat( $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollArea.options.scrollBarClass ).length, equalTo( 0 ));
      assertThat( $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollArea.options.paddingElementClass ).length, equalTo( 0 ));
      assertThat( $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollArea.options.contentViewElementClass ).length, equalTo( 0 ));
   },
   
   //Protected, private helper methods
   instantiateScrollAreaWithoutArguments : function(){
      new ScrollArea();
   }

});