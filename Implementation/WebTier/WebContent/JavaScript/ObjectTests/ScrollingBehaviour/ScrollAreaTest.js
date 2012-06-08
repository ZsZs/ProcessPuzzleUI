window.ScrollAreaTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialize_whenScrollableElementNotDefined_throwsExeption', isAsynchron : false },
         { method : 'construct_whenContentSizeIsGiven_setsContentViewSize', isAsynchron : false },
         { method : 'construct_whenContentSizeIsNotGiven_usesScrollableElementSize', isAsynchron : false },
         { method : 'construct_adjustsScrollableElementSize', isAsynchron : false },
         { method : 'construct_wrapsContentElementWithPaddingElement', isAsynchron : false },
         { method : 'construct_wrapsContentElementWithContentViewElement', isAsynchron : false },
         { method : 'construct_createsScrollControlElements', isAsynchron : false },
         { method : 'refresh_whenContentIsLess_turnsScrollControlToOpaque', isAsynchron : false },
         { method : 'refresh_whenContentBecomeLarge_recreatesScrollControl', isAsynchron : false },
         { method : 'refresh_whenContentSizeIsGiven_setsContentViewSize', isAsynchron : false },
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
   
   construct_whenContentSizeIsGiven_setsContentViewSize : function() {
      this.scrollArea.options.contentHeight = '250';
      this.scrollArea.options.contentWidth = '450';
      
      this.scrollArea.construct();

      assertThat( this.scrollArea.getContentViewElement().getStyle( 'height' ), equalTo( this.scrollArea.options.contentHeight + "px" ));
      assertThat( this.scrollArea.getContentViewElement().getStyle( 'width' ), equalTo( this.scrollArea.options.contentWidth + "px" ));
   },
   
   construct_whenContentSizeIsNotGiven_usesScrollableElementSize : function() {
      var scrollableElementHeight = this.scrollableElement.getStyle( 'height' ); 
      var scrollableElementWidth = this.scrollableElement.getStyle( 'width' ); 
      
      this.scrollArea.construct();

      assertThat( this.scrollArea.getContentViewElement().getStyle( 'height' ), equalTo( scrollableElementHeight ));
      assertThat( this.scrollArea.getContentViewElement().getStyle( 'width' ), equalTo( scrollableElementWidth ));
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
   
   construct_createsScrollControlElements : function() {
      this.scrollArea.construct();
      
      assertThat( this.scrollArea.scrollControls, JsHamcrest.Matchers.instanceOf( ScrollControls ));
      assertThat( $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollArea.scrollControls.options.scrollControlsYClass ).length, equalTo( 1 ));
   },
   
   refresh_whenContentIsLess_turnsScrollControlToOpaque : function() {
      var originalText = this.scrollableElement.get( 'text' ); 
      this.scrollArea.construct();
      this.scrollableElement.set( 'text', "Very short text" );
      this.scrollArea.refresh();
      
      assertThat( $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollArea.scrollControls.options.scrollControlsYClass )[0].getStyle( 'opacity' ), equalTo( this.scrollArea.scrollControls.options.disabledOpacity ));
      assertThat( this.scrollArea.getContentWrapperElement().getStyle( 'margin-right' ), equalTo( '0px' ));
      
      //TEAR DOWN:
      this.scrollableElement.set( 'text', originalText );
   },
   
   refresh_whenContentBecomeLarge_recreatesScrollControl : function() {
      var originalText = this.scrollableElement.get( 'text' ); 
      this.scrollArea.construct();
      this.scrollableElement.set( 'text', "Very short text" );
      this.scrollArea.refresh();
      this.scrollableElement.set( 'text', originalText );
      this.scrollArea.refresh();
      
      assertThat( $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollArea.scrollControls.options.scrollControlsYClass ).length, equalTo( 1 ));
      assertThat( $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollArea.scrollControls.options.scrollControlsYClass )[0].getStyle( 'opacity' ), equalTo( 1 ));
      assertThat( this.scrollArea.getContentWrapperElement().getStyle( 'margin-right' ), equalTo( '15px' ));
   },
      
   refresh_whenContentSizeIsGiven_setsContentViewSize : function() {
      this.scrollArea.construct();
      this.scrollArea.refresh({ x: 450, y: 250 });

      assertThat( this.scrollArea.getContentViewElement().getStyle( 'height' ), equalTo( "250px" ));
      assertThat( this.scrollArea.getContentViewElement().getStyle( 'width' ), equalTo( "450px" ));
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