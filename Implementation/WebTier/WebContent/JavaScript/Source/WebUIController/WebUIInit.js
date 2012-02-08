// WebUIInit.js

//= require_directory ../FundamentalTypes

function WebUIInit() {
	var CONTEXT_ROOT_PREFIX = "../../../"; 
	var logger = log4javascript.getLogger( ROOT_LOGGER_NAME + ".webUiInit" );
	logger.group("Initializing Browser Interface.", false );

	var infoPagesMenuCaption = webUIController.getText("InfoPagesMenu");
	var toDoListName = webUIController.getText("ToDoListName");
	var messageWallName = webUIController.getText("MessageWallName");
	var documentPropertiesInfoPageName = webUIController.getText("DocumentPropertiesInfoPageName");
	
	var processManagementMenuCaption = webUIController.getText("ProcessManagementMenu");
	var newProcess = webUIController.getText("newProcessName");

	var artifactManagementMenuCaption = webUIController.getText("ArtifactManagementMenu");
	var newArtifact = webUIController.getText("newArtifactName");
	var delArtifact = webUIController.getText("delArtifactName");
	var renameArtifact = webUIController.getText("renameArtifactName");
	var moveArtifact = webUIController.getText("moveArtifactName");
	
	var artifactFolderManagementMenuCaption = webUIController.getText("ArtifactFolderManagementMenu");
	var newFolder = webUIController.getText("newFolderName");
	var delFolder = webUIController.getText("delFolderName");
	var renameFolder = webUIController.getText("renameFolderName");
	var moveFolder = webUIController.getText("moveFolderName");

	var systemAdminMenuCaption = webUIController.getText("SystemAdminMenu");
	var backup = webUIController.getText("backupName");
	var restore = webUIController.getText("restoreName");
	var undoMaintenance = webUIController.getText("undoMaintenanceName");
	var user = webUIController.getText("userManagementName");
	var organization = webUIController.getText("organizationManagementName");
	
	var rightMenu = webUIController.getRightMenu();
	rightMenu.addCompositMenu("InfoPagesMenu", infoPagesMenuCaption, false,1);//0,1,2,...
	rightMenu.addDualStateMenuToCompositMenu("InfoPagesMenu","ToDoListName", toDoListName, new ToDoListManageCommand(),"false");
	rightMenu.addDualStateMenuToCompositMenu("InfoPagesMenu","DocumentPropertiesInfoPageName", documentPropertiesInfoPageName, new ShowDocumentPropertiesCommand( CONTEXT_ROOT_PREFIX ), "false");
	rightMenu.addDualStateMenuToCompositMenu("InfoPagesMenu","MessageWallName", messageWallName, new MessageWallManageCommand( CONTEXT_ROOT_PREFIX ), "false");
	
	rightMenu.addCompositMenu("ProcessManagementMenu", processManagementMenuCaption, false, 2);
	rightMenu.addSubMenuToCompositMenu("ProcessManagementMenu","newProcessName", newProcess, new CreateNewPlanCommand());

	rightMenu.addCompositMenu("ArtifactManagementMenu", artifactManagementMenuCaption, false, 2);
	rightMenu.addSubMenuToCompositMenu("ArtifactManagementMenu","newArtifactName", newArtifact, new NewArtifactCommand());
	rightMenu.addSubMenuToCompositMenu("ArtifactManagementMenu","delArtifactName", delArtifact, new DeleteArtifactCommand());
	rightMenu.addSubMenuToCompositMenu("ArtifactManagementMenu","renameArtifactName", renameArtifact, new RenameArtifactCommand());
	rightMenu.addSubMenuToCompositMenu("ArtifactManagementMenu","moveArtifactName", moveArtifact, new MoveArtifactCommand());
	
	rightMenu.addCompositMenu("ArtifactFolderManagementMenu", artifactFolderManagementMenuCaption, false, 3);
	rightMenu.addSubMenuToCompositMenu("ArtifactFolderManagementMenu","newFolderName", newFolder, new NewFolderCommand());
	rightMenu.addSubMenuToCompositMenu("ArtifactFolderManagementMenu","delFolderName", delFolder, new DeleteFolderCommand());
	rightMenu.addSubMenuToCompositMenu("ArtifactFolderManagementMenu","renameFolderName", renameFolder, new RenameFolderCommand());
	rightMenu.addSubMenuToCompositMenu("ArtifactFolderManagementMenu","moveFolderName", moveFolder, new MoveFolderCommand());

	rightMenu.addCompositMenu("SystemAdminMenu", systemAdminMenuCaption, false, 4);
	rightMenu.addSubMenuToCompositMenu("SystemAdminMenu","backupName", backup, new BackupDatabaseManageCommand());
	rightMenu.addSubMenuToCompositMenu("SystemAdminMenu","restoreName", restore, new RestoreDatabaseManageCommand());
	rightMenu.addSubMenuToCompositMenu("SystemAdminMenu","undoMaintenanceName", undoMaintenance, new UndoMaintenanceCommand());
	rightMenu.addSubMenuToCompositMenu("SystemAdminMenu","userManagementName", user, new UserManagementCommand());
	rightMenu.addSubMenuToCompositMenu("SystemAdminMenu","organizationManagementName", organization, new OrganizationManagementCommand());
	
	logger.groupEnd();
}