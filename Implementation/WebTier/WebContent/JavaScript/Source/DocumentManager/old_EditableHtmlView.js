// JavaScript Document

function EditableHtmlView(theName){
	// inherit from DocumentView to make this object a View
	inheritFrom(this, new DocumentView(theName));
	this.getClassName = function() { return "EditableHtmlView"; }

	//private instance variables
	var editable = false;
	var state = "";
	var previousState = "";
	var originalContent = "";
	var textEditor = null;

//	initializeDocument();	

	//public accessor methods
	this.isEditable = function() {return editable;}
	this.getState = function() {return state;}
	
	//public mutator methods
	this.setTabId = function(id){tabId = id;}
	this.edit = _Edit;
	this.commitEdit = _CommitEdit;
	this.cancelEdit = _CancelEdit;
	this.onClickHandler = _OnClickHandler;

	//private methods
	function _OnClickHandler(theEvent){
		if (!theEvent) var targetElement = window.event.srcElement;
		else var targetElement = theEvent.target;

		switch (state) {
		case "Initialized":
			_Edit(targetElement);
			break;
		case "Editing":
			break;
		case "Modified":
			_Edit(targetElement);
			break;
		}	
	}

	function _Edit(targetElement){
		if(state == "Editing") return;
		previousState = state;
		state = "Editing";
		originalContent = targetElement;
		showEditor(targetElement);
	}

	function _CommitEdit () {
		if(state != 'Editing') return false;
		var editedArea = retrieveEditedArea();
		saveEdit(editedArea);
		hideEditor(editedArea);
		state = 'Modified';
	}

	function _CancelEdit (){
		if(state != 'Editing') return false;
		var editedArea = retrieveEditedArea();
		restoreEdit(editedArea);
		hideEditor(editedArea)
		state = previousState;
	}

	function showEditor (targetElement) {
		if (!document.getElementById || !document.createElement) return;
		while (targetElement.nodeType != 1)
		{	targetElement = targetElement.parentNode;
		}
		if (targetElement.tagName == 'TEXTAREA' || targetElement.tagName == 'A') return;
		while (targetElement.nodeName != 'P' && targetElement.nodeName != 'HTML')
		{	targetElement = targetElement.parentNode;
		}
		if (targetElement.nodeName == 'HTML') return;
		var x = targetElement.innerHTML;
		var y = document.createElement('TEXTAREA');
		var parentNode = targetElement.parentNode;
		parentNode.insertBefore(y,targetElement);
		parentNode.insertBefore(cancelButton,targetElement);
		parentNode.insertBefore(commitButton,targetElement);
		parentNode.removeChild(targetElement);
		y.id = "FCKEditor1";
		y.value = x;
		y.focus();
	}

	function hideEditor (editedArea) {
		var z = editedArea.parentNode;
		z.removeChild(editedArea);
		z.removeChild(document.getElementById('CommitEditButton'));	
		z.removeChild(document.getElementById('CancelEditButton'));	
	}

	function retrieveEditedArea () {
		var area = document.getElementsByTagName('TEXTAREA')[0];
		return area;
	}

	function saveEdit (editedArea) {
		var y = document.createElement('P');
		var z = editedArea.parentNode;
		y.innerHTML = editedArea.value;
		z.insertBefore(y,editedArea);
	}
	
	function restoreEdit (editedArea) {
		var parentNode = editedArea.parentNode;
		parentNode.insertBefore(originalContent,editedArea);
	}
	
}

