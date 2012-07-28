window.LocalizationResourceManagerTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialize_determinesDefaultLocaleFromWebUIConfiguration', isAsynchron : false },
         { method : 'initialize_determinesNameSpaceFromWebUIConfiguration', isAsynchron : false },
         { method : 'initialize_instantiatesLocalizationReferencesBasedOnWebUIConfiguration', isAsynchron : false },
         { method : 'load_maintainsResourceList', isAsynchron : true },
         { method : 'load_whenTimesOut_firesFailureEvent', isAsynchron : true },
         { method : 'release_clearsEntryChacheAndResourceList', isAsynchron : false }]
   },

   constants : {
      CONFIGURATION_NAMESPACES : "xmlns:pp='http://www.processpuzzle.com' xmlns:in='http://www.processpuzzle.com/InternationalizationConfiguration'",
      CONFIGURATION_URI : "../Internationalization/WebUIConfiguration.xml",
      RESOURCE_BUNDLE_ONE_NAME : "../Internationalization/TestResources",
      RESOURCE_BUNDLE_TWO_NAME : "../Internationalization/TestResourcesTwo"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.bundle;
      this.error;
      this.locale;
      this.webUIConfiguration;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.locale = new ProcessPuzzleLocale({ language : "en" });     
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.bundle = new LocalizationResourceManager( this.webUIConfiguration, { onFailure: this.onFailure, onSuccess : this.onSuccess });
   },
   
   afterEachTest : function (){
      this.bundle.release();
   },
   
   initialize_determinesDefaultLocaleFromWebUIConfiguration : function() {
      assertThat( this.bundle.getDefaultLocale(), equalTo( this.webUIConfiguration.getI18DefaultLocale() ));
   },
   
   initialize_determinesNameSpaceFromWebUIConfiguration : function() {
      assertThat( this.bundle.getNameSpace(), equalTo( this.webUIConfiguration.getI18ResourceBundleNameSpace() ));
   },
   
   initialize_instantiatesLocalizationReferencesBasedOnWebUIConfiguration : function() {
      assertThat( this.bundle.getLocalizationReferences().size(), equalTo( this.webUIConfiguration.getI18ResourceBundleElements().length ));
      
      this.bundle.getLocalizationReferences().each( function( localizationReference, index ){
         assertThat( localizationReference, JsHamcrest.Matchers.instanceOf( LocalizationResourceReference ));
      }.bind( this ));
   },
   
   load_maintainsResourceList : function(){
      this.testCaseChain.chain(
         function(){
            this.bundle.load( this.locale );
         }.bind( this ),
         function(){
            assertThat( this.bundle.getLocalizationResources().size(), greaterThan( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },

   load_whenTimesOut_firesFailureEvent : function(){
      this.testCaseChain.chain(
         function(){
            this.bundle.options.maxTries = 2;
            this.bundle.compileLoadChain = function(){ this.bundle.loadChain.chain( this.longTakingMethod ); }.bind( this );
            this.bundle.load( this.locale );
         }.bind( this ),
         function(){
            assertThat( this.bundle.getError(), JsHamcrest.Matchers.instanceOf( TimeOutException ));
            assertThat( this.bundle.getLocalizationResources().size(), equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },

   release_clearsEntryChacheAndResourceList : function(){
      //SETUP:
      this.bundle.load( this.locale );
      
      //EXCERCISE:
      this.bundle.release();
      
      //VERIFY:
      assertThat( this.bundle.isLoaded, is( false ));
      assertThat( this.bundle.cache, is( nil() ));
      assertThat( this.bundle.getLocale(), is( nil() ));
      assertThat( this.bundle.getLocalizationReferences().size(), equalTo( 0 ));
      assertThat( this.bundle.getLocalizationResources().size(), equalTo( 0 ));
   },
   
   //Event handler methods
   longTakingMethod : function(){
      //No operation
   },
   
   onFailure : function( error ){
      this.error = error;
      this.testCaseChain.callChain();
   },
   
   onSuccess : function(){
      this.testCaseChain.callChain();
   }
   
});