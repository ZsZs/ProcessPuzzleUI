window.SlideTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['checkMorphReady', 'onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialize_whenContainerElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'construct_createsDomElements', isAsynchron : false },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : false }],
   },

   constants : {
      CONTAINER_ELEMENT_ID : "SlideShowContainer",
      SCREEN_CLASS : "",
      SLIDESHOW_CLASS : "slideshow"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.containerElement;
      this.slide;
      this.timer;
   },   

   beforeEachTest : function(){
      this.containerElement = $( this.constants.CONTAINER_ELEMENT_ID );
      this.slide = new Slide( this.containerElement, { slideShowClass : this.constants.SLIDESHOW_CLASS } );
   },
   
   afterEachTest : function (){
      this.slide.destroy();
   },
   
   initialize_whenContainerElementIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new Screen(); }, raises( AssertionException ));
   },
   
   construct_createsDomElements : function(){
      this.slide.construct();
      
      assertThat( this.containerElement.getElement( 'a' ), equalTo( this.slide.getElement() ));
      assertThat( this.containerElement.getElement( 'a img' ), equalTo( this.slide.getImageElement() ));
      assertThat( this.slide.getImageElement().getStyle( 'display' ), equalTo( 'none' ));
   },
   
   destroy_removesAllCreatedElements : function(){
      this.slide.construct();
      this.slide.destroy();
      
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