window.WebUIMessageTest = new Class({
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesProperties', isAsynchron : false }]
   },

   constants : {
      MENU_DEFINITION_URI : "../HierarchicalMenuWidget/MenuDefinition.xml",
      MENU_SELECTOR : "//pp:menuWidgetDefinition/menuItem[1]/menuItem[1]/menuItem[1]/messageProperties",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.message;
      this.messageResource;
      this.xmlResource;
   },   

   beforeEachTest : function(){
      this.xmlResource = new XmlResource( this.constants.MENU_DEFINITION_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com'" });
      this.messageResource = this.xmlResource.selectNode( this.constants.MENU_SELECTOR );
      this.messageValues = eval( "(" + this.xmlResource.selectNodeText( this.constants.MENU_SELECTOR ) + ")" ) 
      this.message = new WebUIMessage({ messageResource : this.messageResource });
   },
   
   afterEachTest : function (){
      this.message.destroy();
      this.xmlResource.release();
   },
   
   unmarshall_determinesProperties : function() {
      this.message.unmarshall();
      
      assertThat( this.message.getMessageProperties(), hasMember( 'documentURI' ));    
      assertThat( this.message.getActionType(), equalTo( this.messageValues['actionType'] ));  
   }
   
});