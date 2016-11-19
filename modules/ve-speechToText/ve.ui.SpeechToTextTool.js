if ("webkitSpeechRecognition" in window) {
    ve.ui.speechToTextTool = function(toolGroup, config) {
        ve.ui.speechToTextTool.super.apply(this, arguments);
        this.setDisabled(false);
    }
    OO.inheritClass(ve.ui.speechToTextTool, ve.ui.Tool);

    ve.ui.speechToTextTool.static.name = 'speechToText';
    ve.ui.speechToTextTool.static.icon = 'comment';
    ve.ui.speechToTextTool.static.title = mw.msg('speechtotext-ve-toolname');
    ve.ui.speechToTextTool.static.autoAddToGroup = false;
    ve.ui.speechToTextTool.static.autoAddToCatchall = false;
    ve.ui.speechToTextTool.prototype.onSelect = function() {
        this.toolbar.getSurface().execute('window', 'open', 'speechToTextDialog', null);
    };

    ve.ui.speechToTextTool.prototype.onUpdateState = function(fragment) {
        ve.ui.FormatTool.super.prototype.onUpdateState.apply(this, arguments);

        this.setActive(false);
        var surfaceModel = ve.init.target.getSurface().getModel();
        var selection = surfaceModel.getSelection();
        this.setDisabled(!(selection instanceof ve.dm.LinearSelection));
    };

    ve.init.mw.Target.static.toolbarGroups.push({
        include: ['speechToText']
    });

    ve.ui.toolFactory.register(ve.ui.speechToTextTool);
}
