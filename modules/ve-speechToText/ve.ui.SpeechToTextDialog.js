if ("webkitSpeechRecognition" in window) {
    ve.ui.speechToTextDialog = function(manager, config) {
        ve.ui.speechToTextDialog.parent.call(this, manager, config);
    };

    OO.inheritClass(ve.ui.speechToTextDialog, OO.ui.ProcessDialog);

    ve.ui.speechToTextDialog.prototype.getBodyHeight = function() {
        return 360;
    };

    /* Set the default mode of the dialog */
    ve.ui.speechToTextDialog.prototype.getSetupProcess = function(data) {
        return ve.ui.speechToTextDialog.super.prototype.getSetupProcess.call(this, data)
            .next(function() {
                this.actions.setMode('lang');
            }, this);
    };

    ve.ui.speechToTextDialog.static.name = 'speechToTextDialog';
    ve.ui.speechToTextDialog.static.title = mw.msg('speechtotext-ve-dialog-title');
    ve.ui.speechToTextDialog.static.size = 'large';
    ve.ui.speechToTextDialog.static.actions = [{
        'label': mw.msg('speechtotext-ve-dialog-cancel'),
        'flags': 'safe',
        'modes': ['lang', 'running', 'done'],
        'icon': 'close'
    }, {
        'action': 'stop',
        'label': mw.msg('speechtotext-ve-dialog-stop'),
        'flags': ['primary', 'destructive'],
        'modes': 'running',
        'icon': 'stop'
    }, {
        'action': 'start',
        'label': mw.msg('speechtotext-ve-dialog-start'),
        'flags': ['primary', 'progressive'],
        'modes': ['lang', 'done'],
        'icon': 'comment'
    }, {
        'action': 'add',
        'label': mw.msg('speechtotext-ve-dialog-add'),
        'modes': 'done',
        'icon': 'add'
    }];

    ve.ui.speechToTextDialog.prototype.initialize = function() {
        ve.ui.speechToTextDialog.super.prototype.initialize.call(this);
        this.panel = new OO.ui.PanelLayout({
            '$': this.$,
            'scrollable': true,
            'padded': true,
        });
        this.panelLang = new OO.ui.PanelLayout({
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
            'readOnly': true,
            'placeholder': mw.msg('speechtotext-ve-placeholder')
        });

        this.lang_select = new OO.ui.SelectWidget({});
        var default_lang = null;
        for (label in webkitSpeechRecognitionLangs) {
            data = webkitSpeechRecognitionLangs[label];

            var zeroindex = false;
            if (default_lang === null) {
                if (data.toString().substring(0, mw.config.get("wgContentLanguage").length) === mw.config.get("wgContentLanguage")) {
                    default_lang = data;
                    zeroindex = true;
                }
            }
            var new_elem = new OO.ui.OptionWidget({
                data: data,
                label: label,
            });
            if (zeroindex) {
                this.lang_select.addItems([new_elem], 0);
            } else {
                this.lang_select.addItems([new_elem]);
            }
        }

        this.lang_select.selectItemByData(default_lang);

        this.panel.$element.append(this.labelFinal.$element);
        this.panel.$element.append(this.labelPartial.$element);
        this.panelLang.$element.append(this.lang_select.$element);

        this.stackLayout = new OO.ui.StackLayout({
            items: [this.panelLang, this.panel]
        });
        this.$body.append(this.stackLayout.$element);
    };

    ve.ui.speechToTextDialog.prototype.getActionProcess = function(action) {
        if (action === 'add') {
            this.stackLayout.setItem(this.panelLang);

            new_text = this.labelFinal.getValue().trim();

            var surfaceModel = ve.init.target.getSurface().getModel();
            var selection = surfaceModel.getSelection();
            try {
                var range = selection.getRange();

                surfaceModel.getFragment().adjustLinearSelection(range.end).collapseToStart().insertContent(new_text + "\n");

                this.labelPartial.setLabel("");
                this.labelFinal.setValue("");
                webkitSpeechRecognitionOBJ.stop();
                this.close();
            } catch (exc) {
                webkitSpeechRecognitionOBJ.stop();
                // FIXME: "Something is wrong, sorry";
                this.close();
            }
        } else if (action === 'start') {
            webkitSpeechRecognitionOBJ.lang = this.lang_select.getSelectedItem().data;
            webkitSpeechRecognitionOBJ.start();
        } else if (action === 'stop') {
            webkitSpeechRecognitionOBJ.stop();
        } else {
            this.actions.setMode('lang');
            this.stackLayout.setItem(this.panelLang);

            webkitSpeechRecognitionOBJ.stop();
        }
        return ve.ui.speechToTextDialog.super.prototype.getActionProcess.call(this, action);
    };
    ve.ui.windowFactory.register(ve.ui.speechToTextDialog);
}
