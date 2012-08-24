window.SlideshowControllerTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['checkMorphReady', 'onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialize_instantiatesShortCutKeys', isAsynchron : false },
         { method : 'initialize_whenContainerElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'construct_createControllerElements', isAsynchron : false },
         { method : 'construct_constructsButtons', isAsynchron : false },
         { method : 'show_hide_morphsOpacity', isAsynchron : true },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : false }]
   },

   constants : {
      CONTAINER_ELEMENT_ID : "SlideShowContainer",
      CONTROLLER_CLASS : "controller",
      SLIDESHOW_CLASS : "slideshow"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.containerElement;
      this.controller;
      this.screen;
      this.timer;
   },   

   beforeEachTest : function(){
      this.containerElement = $( this.constants.CONTAINER_ELEMENT_ID );
      this.screen = new Screen( this.containerElement, { slideShowClass : this.constants.SLIDESHOW_CLASS } );
      this.controller = new SlideshowController( this.containerElement, this.screen, { captionClass : this.constants.CONTROLLER_CLASS, slideShowClass : this.constants.SLIDESHOW_CLASS } );
   },
   
   afterEachTest : function (){
      this.controller.destroy();
   },
   
   initialize_instantiatesShortCutKeys : function(){
      assertThat( this.controller.getShortCutKeys().length, equalTo( Object.getLength( this.controller.options.accessKeys )));
   },
   
   initialize_whenContainerElementIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new SlideshowController(); }, raises( AssertionException ));
   },
   
   construct_createControllerElements : function(){
      this.controller.construct();
      
      assertThat( this.containerElement.getElement( '.' + this.controller.getControllerClass() ), equalTo( this.controller.getWrapperElement() ));
   },
   
   construct_constructsButtons : function(){
      this.controller.construct();
      
      assertThat( this.controller.getFirstButton(), JsHamcrest.Matchers.instanceOf( FirstSlideButton ));
   },
   
   show_hide_morphsOpacity : function() {
      this.testCaseChain.chain(
         function(){
            this.controller.construct();
            assumeThat( this.controller.isVisible(), is( true ));
            this.controller.hide();
            this.timer = this.checkMorphReady.periodical( 500 );
         }.bind( this ),
         function(){
            assumeThat( this.controller.isVisible(), is( false ));
            assumeThat( this.controller.getWrapperElement().getStyle( 'opacity' ), equalTo( 0 ));
            this.controller.show();
            this.timer = this.checkMorphReady.periodical( 500 );
         }.bind( this ),
         function(){
            assertThat( this.controller.morph, not( nil() ));
            assumeThat( this.controller.getWrapperElement().getStyle( 'opacity' ), equalTo( 1 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function(){
      this.controller.construct();
      this.controller.destroy();
      
      assertThat( this.containerElement.getElements( '*' ).length, equalTo( 0 ));
   },
   
   //Protected, private helper methods
   checkMorphReady : function(){
      if( !this.controller.morph.isRunning() ){
         clearInterval( this.timer );
         this.testCaseChain.callChain();
      }
   },
   
   onSuccess : function(){
      this.testCaseChain.callChain();
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   }

});