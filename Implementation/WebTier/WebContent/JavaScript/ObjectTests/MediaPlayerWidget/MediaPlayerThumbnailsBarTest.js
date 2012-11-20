window.MediaPlayerThumbnailsTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['checkMorphReady', 'onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
         { method : 'initialize_whenContainerElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'construct_createsWrapperElement', isAsynchron : true },
         { method : 'construct_createsListElement', isAsynchron : true },
         { method : 'construct_instantiatesSlideThumbnails', isAsynchron : true },
         { method : 'scroll_centersGivenThumbnail', isAsynchron : true },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : true }],
   },

   constants : {
      CAPTION_TEXT : "Hellow world!",
      CONTAINER_ELEMENT_ID : "widgetContainer",
      FAST_TRANSITION : true,
      IMAGE_FOLDER: '../MediaPlayerWidget/Album/', 
      SLIDESHOW_CLASS : "slideshow",
      SMOOTH_TRANSITION : false,
      THUMBNAIL_IMAGES : ['IMAG0337_thumb.jpg', 'IMAG0339_thumb.jpg', 'SANY0008_thumb.JPG', 'SANY0012_thumb.JPG', 'SANY0022_thumb.JPG'],
      THUMBNAILS_CLASS : "thumbnails"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.containerElement;
      this.thummnailImages = new Array();
      this.thumbnails;
      this.timer;
   },   

   beforeEachTest : function(){
      this.containerElement = $( this.constants.CONTAINER_ELEMENT_ID );
      this.constants.THUMBNAIL_IMAGES.each( function( thumbnailUri, index ){ this.thummnailImages.push( this.constants.IMAGE_FOLDER + thumbnailUri ); }.bind( this ));
      this.thumbnails = new MediaPlayerThumbnailsBar( this.containerElement, this.thummnailImages, { 
         onConstructed : this.onConstructed,
         onConstructionError : this.onConstructionError,
         slideShowClass : this.constants.SLIDESHOW_CLASS,
         thumbnailsClass : this.constants.THUMBNAILS_CLASS
      });
   },
   
   afterEachTest : function (){
      this.thumbnails.destroy();
      this.thummnailImages.empty();
   },
   
   initialize_whenContainerElementIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new MediaPlayerThumbnailsBar(); }, raises( AssertionException ));
   },
   
   construct_createsWrapperElement : function() {
      this.testCaseChain.chain(
         function(){ this.thumbnails.construct(); }.bind( this ),
         function(){
            assertThat( this.containerElement.getElement( 'div.' + this.thumbnails.getElementClass() ), equalTo( this.thumbnails.getElement() ));
            assertThat( this.thumbnails.getElement(), JsHamcrest.Matchers.instanceOf( Element ));
            assertThat( this.thumbnails.getElement().hasClass( this.constants.SLIDESHOW_CLASS + "-" + this.constants.THUMBNAILS_CLASS ), is( true ));
                  
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_createsListElement : function() {
      this.testCaseChain.chain(
         function(){ this.thumbnails.construct(); }.bind( this ),
         function(){
            assertThat( this.containerElement.getElement( 'div.' + this.thumbnails.getElementClass() + ' ul' ), equalTo( this.thumbnails.getListElement() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_instantiatesSlideThumbnails : function() {
      this.testCaseChain.chain(
         function(){ this.thumbnails.construct(); }.bind( this ),
         function(){
            assertThat( this.thumbnails.getSlideThumbnails().size(), equalTo( this.thummnailImages.length ));

            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   scroll_centersGivenThumbnail : function(){
      this.testCaseChain.chain(
         function(){ this.thumbnails.construct(); }.bind( this ),
         function(){
            this.thumbnails.scroll( 3 );
      
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function(){
      this.testCaseChain.chain(
         function(){ this.thumbnails.construct(); }.bind( this ),
         function(){
            this.thumbnails.destroy();
      
            assertThat( this.containerElement.getElements( '*' ).length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   //Protected, private helper methods
   checkMorphReady : function(){
      if( !this.thumbnails.morph.isRunning() ){
         clearInterval( this.timer );
         this.testCaseChain.callChain();
      }
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onConstructionError : function(){
      this.testCaseChain.callChain();
   }   

});