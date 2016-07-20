if ("webkitSpeechRecognition" in window) {
    /* Create a tool */
    ve.ui.speechToTextTool = function(toolGroup, config) {
            // parent constructor
            ve.ui.speechToTextTool.super.apply(this, arguments);
            // the tool should be enabled by default, enable it
            this.setDisabled(false);
            ve.init.target.connect(this, {
                save: 'onSaveCompleted'
            });
        }
        /* Inherit ve.ui.Tool */
    OO.inheritClass(ve.ui.speechToTextTool, ve.ui.Tool);

    /*Static properties */
    ve.ui.speechToTextTool.static.name = 'speechToText';
    ve.ui.speechToTextTool.static.icon = 'tag';
    ve.ui.speechToTextTool.static.title = OO.ui.deferMsg('speechToText-ve-toolname');
    // don't add the tool to a named group automatically
    ve.ui.speechToTextTool.static.autoAddToGroup = false;
    // prevent this tool to be added to a catch-all group (*),
    //although this tool isn't added to a group
    ve.ui.speechToTextTool.static.autoAddToCatchall = false;
    //ve.ui.speechToTextTool.static.commandName = 'speechToTextToolbarDialog';

    /* onSelect is the handler for a click on the tool, open the dialog */
    ve.ui.speechToTextTool.prototype.onSelect = function() {
        this.toolbar.getSurface().execute('window', 'open', 'speechToTextDialog', null);
    };

    ve.ui.speechToTextTool.prototype.onUpdateState = function() {
        this.setActive(false);
    };

    ve.ui.speechToTextTool.prototype.onSaveCompleted = function() {
        console.warn("Here I will have to store data");
    };

    // Add this tool to the toolbar
    ve.init.mw.Target.static.toolbarGroups.push({
        // this will create a new toolgroup with the tools
        // named in this include directive. The name is the name given
        // in the static property of the tool
        include: ['speechToText']
    });

    /* Registration of the tool using toolFactory */
    ve.ui.toolFactory.register(ve.ui.speechToTextTool);
}
