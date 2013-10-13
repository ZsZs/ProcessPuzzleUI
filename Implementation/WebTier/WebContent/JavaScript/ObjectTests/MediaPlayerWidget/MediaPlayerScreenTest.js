window.ScreenTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError', 'onDestroyed', 'onUpdated'],

   options : {
      isAfterEachTestAsynchron : true,
      testMethods : [
         { method : 'initialize_whenContainerElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'construct_createsScreenElement', isAsynchron : true },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : true }],
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
      this.screen = new MediaPlayerScreen( this.containerElement, { 
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError, 
         onDestroyed : this.onDestroyed,
         onUpdated : this.onUpdated,
         screenClass : this.constants.SCREEN_CLASS, 
         slideShowClass : this.constants.SLIDESHOW_CLASS });
   },
   
   afterEachTest : function (){
      this.afterEachTestChain.chain(
         function(){
            if( this.screen.isConstructed() ) this.screen.destroy();
            else this.afterEachTestChain.callChain();
         }.bind( this ),
         function(){
            assertThat( this.containerElement.getElements( '*' ).length, equalTo( 0 ));
            this.screen = null;
            this.afterEachTestReady();
         }.bind( this )
      ).callChain();
   },
   
   initialize_whenContainerElementIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new MediaPlayerScreen(); }, raises( AssertionException ));
   },
   
   construct_createsScreenElement : function(){
      this.testCaseChain.chain(
         function(){
            this.screen.construct();
         }.bind( this ),
         function(){
            assertThat( this.containerElement.getElement( '.' + this.screen.getElementClass() ), equalTo( this.screen.getElement() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function(){
      this.testCaseChain.chain(
         function(){
            this.screen.construct();
         }.bind( this ),
         function(){
            // See: afterEachTests()
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   //Protected, private helper methods
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onConstructionError : function( error ){
      this.error = error;
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function( error ){
      this.afterEachTestChain.callChain();
   },

   onUpdated : function(){
      this.testCaseChain.callChain();
   }

});