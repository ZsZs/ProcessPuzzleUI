window.MediaPlayerWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed', 'onLocalizationFailure', 'onLocalizationLoaded'],

   options : {
      isBeforeEachTestAsynchron : true,
      testMethods : [
          { method : 'unmarshall_determinesProperties', isAsynchron : false },
          { method : 'unmarshall_instantiatesSlides', isAsynchron : false },
          { method : 'collectThumbnailUris_returnsThumbnailUrisAsArray', isAsynchron : false },
          { method : 'release_releasesSlides', isAsynchron : false }]
/*          { method : 'construct_compilesDataObject', isAsynchron : true }, 
          { method : 'construct_instantiatesSlideShow', isAsynchron : true },
          { method : 'destroy_destroysAllCreatedElements', isAsynchron : true }]
*/   },

   constants : {
      LANGUAGE : "hu",
      SLIDESHOW_DATA_URI : "../../MediaPlayerWidget/SlideShow/SlideShowData.xml",
      WEBUI_CONFIGURATION_URI : "../../MediaPlayerWidget/WebUIConfiguration.xml",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.slideshow;
      this.slideshowData;
      this.slideshowInternationalization;
      this.webUIConfiguration;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.beforeEachTestChain.chain(
         function(){
            this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
            this.webUILogger = new WebUILogger( this.webUIConfiguration );
            this.slideshowInternationalization = new LocalizationResourceManager( this.webUIConfiguration, { onFailure: this.onLocalizationFailure, onSuccess : this.onLocalizationLoaded });
            this.slideshowInternationalization.load( this.locale );
         }.bind( this ),
         function(){
            this.slideshowData = new XmlResource( this.constants.SLIDESHOW_DATA_URI, { nameSpaces : "xmlns:pg='http://www.processpuzzle.com/PhotoGalery'" });
            
            this.slideshow = new SlideShow( this.slideshowInternationalization, this.slideshowData, { onConstructed : this.onConstructed, onDestroyed : this.onDestroyed });
            this.beforeEachTestReady();
         }.bind( this )
      ).callChain();
   },
   
   afterEachTest : function (){
      this.slideshow.relase();
      this.slideshowData.release();
   },
   
   unmarshall_determinesProperties : function() {
      this.slideshow.unmarshall();
      
      assertThat( this.slideshow.getAccessKeys(), equalTo( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:accessKeys' )));
      assertThat( this.slideshow.getAutomaticallyLinkSlide(), equalTo( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:automaticallyLinkSlideToFullSizedImage' )));
      assertThat( this.slideshow.getCenterImages(), equalTo( parseBoolean( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:centerImages' ))));
      assertThat( this.slideshow.getEffectDuration(), equalTo( parseInt( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:effectDuration' ))));
      assertThat( this.slideshow.getFirstSlide(), equalTo( parseInt( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:firstSlide' ))));
      assertThat( this.slideshow.getGaleryLink(), equalTo( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:galeryLink' )));
      assertThat( this.slideshow.getHeight(), equalTo( parseInt( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:height' ))));
      assertThat( this.slideshow.getImageFolderUri(), equalTo( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:imageFolderUri' )));
      assertThat( this.slideshow.getLoopShow(), equalTo( parseBoolean( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:loopShow' ))));
      assertThat( this.slideshow.getOverlapImages(), equalTo( parseBoolean( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:overlapImages' ))));
      assertThat( this.slideshow.getResizeImages(), equalTo( parseBoolean( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:resizeImages' ))));
      assertThat( this.slideshow.getShowController(), equalTo( parseBoolean( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:showController' ))));
      assertThat( this.slideshow.getShowImageCaptions(), equalTo( parseBoolean( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:showImageCaptions' ))));
      assertThat( this.slideshow.getShowSlidesRandom(), equalTo( parseBoolean( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:showSlidesRandom' ))));
      assertThat( this.slideshow.getShowThumbnails(), equalTo( parseBoolean( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:showThumbnails' ))));
      assertThat( this.slideshow.getSkipTransition(), equalTo( parseBoolean( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:skipTransition' ))));
      assertThat( this.slideshow.getSlideChangeDelay(), equalTo( parseInt( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:slideChangeDelay' ))));
      assertThat( this.slideshow.getSlideTransition(), equalTo( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:slideTransition' )));
      assertThat( this.slideshow.getStartPaused(), equalTo( parseBoolean( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:startPaused' ))));
      assertThat( this.slideshow.getThumbnailFileNameRule(), equalTo( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:thumbnailFileNameRule' )));
      assertThat( this.slideshow.getWidth(), equalTo( parseInt( this.slideshowData.selectNodeText( '/sh:slideShow/sh:properties/sh:width' ))));
   },
   
   unmarshall_instantiatesSlides : function() {
      this.slideshow.unmarshall();
      
      assertThat( this.slideshow.getSlides().size(), equalTo( this.slideshowData.selectNodes( 'sh:slideShow/sh:images/sh:image' ).length ));
   },
   
   collectThumbnailUris_returnsThumbnailUrisAsArray : function() {
      this.slideshow.unmarshall();
      
      var thumbnailUris = this.slideshow.collectThumbnailUris();
      assertThat( thumbnailUris, JsHamcrest.Matchers.instanceOf( Array ));
      assertThat( thumbnailUris.length, equalTo( this.slideshowData.selectNodes( 'sh:slideShow/sh:images/sh:image' ).length ));
   },
   
   release_releasesSlides : function() {
      this.slideshow.unmarshall();
      this.slideshow.release();
      
      assertThat( this.slideshow.getSlides().size(), equalTo( 0 ));
   },
   
   construct_compilesDataObject : function() {
      this.testCaseChain.chain(
         function(){
            this.slideshow.unmarshall();
            this.slideshow.construct();
         }.bind( this ),
         function(){
            assertThat( this.slideshow.getData()['IMAG0337.jpg']['caption'], equalTo( this.slideshow.getImages().get('IMAG0337.jpg').getCaption() ));
            assertThat( this.slideshow.getData()['IMAG0337.jpg']['href'], equalTo( this.slideshow.getImages().get('IMAG0337.jpg').getLink() ));
            assertThat( this.slideshow.getData()['IMAG0337.jpg']['thumbnail'], equalTo( this.slideshow.getImages().get('IMAG0337.jpg').getThumbnailUri() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_instantiatesSlideShow : function() {
      this.testCaseChain.chain(
         function(){
            this.slideshow.unmarshall();
            this.slideshow.construct();
         }.bind( this ),
         function(){
            assertThat( this.slideshow.getSlideShow(), not( nil() ));
            assertThat( $( this.constants.SLIDESHOW_CONTAINER_ID ).getElements( 'div' ).length, greaterThan( 0 ) );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_destroysAllCreatedElements : function() {
      this.testCaseChain.chain(
         function(){ this.slideshow.unmarshall(); this.slideshow.construct(); }.bind( this ),
         function(){
            assumeThat( this.slideshow.getState(), equalTo( BrowserWidget.States.CONSTRUCTED ));
            
            this.slideshow.destroy();
         }.bind( this ),
         function(){
            assertThat( this.slideshow.getState(), equalTo( BrowserWidget.States.INITIALIZED ));
            assertThat( this.slideshowContainerElement.getElements( '*' ).length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   //Event handling methods
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function(){
      this.testCaseChain.callChain();
   },
   
   onLocalizationFailure : function( error ){
      fail( "Failed to load localization resources" );
   },
   
   onLocalizationLoaded : function(){
      this.beforeEachTestChain.callChain();
   },
   
   waitForImageLoading : function(){
      //NOP
   }.protect()

});