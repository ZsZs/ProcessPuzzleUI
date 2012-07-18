window.LocalizationResourceParserTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
          { method : 'initialize_instantiatesSAXEventHandler', isAsynchron : false },
          { method : 'parse_collectsAndCountrySpecificElements', isAsynchron : true }]
   },

   constants : {
      LOCALIZATION_RESOURCE_URI : "../Internationalization/TestResources.xml",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.resourceChache;
      this.locale;
      this.parser;
   },   

   beforeEachTest : function(){
      this.cache = new ResourceCache();
      this.locale = new ProcessPuzzleLocale({ language : "hu", country : "HU" });     
      this.parser = new LocalizationResourceParser({ onFailure: this.onFailure, onSuccess : this.onSuccess });
   },
   
   afterEachTest : function (){
      this.cache.clear();
   },
   
   initialize_instantiatesSAXEventHandler : function() {
      assertThat( this.parser.getEventHandler(), JsHamcrest.Matchers.instanceOf( SAXEventHandler ));
   },
   
   parse_collectsAndCountrySpecificElements : function() {
      this.testCaseChain.chain(
         function(){
            this.parser.parse( this.cache, this.constants.LOCALIZATION_RESOURCE_URI, this.locale );
         }.bind( this ),
         function(){
            var localizationResource = new XmlResource( this.constants.LOCALIZATION_RESOURCE_URI );
            var expectedNumberOfEntries = localizationResource.selectNodes( "/pp:Resources/Resource" ).length;
            expectedNumberOfEntries += localizationResource.selectNodes( "/pp:Resources/Language[@name='hu']/Resource" ).length;
            expectedNumberOfEntries += localizationResource.selectNodes( "/pp:Resources/Language[@name='hu']/Country[@name='HU']/Resource" ).length;
            expectedNumberOfEntries -= 3; //duplicated keys in the resource
            assertThat( this.cache.getResources().size(), equalTo( expectedNumberOfEntries ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   asynchronTestOne : function() {
      this.testCaseChain.chain(
         function(){
            //EXCERCISE:
         }.bind( this ),
         function(){
            //VERIFY:
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onSuccess : function(){
      this.testCaseChain.callChain();
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   }

});