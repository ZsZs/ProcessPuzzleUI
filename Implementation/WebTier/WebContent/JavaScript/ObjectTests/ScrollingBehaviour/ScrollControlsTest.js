window.ScrollControlsTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onScrollContent'],

   options : {
      testMethods : [
         { method : 'initialize_whenContentViewIsUndefined_ThrowsException', isAsynchron : false },
         { method : 'construct_createsScrollBarElements', isAsynchron : false },
         { method : 'construct_createsSlider', isAsynchron : false },
         { method : 'construct_whenOverHangIsPositive_scrollHandleHeightIsProportional', isAsynchron : false },
         { method : 'construct_whenOverHangIsNegative_scrollHandleHeightIsIdenticalWithSlotHeight', isAsynchron : false },
//         { method : 'upButton_onMouseDown_firesScrollContentUntilMouseUpReceived', isAsynchron : true },
         { method : 'downButton_onMouseDown_firesScrollContentUntilMouseUpReceived', isAsynchron : true },
         { method : 'destroy_destroysAllCreatedElements', isAsynchron : false }]
   },

   constants : {
      SCROLLABLE_CONTAINER_ID : 'scrollableContentContainer',
      SCROLLABLE_ELEMENT_ID : 'scrollableContent',
      VIEW_HEIGHT : '200px',
      VIEW_WIDTH : '300px'
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.contentViewElement;
      this.overHang;
      this.scrollControls;
      this.scrollableElement;
      this.step;
      this.windowFxScroll;
   },   

   beforeEachTest : function(){
      this.scrollableElement = $( this.constants.SCROLLABLE_ELEMENT_ID );
      this.instantiateContentViewElement();
      this.determineOverHang();
      this.scrollControls = new ScrollControls( this.contentViewElement, this.overHang, { onScrollContent : this.onScrollContent });
   },
   
   afterEachTest : function (){
      this.scrollControls.destroy();
      this.scrollControls = null;
      this.restoreContentElement();
   },
   
   initialize_whenContentViewIsUndefined_ThrowsException : function(){
      assertThat( this.instantiateScrollControlWithoutArguments, raises( AssertionException ));
   },
   
   construct_createsScrollBarElements : function() {
      this.scrollControls.construct();
      
      var scrollControlsElement = $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollControls.options.scrollControlsYClass )[0]; 
      assertThat( scrollControlsElement, not( nil() ));
      
      var scrollSlotElement = scrollControlsElement.getChildren( 'div.' + this.scrollControls.options.scrollSlotClass )[0];
      assertThat( scrollSlotElement, not( nil() ));
      
      var scrollHandleElement = scrollSlotElement.getChildren( 'div.' + this.scrollControls.options.scrollHandleClass )[0];
      assertThat( scrollHandleElement, not( nil() ));
      assertThat( scrollHandleElement.getChildren( 'div.' + this.scrollControls.options.scrollHandleTopClass )[0], not( nil() ));
      assertThat( scrollHandleElement.getChildren( 'div.' + this.scrollControls.options.scrollHandleBGClass )[0], not( nil() ));
      assertThat( scrollHandleElement.getChildren( 'div.' + this.scrollControls.options.scrollHandleMiddleClass )[0], not( nil() ));
      assertThat( scrollHandleElement.getChildren( 'div.' + this.scrollControls.options.scrollHandleBottomClass )[0], not( nil() ));
   },
   
   construct_createsSlider : function(){
      this.scrollControls.construct();
      
      assertThat( this.scrollControls.getSlider(), JsHamcrest.Matchers.instanceOf( Slider ));
   },
   
   construct_whenOverHangIsPositive_scrollHandleHeightIsProportional : function(){
      this.scrollControls.construct();
      
      var ratio = 1 / ( 1 + this.overHang / this.contentViewElement.getSize().y );
      var scrollSlotHeight = $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollControls.options.scrollSlotClass )[0].getSize().y;
      var expectedHeight = Math.round( ratio * scrollSlotHeight );
      
      var scrollHandleElement = $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollControls.options.scrollHandleClass )[0];
      assertThat( scrollHandleElement.getSize().y, equalTo( expectedHeight ));
   },
      
   construct_whenOverHangIsNegative_scrollHandleHeightIsIdenticalWithSlotHeight : function(){
      var originalText = this.scrollableElement.get( 'text' );
      this.scrollableElement.set( 'text', 'Short text.' );
      this.determineOverHang();
      this.scrollControls.overHang = this.overHang;
      this.scrollControls.construct();
      
      var expectedHeight = $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollControls.options.scrollSlotClass )[0].getSize().y;
      var scrollHandleElement = $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollControls.options.scrollHandleClass )[0];
      
      assertThat( scrollHandleElement.getSize().y, equalTo( expectedHeight ));

      this.scrollableElement.set( 'text', originalText );
   },
   
   upButton_onMouseDown_firesScrollContentUntilMouseUpReceived : function(){
      this.testCaseChain.chain(
         function(){ 
            this.scrollControls.construct();
            this.contentViewElement.scrollTo( 0, 20 );
            this.scrollControls.upButton.fireEvent( 'mousedown' );
         }.bind( this ),
         function(){
            assertThat( this.step, equalTo( this.scrollControls.options.increment ));
            this.scrollControls.upButton.fireEvent( 'mouseup' );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
      
   downButton_onMouseDown_firesScrollContentUntilMouseUpReceived : function(){
      this.testCaseChain.chain(
         function(){ 
            this.scrollControls.construct();
            this.contentViewElement.scrollTo( 0, '20px' );
            this.scrollControls.downButton.fireEvent( 'mousedown' );
         }.bind( this ),
         function(){
            assertThat( this.step, equalTo( this.scrollControls.options.increment ));
            this.scrollControls.upButton.fireEvent( 'mouseup' );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
      
   destroy_destroysAllCreatedElements : function() {
      this.scrollControls.construct();
      this.scrollControls.destroy();
      
      assertThat( $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollControls.options.scrollBarClass ).length, equalTo( 0 ));
      assertThat( $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollControls.options.paddingElementClass ).length, equalTo( 0 ));
      assertThat( $( this.constants.SCROLLABLE_CONTAINER_ID ).getElements( 'div.' + this.scrollControls.options.contentViewElementClass ).length, equalTo( 0 ));
   },
   
   //Protected, private helper methods
   determineOverHang : function(){
      this.overHang = this.scrollableElement.getSize().y - this.contentViewElement.getSize().y;
   }.protect(),
   
   instantiateContentViewElement : function(){
      this.contentViewElement = new Element( 'div', { styles : { height: this.constants.VIEW_HEIGHT, width: this.constants.VIEW_WIDTH }});
      this.contentViewElement.wraps( this.scrollableElement );
      this.scrollableElement.setStyles({ height: 'auto', width: 'auto' });
   }.protect(),
   
   instantiateScrollControlWithoutArguments : function(){
      new ScrollControls();
   },
   
   onScrollContent : function( step ){
      this.step = step;
      this.testCaseChain.callChain();
   },
   
   restoreContentElement : function(){
      if( this.contentViewElement ){
         this.scrollableElement.dispose();
         this.scrollableElement.inject( this.contentViewElement, 'before' );
         
         this.contentViewElement.destroy();
         this.contentViewElement = null;
      }
      
   }.protect(),
   
});