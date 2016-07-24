if (!mw.messages.exists('speechToText-ve-dialog-title')) {
    mw.messages.set({
        'speechToText-ve-dialog-title': 'Speech To Text',
        'speechToText-ve-dialog-add': 'Add text to the page',
        'speechToText-ve-dialog-cancel': 'Canecl',
        'speechToText-ve-dialog-start': 'Start',
        'speechToText-ve-toolname': 'Speech to text',
        'speechToText-ve-placeholder': 'Here will be the text...',
    });
}

if ("webkitSpeechRecognition" in window) {
    var webkitSpeechRecognitionOBJ = new webkitSpeechRecognition();
    webkitSpeechRecognitionOBJ.continuous = true;
    webkitSpeechRecognitionOBJ.interimResults = true;

    webkitSpeechRecognitionOBJ.onstart = function() {
        console.log("onstart");

        var windowManager = ve.init.target.getSurface().getDialogs();
        var speechToTextDialog = windowManager.getCurrentWindow();
        speechToTextDialog.actions.setMode('running');
    }
    webkitSpeechRecognitionOBJ.onresult = function(event) {
        console.log("onresult");
        console.log(event);
        var windowManager = ve.init.target.getSurface().getDialogs();
        var speechToTextDialog = windowManager.getCurrentWindow();
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                current_txt = speechToTextDialog.labelFinal.getValue().trim();
                new_recog_txt = event.results[i][0].transcript.trim() + ".";
                new_txt = current_txt + "\n" + new_recog_txt;
                speechToTextDialog.labelFinal.setValue(new_txt.trim());
                speechToTextDialog.labelPartial.setLabel("");
            } else {
                speechToTextDialog.labelPartial.setLabel(event.results[i][0].transcript);
            }
        }
    };
    webkitSpeechRecognitionOBJ.onerror = function(event) {
        console.log("onerror");
        console.log(event);
    }
    webkitSpeechRecognitionOBJ.onend = function() {
        console.log("onend");
    }

    ve.ui.speechToTextDialog = function(manager, config) {
        ve.ui.speechToTextDialog.parent.call(this, manager, config);
    };

    OO.inheritClass(ve.ui.speechToTextDialog, OO.ui.ProcessDialog);

    ve.ui.speechToTextDialog.prototype.getBodyHeight = function() {
        return 320;
    };

    /* Set the default mode of the dialog */
    ve.ui.speechToTextDialog.prototype.getSetupProcess = function(data) {
        return ve.ui.speechToTextDialog.super.prototype.getSetupProcess.call(this, data)
            .next(function() {
                this.actions.setMode('intro');
            }, this);
    };

    ve.ui.speechToTextDialog.static.name = 'speechToTextDialog';
    ve.ui.speechToTextDialog.static.title = OO.ui.deferMsg('speechToText-ve-dialog-title');
    ve.ui.speechToTextDialog.static.size = 'large';
    ve.ui.speechToTextDialog.static.actions = [{
        'action': 'add',
        'label': OO.ui.deferMsg('speechToText-ve-dialog-add'),
        'flags': ['primary', 'constructive'],
        'modes': 'running',
        'icon': 'add'
    }, {
        'label': OO.ui.deferMsg('speechToText-ve-dialog-cancel'),
        'flags': 'safe',
        'modes': ['intro', 'running'],
        'icon': 'close'
    }, {
        'action': 'start',
        'label': OO.ui.deferMsg('speechToText-ve-dialog-start'),
        'flags': ['primary', 'constructive'],
        'modes': 'intro',
        'icon': 'search'
    }];

    ve.ui.speechToTextDialog.prototype.initialize = function() {
        ve.ui.speechToTextDialog.super.prototype.initialize.call(this);
        this.panel = new OO.ui.PanelLayout({
            '$': this.$,
            'scrollable': true,
            'padded': true,
        });

        this.labelPartial = new OO.ui.LabelWidget({
            '$': this.$,
            'id': 'oojs-stt-partial'
        });

        this.labelFinal = new OO.ui.TextInputWidget({
            '$': this.$,
            'id': 'oojs-stt-final',
            'multiline': true,
            'autosize': true,
            'rows': 14,
            'placeholder': mw.msg('speechToText-ve-placeholder')
        });


        this.panel.$element.append(this.labelFinal.$element);
        this.panel.$element.append(this.labelPartial.$element);
        this.$body.append(this.panel.$element);
    };

    ve.ui.speechToTextDialog.prototype.getActionProcess = function(action) {
        var dialog = this;
        console.log("action: " + action);
        if (action === 'add') {
            this.actions.setMode('intro');

            new_text = this.labelFinal.getValue().trim();

            var surfaceModel = ve.init.target.getSurface().getModel();
            var selection = surfaceModel.getSelection();
            try {
                var range = selection.getRange();

                surfaceModel.getFragment().adjustLinearSelection(range.end).collapseToStart().insertContent(new_text + "\n");

                this.labelPartial.setLabel("");
                this.labelFinal.setValue("");
            } catch (exc) {
                alert("Something is wrong, sorry")
            }
            webkitSpeechRecognitionOBJ.stop();
        } else if (action == 'start') {
            webkitSpeechRecognitionOBJ.start();
        } else {
            this.actions.setMode('intro');

            webkitSpeechRecognitionOBJ.stop();
        }
        return ve.ui.speechToTextDialog.super.prototype.getActionProcess.call(this, action);
    };
    ve.ui.windowFactory.register(ve.ui.speechToTextDialog);
}
