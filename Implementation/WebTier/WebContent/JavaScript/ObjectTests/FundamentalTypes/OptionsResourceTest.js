window.OptionsResourceTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'unmarshall_instantiatesOptionsObject', isAsynchron : false }]
   },

   constants : {
      OPTIONS_ELEMENT_SELECTOR : "/sampleOptions/options",
      OPTIONS_XML_URI : "../FundamentalTypes/Options.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.optionsElement;
      this.optionsResource;
      this.optionsXml;
   },   

   beforeEachTest : function(){
      this.optionsXml = new XmlResource( this.constants.OPTIONS_XML_URI );
      this.optionsElement = this.optionsXml.selectNode( this.constants.OPTIONS_ELEMENT_SELECTOR );
      this.optionsResource = new OptionsResource( this.optionsElement );
   },
   
   afterEachTest : function (){
      this.optionsXml.release();
   },
   
   unmarshall_instantiatesOptionsObject : function() {
      this.optionsResource.unmarshall();
      assertThat( this.optionsResource.getOptions(), not( nil() ));
      assertThat( this.optionsResource.getOptions()['widgetContainerId'], equalTo( "HorizontalMenuBar" ));
      assertThat( this.optionsResource.getOptions()['widgetDefinitionURI'], equalTo( "../HierarchicalMenuWidget/MenuDefinition.xml" ));
      assertThat( this.optionsResource.getOptions()['arrayOfValues'].length, equalTo( 2 ));
      assertThat( this.optionsResource.getOptions()['booleanValue'], is( true ));
      
      assertThat( typeOf( this.optionsResource.getOptions()['objectValue'] ), equalTo( 'object' ));
      assertThat( this.optionsResource.getOptions()['objectValue']['stringProperty'], equalTo( 'hello' ));
      assertThat( this.optionsResource.getOptions()['objectValue']['booleanProperty'], is( true ));
      assertThat( this.optionsResource.getOptions()['objectValue']['integerProperty'], equalTo( 10 ));
   }
});