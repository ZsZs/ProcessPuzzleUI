window.DataElementTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
          { method : 'initialize_setsState', isAsynchron : false },
          { method : 'unmarshall_determinesElementProperties', isAsynchron : false },
          { method : 'unmarshall_whenMaxOccuresLargerThanOne_determinesNumberOfDataElements', isAsynchron : false },
          { method : 'unmarshall_whenMaxOccuresLargerThanOneAndMultipleVariables_determinesNumberOfDataElements', isAsynchron : false },
          { method : 'unmarshall_whenMaxOccuresLargerThanOne_instantiatesSiblingElements', isAsynchron : false },
          { method : 'construct_retrievesBindedData', isAsynchron : true }, 
          { method : 'construct_addsClass', isAsynchron : true }, 
          { method : 'construct_whenMaxOccuresLargetThanOne_createsMultipleElements', isAsynchron : true }, 
          { method : 'construct_whenVariablesAreGiven_substitutesWithCurrentValues', isAsynchron : true }, 
          { method : 'construct_whenHrefIsGiven_wrapsElementWithAnchor', isAsynchron : true }, 
          { method : 'destroy_whenUnmarshalled_resetsProperties', isAsynchron : false }, 
          { method : 'destroy_whenConstructed_removesHtmlElement', isAsynchron : true }, 
          { method : 'destroy_whenNotUnmarshalled_raisesException', isAsynchron : false }]
   },

   constants : {
      WEBUI_CONFIGURATION_URI : "../SmartDocument/WebUIConfiguration.xml",
      DOCUMENT_CONTAINER_ID : "SmartDocument",
      DOCUMENT_CONTENT_URI : "../SmartDocument/UserProfile.xml",
      DOCUMENT_DEFINITION_URI : "../SmartDocument/SmartDocumentDefinition.xml",
      ELEMENT_WITH_MAXOCCURES : "/smartDocumentDefinition/documentBody/compositeElement/compositeElement/dataElement[@id='userAddresses']",
      ELEMENT_WITH_SINGLE_DATA : "/smartDocumentDefinition/documentBody/compositeElement/dataElement[@id='currentUser']",
      ELEMENT_WITH_VARIABLES : "/smartDocumentDefinition/documentBody/compositeElement/compositeDataElement/compositeDataElement/dataElement",
      ELEMENT_WITH_VARIABLES_AND_MAXOCCURES : "/smartDocumentDefinition/documentBody/compositeElement/compositeDataElement/compositeDataElement"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.bundle;
      this.documentContainerElement;
      this.documentContentResource;
      this.documentDefinition;
      this.dataElement;
      this.documentInternationalization;
      this.webUIConfiguration;
      this.webUILogger;      
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.bundle = new XMLResourceBundle( this.webUIConfiguration );
      this.bundle.load( new ProcessPuzzleLocale({ language : "en" }) );
      
      this.documentContentResource = new XmlResource(  this.constants.DOCUMENT_CONTENT_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.dataElement = new DataElement( this.documentDefinition.selectNode( this.constants.ELEMENT_WITH_SINGLE_DATA ), this.bundle, null, { 
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError, 
         variables : { userNameIndex : 1 }
      });
      
      this.dataElementWithMaxOccures = new DataElement( this.documentDefinition.selectNode( this.constants.ELEMENT_WITH_MAXOCCURES ), this.bundle, null, { 
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError 
      });

      this.dataElementWithVariables = new DataElement( this.documentDefinition.selectNode( this.constants.ELEMENT_WITH_VARIABLES ), this.bundle, null, { 
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError,
         variables : { roleIndex : 2, activityIndex : 2 }
      });
      
      this.dataElementWithVariablesAndMaxOccures = new DataElement( this.documentDefinition.selectNode( this.constants.ELEMENT_WITH_VARIABLES_AND_MAXOCCURES ), this.bundle, null, { 
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError,
         variables : { roleIndex : 1, activityIndex : "'*'" }
      });
      
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      this.bundle.release();
      this.bundle = null;
      
      if( this.dataElement.getState() > DocumentElement.States.INITIALIZED ) this.dataElement.destroy();
      if( this.dataElementWithMaxOccures.getState() > DocumentElement.States.INITIALIZED ) this.dataElementWithMaxOccures.destroy();
      if( this.dataElementWithVariables.getState() > DocumentElement.States.INITIALIZED ) this.dataElementWithVariables.destroy();
      if( this.dataElementWithVariablesAndMaxOccures.getState() > DocumentElement.States.INITIALIZED ) this.dataElementWithVariablesAndMaxOccures.destroy();
      this.dataElement = null;
      this.dataElementWithMaxOccures = null;
      this.dataElementWithVariables = null;
      this.documentContainerElement = null;
   },
   
   initialize_setsState : function() {
      assertThat( this.dataElement, not( nil() ));
      assertThat( this.dataElement.getDefinitionElement(), not( nil() ));
      assertThat( this.dataElement.getState(), equalTo( DocumentElement.States.INITIALIZED ));
   },
   
   unmarshall_determinesElementProperties : function() {
      this.dataElement.unmarshall();
      
      assertThat( this.dataElement.getBind(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_WITH_SINGLE_DATA + "/@bind" )));
      assertThat( this.dataElement.getSource(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_WITH_SINGLE_DATA + "/@source" )));
      assertThat( this.dataElement.getMaxOccures(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_WITH_SINGLE_DATA + "/@maxOccures" )));
      assertThat( this.dataElement.getMinOccures(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_WITH_SINGLE_DATA + "/@minOccures" )));
      assertThat( this.dataElement.getIndexVariable(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_WITH_SINGLE_DATA + "/@indexVariable" )));
   },
   
   unmarshall_whenMaxOccuresLargerThanOne_determinesNumberOfDataElements : function() {
      this.dataElementWithMaxOccures.unmarshall();

      assertThat( this.dataElementWithMaxOccures.getDataElementsNumber(), equalTo( this.documentContentResource.selectNodes( "userProfile/addresses/address" ).length ));
   },
   
   unmarshall_whenMaxOccuresLargerThanOneAndMultipleVariables_determinesNumberOfDataElements : function() {
      this.dataElementWithVariablesAndMaxOccures.unmarshall();

      assertThat( this.dataElementWithVariablesAndMaxOccures.getDataElementsNumber(), equalTo( this.documentContentResource.selectNodes( "//userProfile/roles/role[1]/activities/activity" ).length ));
   },
   
   unmarshall_whenMaxOccuresLargerThanOne_instantiatesSiblingElements : function() {
      this.dataElementWithMaxOccures.unmarshall();
      
      assertThat( this.dataElementWithMaxOccures.getSiblings().size(), equalTo( this.documentContentResource.selectNodes( "userProfile/addresses/address" ).length -1 ));
   },
   
   construct_retrievesBindedData : function() {
      this.testCaseChain.chain(
         function(){
            this.dataElement.unmarshall();
            this.dataElement.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( this.dataElement.getDataXml().xmlAsText, equalTo( this.documentContentResource.xmlAsText ));
            assertThat( this.dataElement.getHtmlElement().get( 'text' ), equalTo( this.documentContentResource.selectNodeText( "/userProfile/userName" )));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_addsClass : function() {
      this.testCaseChain.chain(
         function(){
            this.dataElement.unmarshall();
            this.dataElement.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( this.dataElement.getHtmlElement().hasClass( DataElement.CLASS ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenMaxOccuresLargetThanOne_createsMultipleElements : function() {
      this.testCaseChain.chain(
         function(){
            this.dataElementWithMaxOccures.unmarshall();
            this.dataElementWithMaxOccures.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( this.documentContainerElement.getChildren().length, equalTo( this.documentContentResource.selectNodes( "userProfile/addresses/address" ).length ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenVariablesAreGiven_substitutesWithCurrentValues : function() {
      this.testCaseChain.chain(
         function(){
            this.dataElementWithVariables.unmarshall();
            this.dataElementWithVariables.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( this.documentContainerElement.getElements( 'li' )[0].get( 'text' ), equalTo( this.documentContentResource.selectNodeText( "//userProfile/roles/role[2]/activities/activity[2]/@name" ) ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenHrefIsGiven_wrapsElementWithAnchor : function() {
      this.testCaseChain.chain(
         function(){
            this.dataElement.unmarshall();
            this.dataElement.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( this.documentContainerElement.getElements( 'a' )[0].get( 'href' ), equalTo( this.documentContentResource.selectNodeText( "/userProfile/userName/@href" ) ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_whenUnmarshalled_resetsProperties : function() {
      this.dataElement.unmarshall();
      this.dataElement.destroy();

      assertThat( this.dataElement.getBind(), nil() );
      assertThat( this.dataElement.getMaxOccures(), nil() );
      assertThat( this.dataElement.getMinOccures(), nil() );
      assertThat( this.dataElement.getSource(), nil() );
   },
   
   destroy_whenConstructed_removesHtmlElement : function() {
      this.testCaseChain.chain(
         function(){
            this.dataElement.unmarshall();
            this.dataElement.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( this.documentContainerElement.getChildren(), hasItem( this.dataElement.getHtmlElement() ));
            this.dataElement.destroy();
            assertThat( this.documentContainerElement.getChildren().length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_whenNotUnmarshalled_raisesException : function() {
      try{
         this.dataElement.destroy();
         fail();
      }catch( e ){
         assertThat( instanceOf( e, UnconfiguredDocumentElementException ), is( true ));
      }
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },

   onConstructionError : function(){
      this.testCaseChain.callChain();
   }
});