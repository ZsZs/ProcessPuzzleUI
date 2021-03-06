window.PhotoGaleryImageTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : [],

   options : {
      testMethods : [
          { method : 'initialize_SetsState', isAsynchron : false },
          { method : 'unmarshall_DeterminesProperties', isAsynchron : false },
          { method : 'construct_compilesDataObject', isAsynchron : false }]
   },

   constants : {
      LANGUAGE : "hu",
      IMAGE_DEFINITION_URI : "../PhotoGaleryWidget/PhotoGaleryData.xml",
      IMAGE_SELECTOR : "/pg:photoGalery/pg:images/pg:image[pg:uri='IMAG0337.jpg']",
      WEBUI_CONFIGURATION_URI : "../PhotoGaleryWidget/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.photoGaleryDefinition;
      this.photoGaleryImage;
      this.imageDefinition;
      this.photoGaleryInternationalization;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.photoGaleryInternationalization = new LocalizationResourceManager( this.webUIConfiguration );
      this.photoGaleryInternationalization.load( this.locale );
      this.photoGaleryDefinition = new XmlResource( this.constants.IMAGE_DEFINITION_URI, { nameSpaces : "xmlns:pg='http://www.processpuzzle.com/PhotoGalery'" });
      this.imageDefinition = this.photoGaleryDefinition.selectNode( this.constants.IMAGE_SELECTOR );
      
      this.photoGaleryImage = new PhotoGaleryImage( this.imageDefinition, this.photoGaleryInternationalization );
   },
   
   afterEachTest : function (){
      this.photoGaleryDefinition.release();
      this.photoGaleryImage.destroy();
   },
   
   initialize_SetsState : function() {
      assertThat( this.photoGaleryImage.getState(), equalTo( PhotoGaleryImage.States.INITIALIZED ));
   },
      
   unmarshall_DeterminesProperties : function() {
      this.photoGaleryImage.unmarshall();
      assertThat( this.photoGaleryImage.getCaption(), equalTo( this.photoGaleryInternationalization.getText( this.photoGaleryDefinition.selectNodeText( this.constants.IMAGE_SELECTOR + "/pg:caption" ))));
      assertThat( this.photoGaleryImage.getLink(), equalTo( this.photoGaleryDefinition.selectNodeText( this.constants.IMAGE_SELECTOR + "/pg:link" )));
      assertThat( this.photoGaleryImage.getThumbnailUri(), equalTo( this.photoGaleryDefinition.selectNodeText( this.constants.IMAGE_SELECTOR + "/pg:thumbnailUri" )));
      assertThat( this.photoGaleryImage.getUri(), equalTo( this.photoGaleryDefinition.selectNodeText( this.constants.IMAGE_SELECTOR + "/pg:uri" )));
   },
      
   construct_compilesDataObject : function() {
      this.photoGaleryImage.unmarshall();
      this.photoGaleryImage.construct();
      
      assertThat( this.photoGaleryImage.getData()['IMAG0337.jpg']['caption'], equalTo( this.photoGaleryImage.getCaption() ));
      assertThat( this.photoGaleryImage.getData()['IMAG0337.jpg']['href'], equalTo( this.photoGaleryImage.getLink() ));
      assertThat( this.photoGaleryImage.getData()['IMAG0337.jpg']['thumbnail'], equalTo( this.photoGaleryImage.getThumbnailUri() ));
   }
      
});