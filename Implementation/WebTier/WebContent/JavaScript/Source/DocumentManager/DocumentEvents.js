//Javasctipt file

function DocumentActivationEvent (theDocumentView) {
	//check parameter assertions

	//private instance variables
	var documentView = theDocumentView;

	//public accessors methods
	this.getDocumentView = function () {return documentView;}

	//public mutators methods

	//private methods
}

function DocumentDeActivationEvent (theDocumentView) {
	//check parameter assertions

	//private instance variables
	var documentView = theDocumentView;

	//public accessors methods
	this.getDocumentView = function () {return documentView;}

	//public mutators methods

	//private methods
}

function ViewActivationEvent (theDocumentView) {
	//check parameter assertions

	//private instance variables
	var documentView = theDocumentView;
	var document = null;

	//public accessors methods
	this.getDocumentView = function () {return documentView;}
	this.setDocument = function (aDocument) { document = aDocument; }
	this.getDocument = function () {return document;}

	//public mutators methods

	//private methods
}

function ViewDeActivationEvent (theDocumentView) {
	//check parameter assertions

	//private instance variables
	var documentView = theDocumentView;
	var document = null;
	
	//public accessors methods
	this.getDocumentView = function () {return documentView;}
	this.setDocument = function (aDocument) { document = aDocument; }
	this.getDocument = function () {return document;}

	//public mutators methods

	//private methods
}