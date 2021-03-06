window.TextAreaEditorTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['messageSubscriber', 'onAnchorClick', 'onEditorAttached'],

   options : {
      testMethods : [
          { method : 'attach_instantiatesMooEditable', isAsynchron : true }, 
          { method : 'textAddLink_whenNoTextIsSelected_showsNotification', isAsynchron : true }, 
          { method : 'textAddLink_whenTextIsSelected_showsDocumentExplorer', isAsynchron : true }, 
          { method : 'textAddLink_whenReceivesDocumentSelectedMessage_addsOrChangesAnchorHref', isAsynchron : true }]
   },

   constants : {
      LANGUAGE : "hu",
      TEXT_AREA_ID : "EditorContainer",
      WEBUI_CONFIGURATION_URI : "../TextAreaEditor/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.clickEvent;
      this.internationalization;
      this.lastMessage;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.textAreaEditor;
      this.textAreaElement;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
      this.webUIMessageBus;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.webUIMessageBus = new WebUIMessageBus();
      this.webUIMessageBus.subscribeToMessage( MenuSelectedMessage, this.messageSubscriber );
      this.internationalization = new LocalizationResourceManager( this.webUIConfiguration );
      this.internationalization.load( this.locale );
      
      this.textAreaEditor = new TextAreaEditor( this.internationalization, { onEditorAttached : this.onEditorAttached, subscribeToWebUIMessages : [DocumentSelectedMessage] });
      this.textAreaElement = $( this.constants.TEXT_AREA_ID );
   },
   
   afterEachTest : function (){
      this.textAreaEditor.detach();
      this.webUIMessageBus.tearDown();
      this.lastMessage = null;
   },
   
   attach_instantiatesMooEditable : function() {
      this.testCaseChain.chain(
         function(){
            this.textAreaEditor.instantiateTools = spy( this.textAreaEditor.instantiateTools );
            this.textAreaEditor.attach( this.textAreaElement ); 
         }.bind( this ),
         function(){
            verify( this.textAreaEditor.instantiateTools );
            assertThat( instanceOf( this.textAreaEditor.mooEditable, MooEditable ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onEditorClick_whenAnchorIsTheEventSource_invokesOnClick : function() {
      this.testCaseChain.chain(
         function(){ this.textAreaEditor.attach( this.textAreaElement ); }.bind( this ),
         function(){
            this.textAreaEditor.onEditorClick = spy( this.textAreaEditor.onEditorClick );
            
            var anchorElement = new Element( 'a', { events: { click: this.onAnchorClick }});
            this.textAreaEditor.mooEditable.doc.body.grab( anchorElement );
            anchorElement.click();
            
            this.textAreaEditor.mooEditable.editorClick( this.clickEvent );
            
            verify( this.textAreaEditor.onEditorClick )();
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   textAddLink_whenNoTextIsSelected_showsNotification : function() {
      this.testCaseChain.chain(
         function(){ this.textAreaEditor.attach( this.textAreaElement ); }.bind( this ),
         function(){
            this.textAreaEditor.textAddLink();
            assertThat( this.lastMessage.getActivityType(), equalTo( DesktopWindow.Activity.SHOW_NOTIFICATION ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   textAddLink_whenTextIsSelected_showsDocumentExplorer : function() {
      this.testCaseChain.chain(
         function(){ this.textAreaEditor.attach( this.textAreaElement ); }.bind( this ),
         function(){
            this.selectElementContents( this.textAreaEditor.getMooEditable().win, this.textAreaEditor.getMooEditable().doc, this.textAreaEditor.getMooEditable().doc.getElementsByTagName( "body" )[0] );
            this.textAreaEditor.textAddLink();
            assertThat( this.lastMessage.getActivityType(), equalTo( DesktopWindow.Activity.SHOW_WINDOW ));
            assertThat( this.lastMessage.getWindowName(), equalTo( SYSTEM_WINDOWS.DOCUMENT_EXPLORER ));              
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   textAddLink_whenReceivesDocumentSelectedMessage_addsOrChangesAnchorHref : function() {
      this.testCaseChain.chain(
         function(){ this.textAreaEditor.attach( this.textAreaElement ); }.bind( this ),
         function(){
            this.selectElementContents( this.textAreaEditor.getMooEditable().win, this.textAreaEditor.getMooEditable().doc, this.textAreaEditor.getMooEditable().doc.getElementsByTagName( "body" )[0] );
            this.textAreaEditor.textAddLink();
            var message = new DocumentSelectedMessage({ originator : SYSTEM_WINDOWS.DOCUMENT_EXPLORER, documentURI : 'http://processpuzzle.com' });
            this.webUIMessageBus.notifySubscribers( message );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   messageSubscriber : function( webUIMessage ){
      this.lastMessage = webUIMessage;
   },
   
   onEditorAttached : function(){
      this.testCaseChain.callChain();
   },
   
   //Protected, private helper methods
   onAnchorClick : function( event ){
      this.clickEvent = event;
   },
   
   selectElementContents : function( targetWindow, targetDocument, el ) {
      var body = targetDocument.body, range, sel;
      if (body.createTextRange) {
          range = body.createTextRange();
          range.moveToElementText(el);
          range.select();
      } else if (targetDocument.createRange && window.getSelection) {
          range = targetDocument.createRange();
          range.selectNodeContents(el);
          sel = targetWindow.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
      }
   }.protect()
});