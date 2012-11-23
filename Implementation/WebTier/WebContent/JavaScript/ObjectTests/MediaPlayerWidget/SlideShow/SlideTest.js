window.SlideTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['checkMorphReady', 'onLocalizationFailure', 'onLocalizationLoaded'],

   options : {
      isBeforeEachTestAsynchron : true,
      testMethods : [
         { method : 'initialize_whenDefinitionElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'unmarshall_determinesProperties', isAsynchron : false }]
//         { method : 'construct_createsDomElements', isAsynchron : false },
//         { method : 'destroy_removesAllCreatedElements', isAsynchron : false }],
   },

   constants : {
      LANGUAGE : "hu",
      SLIDESHOW_DATA_URI : "../../MediaPlayerWidget/SlideShow/SlideShowData.xml",
      WEBUI_CONFIGURATION_URI : "../../MediaPlayerWidget/WebUIConfiguration.xml",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.slide;
      this.slideDefinition;
      this.slideshowData;
      this.slideshowInternationalization;
      this.timer;
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
            this.slideDefinition = this.slideshowData.selectNode( "/sh:slideShow/sh:images/sh:image[1]" ); 
               
            this.slide = new Slide( this.slideDefinition, this.slideshowInternationalization, {});
            this.beforeEachTestReady();
         }.bind( this )
      ).callChain();
   },
   
   afterEachTest : function (){
      this.slide.release();
   },
   
   initialize_whenDefinitionElementIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new Slide(); }, raises( AssertionException ));
   },
   
   unmarshall_determinesProperties : function() {
      this.slide.unmarshall();
      
      assertThat( this.slide.getCaption(), equalTo( this.slideshowInternationalization.getText( XmlResource.selectNodeText( 'sh:caption', this.slideDefinition ))));
      assertThat( this.slide.getLink(), equalTo( XmlResource.selectNodeText( 'sh:link', this.slideDefinition )));
      assertThat( this.slide.getThumbnailUri(), equalTo( XmlResource.selectNodeText( 'sh:thumbnailUri', this.slideDefinition )));
      assertThat( this.slide.getUri(), equalTo( XmlResource.selectNodeText( 'sh:uri', this.slideDefinition )));
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
   
   onLocalizationFailure : function( error ){
      fail( "Failed to load localization resources" );
   },
   
   onLocalizationLoaded : function(){
      this.beforeEachTestChain.callChain();
   }
   
});