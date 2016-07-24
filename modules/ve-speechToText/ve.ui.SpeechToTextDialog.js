if (!mw.messages.exists('speechToText-ve-dialog-title')) {
    mw.messages.set({
        'speechToText-ve-dialog-title': 'Speach To Text',
        'speechToText-ve-dialog-add': 'Add text to the page',
        'speechToText-ve-dialog-cancel': 'Canecl',
        'speechToText-ve-toolname': 'Speach to text',
    });
}

if ("webkitSpeechRecognition" in window) {
    var webkitSpeechRecognitionOBJ = new webkitSpeechRecognition();
    webkitSpeechRecognitionOBJ.continuous = true;
    webkitSpeechRecognitionOBJ.interimResults = true;

    webkitSpeechRecognitionOBJ.onstart = function() {}
    webkitSpeechRecognitionOBJ.onresult = function(event) {
        console.log(event);
        var windowManager = ve.init.target.getSurface().getDialogs();
        var speechToTextDialog = windowManager.getCurrentWindow();
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                /*$("#oojs-stt-final textarea").each(function(index) {
                    console.log(index + ": " + $(this).text());
                    current_txt = $(this).text().trim();
                    new_recog_txt = event.results[i][0].transcript.trim() + ".";
                    new_txt = current_txt + "\n" + new_recog_txt;
                    $(this).text(new_txt.trim())
                });*/
                current_txt = speechToTextDialog.labelFinal.getValue().trim();
                new_recog_txt = event.results[i][0].transcript.trim() + ".";
                new_txt = current_txt + "\n" + new_recog_txt;
                speechToTextDialog.labelFinal.setValue(new_txt.trim());
                //$("#oojs-stt-partial").html("");
                speechToTextDialog.labelPartial.setLabel("");
            } else {
                speechToTextDialog.labelPartial.setLabel(event.results[i][0].transcript);
            }
        }
    };
    webkitSpeechRecognitionOBJ.onerror = function(event) {}
    webkitSpeechRecognitionOBJ.onend = function() {}

    ve.ui.speechToTextDialog = function(manager, config) {
        ve.ui.speechToTextDialog.parent.call(this, config);
    };

    OO.inheritClass(ve.ui.speechToTextDialog, OO.ui.ProcessDialog);

    ve.ui.speechToTextDialog.prototype.getBodyHeight = function() {
        return 300;
    };

    ve.ui.speechToTextDialog.static.name = 'speechToTextDialog';
    ve.ui.speechToTextDialog.static.title = OO.ui.deferMsg('speechToText-ve-dialog-title');
    ve.ui.speechToTextDialog.static.size = 'large';
    ve.ui.speechToTextDialog.static.actions = [{
        'action': 'add',
        'label': OO.ui.deferMsg('speechToText-ve-dialog-add'),
        'flags': ['primary', 'constructive'],
        'modes': 'intro',
        'icon': 'add'
    }, {
        'label': OO.ui.deferMsg('speechToText-ve-dialog-cancel'),
        'flags': 'safe',
        'modes': 'intro',
        'icon': 'close'
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
        webkitSpeechRecognitionOBJ.start();
    };

    ve.ui.speechToTextDialog.prototype.getActionProcess = function(action) {
        var dialog = this;
        console.log("action: " + action);
        if (action === 'add') {
            this.labelPartial.setLabel("ROBEBELLE");
            //console.log(this.labelPartial.getValue());
            new_text = null;
            /*$("#oojs-stt-final textarea").each(function(index) {
                new_text = $(this).text();
                $(this).text("");
            });*/

            new_text = this.labelFinal.getValue().trim();
            this.labelFinal.setValue("");

            var surfaceModel = ve.init.target.getSurface().getModel();
            var selection = surfaceModel.getSelection();
            var range = selection.getRange();
            surfaceModel.getFragment().adjustLinearSelection(range.end).collapseToStart().insertContent(new_text + "\n");
        }
        return ve.ui.speechToTextDialog.super.prototype.getActionProcess.call(this, action);
    };
    ve.ui.windowFactory.register(ve.ui.speechToTextDialog);
}
