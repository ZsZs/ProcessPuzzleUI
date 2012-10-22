window.SlidesThumbnailsTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['checkMorphReady', 'onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialize_whenContainerElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'construct_createsWrapperElement', isAsynchron : false },
         { method : 'construct_createsListElement', isAsynchron : false },
         { method : 'construct_instantiatesSlideThumbnails', isAsynchron : false },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : false }],
   },

   constants : {
      CAPTION_TEXT : "Hellow world!",
      CONTAINER_ELEMENT_ID : "SlideShowContainer",
      FAST_TRANSITION : true,
      IMAGE_FORDER: '../PhotoGaleryWidget/Album/', 
      SLIDESHOW_CLASS : "slideshow",
      SMOOTH_TRANSITION : false,
      THUMBNAIL_IMAGES : ['IMAG0337_thumb.jpg', 'IMAG0339_thumb.jpg', 'SANY0008_thumb.JPG', 'SANY0012_thumb.JPG'],
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
      this.constants.THUMBNAIL_IMAGES.each( function( thumbnailUri, index ){ this.thummnailImages.push( this.constants.IMAGE_FORDER + thumbnailUri ); }.bind( this ));
      this.thumbnails = new SlidesThumbnails( this.containerElement, this.thummnailImages, { 
         thumbnailsClass : this.constants.THUMBNAILS_CLASS,
         slideShowClass : this.constants.SLIDESHOW_CLASS });
   },
   
   afterEachTest : function (){
      this.thumbnails.destroy();
      this.thummnailImages.empty();
   },
   
   initialize_whenContainerElementIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new SlideCaption(); }, raises( AssertionException ));
   },
   
   construct_createsWrapperElement : function() {
      this.thumbnails.construct();
      
      assertThat( this.containerElement.getElement( 'div.' + this.thumbnails.getElementClass() ), equalTo( this.thumbnails.getElement() ));
      assertThat( this.thumbnails.getElement(), JsHamcrest.Matchers.instanceOf( Element ));
      assertThat( this.thumbnails.getElement().hasClass( this.constants.SLIDESHOW_CLASS + "-" + this.constants.THUMBNAILS_CLASS ), is( true ));
   },
   
   construct_createsListElement : function() {
      this.thumbnails.construct();
      
      assertThat( this.containerElement.getElement( 'div.' + this.thumbnails.getElementClass() + ' ul' ), equalTo( this.thumbnails.getListElement() ));
   },
   
   construct_instantiatesSlideThumbnails : function() {
      this.thumbnails.construct();
      
      assertThat( this.thumbnails.getSlideThumbnails().size(), equalTo( this.thummnailImages.length ));
   },
   
   update_whenTextIsValid_appliesVisibleClass : function(){
      this.thumbnails.construct();
      this.thumbnails.update( this.constants.CAPTION_TEXT, this.constants.FAST_TRANSITION );
      
      assertThat( this.thumbnails.getCaptionElement().get( 'text' ), equalTo( this.constants.CAPTION_TEXT ));
      assertThat( this.thumbnails.getCaptionElement().hasClass( this.thumbnails.getVisibleClass() ), is( true ));
      assertThat( this.thumbnails.getCaptionElement().hasClass( this.thumbnails.getHiddenClass() ), is( false ));
   },
   
   update_whenTextIsValidAndSmoothTransition_appliesMorph : function(){
      this.testCaseChain.chain(
         function(){
            this.thumbnails.construct();
            this.thumbnails.update( this.constants.CAPTION_TEXT, this.constants.SMOOTH_TRANSITION );
            
            this.timer = this.checkMorphReady.periodical( 500 );
         }.bind( this ),
         function(){
            assertThat( this.thumbnails.morph, not( nil() ));
            assertThat( this.thumbnails.getCaptionElement().get( 'text' ), equalTo( this.constants.CAPTION_TEXT ));
            assertThat( this.thumbnails.getCaptionElement().getStyles( 'height', 'opacity' ), hasMember( 'height' ));
            assertThat( this.thumbnails.getCaptionElement().getStyles( 'height', 'opacity' ), hasMember( 'opacity' ));
            assertThat( this.thumbnails.getCaptionElement().hasClass( this.thumbnails.getHiddenClass() ), is( false ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   update_whenTextIsEmpty_appliesHiddenClass : function(){
      this.thumbnails.construct();
      this.thumbnails.update( "", this.constants.FAST_TRANSITION );
      
      assertThat( this.thumbnails.getCaptionElement().get( 'text' ), equalTo( "" ));
      assertThat( this.thumbnails.getCaptionElement().hasClass( this.thumbnails.getHiddenClass() ), is( true ));
      assertThat( this.thumbnails.getCaptionElement().hasClass( this.thumbnails.getVisibleClass() ), is( false ));
   },
   
   destroy_removesAllCreatedElements : function(){
      this.thumbnails.construct();
      this.thumbnails.destroy();
      
      assertThat( this.containerElement.getElements( '*' ).length, equalTo( 0 ));
   },
   
   //Protected, private helper methods
   checkMorphReady : function(){
      if( !this.thumbnails.morph.isRunning() ){
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