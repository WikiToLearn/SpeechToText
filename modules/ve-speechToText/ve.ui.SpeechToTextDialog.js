if (!mw.messages.exists('speechToText-ve-dialog-title')) {
    mw.messages.set({
        'speechToText-ve-dialog-title': 'Speech To Text',
        'speechToText-ve-dialog-add': 'Add text to the page',
        'speechToText-ve-dialog-cancel': 'Cancel',
        'speechToText-ve-dialog-start': 'Start',
        'speechToText-ve-toolname': 'Speech to text',
        'speechToText-ve-placeholder': 'Listening...',
    });
}

if ("webkitSpeechRecognition" in window) {
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
                this.actions.setMode('lang');
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
        'modes': ['lang', 'running'],
        'icon': 'close'
    }, {
        'action': 'start',
        'label': OO.ui.deferMsg('speechToText-ve-dialog-start'),
        'flags': ['primary', 'constructive'],
        'modes': 'lang',
        'icon': 'comment'
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
            'placeholder': mw.msg('speechToText-ve-placeholder')
        });

        this.lang_select = new OO.ui.SelectWidget({});
        default_lang = null;
        for (k = 0; k < webkitSpeechRecognitionLangs.length; k++) {
            for (q = 1; q < webkitSpeechRecognitionLangs[k].length; q++) {
                if (webkitSpeechRecognitionLangs[k][q].length === 1) {
                    wklang_label = webkitSpeechRecognitionLangs[k][0];
                    wklang_data = webkitSpeechRecognitionLangs[k][1];
                } else {
                    wklang_label = webkitSpeechRecognitionLangs[k][0] + " (" + webkitSpeechRecognitionLangs[k][q][1] + ")";
                    wklang_data = webkitSpeechRecognitionLangs[k][q][0];
                }
                zeroindex = false;
                if (default_lang === null) {
                    if (wklang_data.toString().substring(0, mw.config.get("wgContentLanguage").length) === mw.config.get("wgContentLanguage")) {
                        default_lang = wklang_data;
                        zeroindex = true;
                    }
                }
                new_elem = new OO.ui.OptionWidget({
                    data: wklang_data,
                    label: wklang_label,
                });
                if (zeroindex) {
                    this.lang_select.addItems([new_elem], 0);
                } else {
                    this.lang_select.addItems([new_elem]);
                }
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

        //this.$body.append(this.panel.$element);
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
            this.stackLayout.setItem(this.panel);
        } else {
            this.actions.setMode('lang');
            this.stackLayout.setItem(this.panelLang);

            webkitSpeechRecognitionOBJ.stop();
        }
        return ve.ui.speechToTextDialog.super.prototype.getActionProcess.call(this, action);
    };
    ve.ui.windowFactory.register(ve.ui.speechToTextDialog);
}
