window.MediaPlayerThumbnailTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['checkMorphReady', 'onConstructed', 'onDestroyed', 'onUpdated'],

   options : {
      testMethods : [
         { method : 'initialize_whenContainerElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'construct_createsElements', isAsynchron : true },
         { method : 'update_startsMorph', isAsynchron : true },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : true }],
   },

   constants : {
      CAPTION_TEXT : "Hellow world!",
      CONTAINER_ELEMENT_ID : "widgetContainer",
      FAST_TRANSITION : true,
      IMAGE_FOLDER: '../MediaPlayerWidget/Album/', 
      SLIDESHOW_CLASS : "slideshow",
      SMOOTH_TRANSITION : false,
      THUMBNAIL_IMAGE_URI : 'IMAG0337_thumb.jpg',
      THUMBNAILS_CLASS : "thumbnails"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.containerElement;
      this.thummnailImage = new Array();
      this.thumbnail;
      this.timer;
   },   

   beforeEachTest : function(){
      this.containerElement = $( this.constants.CONTAINER_ELEMENT_ID );
      this.thumbnail = new MediaPlayerThumbnail( this.containerElement, this.constants.IMAGE_FOLDER + this.constants.THUMBNAIL_IMAGE_URI, 0, { 
         onConstructed : this.onConstructed,
         onDestroyed : this.onDestroyed,
         onUpdated : this.onUpdated,
         slideShowClass : this.constants.SLIDESHOW_CLASS,
         thumbnailsClass : this.constants.THUMBNAILS_CLASS,
      });
   },
   
   afterEachTest : function (){
      this.thumbnail.destroy();
      this.thummnailImage.empty();
   },
   
   initialize_whenContainerElementIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new MediaPlayerThumbnailsBar(); }, raises( AssertionException ));
   },
   
   construct_createsElements : function() {
      this.testCaseChain.chain(
         function(){
            this.thumbnail.construct();
         }.bind( this ),
         function(){
            assertThat( this.containerElement.getElement( 'li' ), equalTo( this.thumbnail.getElement() ));
            assertThat( instanceOf( this.containerElement.getElement( 'li a' ), Element ), is( true ));
            assertThat( instanceOf( this.containerElement.getElement( 'li a img' ), Element ), is( true ));
               
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   update_startsMorph : function() {
      this.testCaseChain.chain(
         function(){ this.thumbnail.construct(); }.bind( this ),
         function(){ 
            this.thumbnail.update( true ); 
         }.bind( this ),
         function(){
            assertThat( this.thumbnail.getAnchorElement().getStyle( 'opacity' ), equalTo( 1 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function(){
      this.testCaseChain.chain(
         function(){
            this.thumbnail.construct();
         }.bind( this ),
         function(){
            this.thumbnail.destroy();
            assertThat( this.containerElement.getElements( '*' ).length, equalTo( 0 ));
                  
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   //Protected, private helper methods
   checkMorphReady : function(){
      if( !this.thumbnail.morph.isRunning() ){
         clearInterval( this.timer );
         this.testCaseChain.callChain();
      }
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onConstructionError : function(){
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function(){
      this.testCaseChain.callChain();
   },
   
   onUpdated : function(){
      this.testCaseChain.callChain();
   }
});