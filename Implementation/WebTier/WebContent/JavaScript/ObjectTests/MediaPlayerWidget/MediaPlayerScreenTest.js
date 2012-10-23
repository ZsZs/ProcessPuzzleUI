window.ScreenTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['checkMorphReady', 'onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialize_whenContainerElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'construct_createsScreenElement', isAsynchron : false },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : false }],
   },

   constants : {
      CONTAINER_ELEMENT_ID : "widgetContainer",
      SCREEN_CLASS : "",
      SLIDESHOW_CLASS : "slideshow"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.containerElement;
      this.screen;
      this.timer;
   },   

   beforeEachTest : function(){
      this.containerElement = $( this.constants.CONTAINER_ELEMENT_ID );
      this.screen = new MediaPlayerScreen( this.containerElement, { screenClass : this.constants.SCREEN_CLASS, slideShowClass : this.constants.SLIDESHOW_CLASS } );
   },
   
   afterEachTest : function (){
      this.screen.destroy();
   },
   
   initialize_whenContainerElementIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new MediaPlayerScreen(); }, raises( AssertionException ));
   },
   
   construct_createsScreenElement : function(){
      this.screen.construct();
      
      assertThat( this.containerElement.getElement( '.' + this.screen.getElementClass() ), equalTo( this.screen.getElement() ));
   },
   
   destroy_removesAllCreatedElements : function(){
      this.screen.construct();
      this.screen.destroy();
      
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