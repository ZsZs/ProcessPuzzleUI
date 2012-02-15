window.PhotoGaleryWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
          { method : 'initialization_setsState', isAsynchron : false },
          { method : 'unmarshall_determinesProperties', isAsynchron : false },
          { method : 'unmarshall_determinesImagesData', isAsynchron : false },
          { method : 'construct_compilesDataObject', isAsynchron : true }, 
          { method : 'construct_instantiatesSlideShow', isAsynchron : true }]
   },

   constants : {
      LANGUAGE : "hu",
      PHOTO_GALERY_DATA_URI : "../PhotoGaleryWidget/PhotoGaleryData.xml",
      PHOTO_GALERY_DEFINITION_URI : "../PhotoGaleryWidget/PhotoGaleryDefinition.xml",
      PHOTO_GALERY_CONTAINER_ID : "PhotoGaleryContainer",
      WEBUI_CONFIGURATION_URI : "../PhotoGaleryWidget/WebUIConfiguration.xml",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.locale = new Locale({ language : this.constants.LANGUAGE });
      this.componentStateManager;
      this.photoGalery;
      this.photoGaleryContainerElement;
      this.photoGaleryData;
      this.photoGaleryDefinition;
      this.photoGaleryInternationalization;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.componentStateManager = new ComponentStateManager();
      this.photoGaleryInternationalization = new XMLResourceBundle( this.webUIConfiguration );
      this.photoGaleryInternationalization.load( this.locale );
      this.photoGaleryData = new XmlResource( this.constants.PHOTO_GALERY_DATA_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com'" } );
      this.photoGaleryDefinition = new XmlResource( this.constants.PHOTO_GALERY_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com'" } );
      
      this.photoGalery = new PhotoGaleryWidget( {
         onConstructed : this.onConstructed,
         onDestroyed : this.onDestroyed,
         widgetContainerId : this.constants.PHOTO_GALERY_CONTAINER_ID, 
         widgetDefinitionURI : this.constants.PHOTO_GALERY_DEFINITION_URI, 
         widgetDataURI : this.constants.PHOTO_GALERY_DATA_URI 
      }, this.photoGaleryInternationalization );
      this.photoGaleryContainerElement = $( this.constants.PHOTO_GALERY_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      this.photoGalery.destroy();
      this.photoGaleryData.release();
      this.photoGaleryDefinition.release();
   },
   
   initialization_setsState : function() {
      assertThat( this.photoGalery.getState(), equalTo( BrowserWidget.States.INITIALIZED ));
   },
   
   unmarshall_determinesProperties : function() {
      this.photoGalery.unmarshall();
      
      assertThat( this.photoGalery.getAccessKeys(), equalTo( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/accessKeys' )));
      assertThat( this.photoGalery.getAutomaticallyLinkSlide(), equalTo( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/automaticallyLinkSlideToFullSizedImage' )));
      assertThat( this.photoGalery.getCenterImages(), equalTo( parseBoolean( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/centerImages' ))));
      assertThat( this.photoGalery.getEffectDuration(), equalTo( parseInt( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/effectDuration' ))));
      assertThat( this.photoGalery.getFirstSlide(), equalTo( parseInt( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/firstSlide' ))));
      assertThat( this.photoGalery.getGaleryLink(), equalTo( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/galeryLink' )));
      assertThat( this.photoGalery.getHeight(), equalTo( parseInt( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/height' ))));
      assertThat( this.photoGalery.getImageFolderUri(), equalTo( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/imageFolderUri' )));
      assertThat( this.photoGalery.getLoopShow(), equalTo( parseBoolean( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/loopShow' ))));
      assertThat( this.photoGalery.getOverlapImages(), equalTo( parseBoolean( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/overlapImages' ))));
      assertThat( this.photoGalery.getResizeImages(), equalTo( parseBoolean( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/resizeImages' ))));
      assertThat( this.photoGalery.getShowController(), equalTo( parseBoolean( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/showController' ))));
      assertThat( this.photoGalery.getShowImageCaptions(), equalTo( parseBoolean( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/showImageCaptions' ))));
      assertThat( this.photoGalery.getShowSlidesRandom(), equalTo( parseBoolean( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/showSlidesRandom' ))));
      assertThat( this.photoGalery.getShowThumbnails(), equalTo( parseBoolean( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/showThumbnails' ))));
      assertThat( this.photoGalery.getSkipTransition(), equalTo( parseBoolean( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/skipTransition' ))));
      assertThat( this.photoGalery.getSlideChangeDelay(), equalTo( parseInt( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/slideChangeDelay' ))));
      assertThat( this.photoGalery.getSlideTransition(), equalTo( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/slideTransition' )));
      assertThat( this.photoGalery.getStartPaused(), equalTo( parseBoolean( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/startPaused' ))));
      assertThat( this.photoGalery.getThumbnailFileNameRule(), equalTo( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/thumbnailFileNameRule' )));
      assertThat( this.photoGalery.getWidth(), equalTo( parseInt( this.photoGaleryDefinition.selectNodeText( 'pp:widgetDefinition/properties/width' ))));
   },
   
   unmarshall_determinesImagesData : function() {
      this.photoGalery.unmarshall();
      
      assertThat( this.photoGalery.getImages().size(), equalTo( this.photoGaleryData.selectNodes( 'pp:widgetData/images/image' ).length ));
   },
   
   construct_compilesDataObject : function() {
      this.testCaseChain.chain(
         function(){
            this.photoGalery.unmarshall();
            this.photoGalery.construct();
         }.bind( this ),
         function(){
            assertThat( this.photoGalery.getData()['IMAG0337.jpg']['caption'], equalTo( this.photoGalery.getImages().get('IMAG0337.jpg').getCaption() ));
            assertThat( this.photoGalery.getData()['IMAG0337.jpg']['href'], equalTo( this.photoGalery.getImages().get('IMAG0337.jpg').getLink() ));
            assertThat( this.photoGalery.getData()['IMAG0337.jpg']['thumbnail'], equalTo( this.photoGalery.getImages().get('IMAG0337.jpg').getThumbnailUri() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_instantiatesSlideShow : function() {
      this.testCaseChain.chain(
         function(){
            this.photoGalery.unmarshall();
            this.photoGalery.construct();
         }.bind( this ),
         function(){
            assertThat( this.photoGalery.getSlideShow(), not( nil() ));
            assertThat( $( this.constants.PHOTO_GALERY_CONTAINER_ID ).getElements( 'div' ).length, greaterThan( 0 ) );
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
   }

});