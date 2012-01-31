// LoadUtility.js

function getWebUIController() {
	try {
		return parent.webUIController;
	}
	catch (e) {
		return null;
	}
}


function loadDocument(documentType, name, uri) {
	getWebUIController().loadDocument(documentType, name, uri);
}

function loadInfo(documentType, name, uri) {
	getWebUIController().loadInfoPanelDocument(documentType, name, uri);
}


function setToDirty() {
	getWebUIController().getDocumentManager().getActiveDocument().setToDirty();
}

function setToClean() {
	getWebUIController().getDocumentManager().getActiveDocument().setToClean();
}

function saveDocument() {
	getWebUIController().getDocumentManager().getActiveDocument().save();
}

function cancelModification() {
	getWebUIController().getDocumentManager().getActiveDocument().cancel();
}
;
