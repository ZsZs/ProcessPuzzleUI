window.MediaPlayerThumbnailTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['checkMorphReady', 'onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'initialize_whenContainerElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'construct_createsElements', isAsynchron : true },
//         { method : 'construct_createsListElement', isAsynchron : false },
//         { method : 'construct_instantiatesSlideThumbnails', isAsynchron : false },
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
            assertThat( this.containerElement.getElement( 'li a' ), JsHamcrest.Matchers.instanceOf( Element ));
            assertThat( this.containerElement.getElement( 'li a img' ), JsHamcrest.Matchers.instanceOf( Element ));
               
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_createsListElement : function() {
      this.thumbnail.construct();
      
      assertThat( this.containerElement.getElement( 'div.' + this.thumbnail.getElementClass() + ' ul' ), equalTo( this.thumbnail.getListElement() ));
   },
   
   construct_instantiatesSlideThumbnails : function() {
      this.thumbnail.construct();
      
      assertThat( this.thumbnail.getSlideThumbnails().size(), equalTo( this.thummnailImage.length ));
   },
   
   update_whenTextIsValid_appliesVisibleClass : function(){
      this.thumbnail.construct();
      this.thumbnail.update( this.constants.CAPTION_TEXT, this.constants.FAST_TRANSITION );
      
      assertThat( this.thumbnail.getCaptionElement().get( 'text' ), equalTo( this.constants.CAPTION_TEXT ));
      assertThat( this.thumbnail.getCaptionElement().hasClass( this.thumbnail.getVisibleClass() ), is( true ));
      assertThat( this.thumbnail.getCaptionElement().hasClass( this.thumbnail.getHiddenClass() ), is( false ));
   },
   
   update_whenTextIsValidAndSmoothTransition_appliesMorph : function(){
      this.testCaseChain.chain(
         function(){
            this.thumbnail.construct();
            this.thumbnail.update( this.constants.CAPTION_TEXT, this.constants.SMOOTH_TRANSITION );
            
            this.timer = this.checkMorphReady.periodical( 500 );
         }.bind( this ),
         function(){
            assertThat( this.thumbnail.morph, not( nil() ));
            assertThat( this.thumbnail.getCaptionElement().get( 'text' ), equalTo( this.constants.CAPTION_TEXT ));
            assertThat( this.thumbnail.getCaptionElement().getStyles( 'height', 'opacity' ), hasMember( 'height' ));
            assertThat( this.thumbnail.getCaptionElement().getStyles( 'height', 'opacity' ), hasMember( 'opacity' ));
            assertThat( this.thumbnail.getCaptionElement().hasClass( this.thumbnail.getHiddenClass() ), is( false ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   update_whenTextIsEmpty_appliesHiddenClass : function(){
      this.thumbnail.construct();
      this.thumbnail.update( "", this.constants.FAST_TRANSITION );
      
      assertThat( this.thumbnail.getCaptionElement().get( 'text' ), equalTo( "" ));
      assertThat( this.thumbnail.getCaptionElement().hasClass( this.thumbnail.getHiddenClass() ), is( true ));
      assertThat( this.thumbnail.getCaptionElement().hasClass( this.thumbnail.getVisibleClass() ), is( false ));
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
   }
   
});