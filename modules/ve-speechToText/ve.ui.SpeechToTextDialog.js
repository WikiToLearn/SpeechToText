if ("webkitSpeechRecognition" in window) {
    if (!mw.messages.exists('speechToText-ve-dialog-title')) {
        mw.messages.set({
            'speechToText-ve-dialog-title': 'Search and replace'
        });
    }

    /* Create a dialog */
    ve.ui.speechToTextDialog = function(manager, config) {
        // Parent constructor
        ve.ui.speechToTextDialog.parent.call(this, config);
    };

    /* Inheritance */

    OO.inheritClass(ve.ui.speechToTextDialog, OO.ui.ProcessDialog);

    /* Set the body height */
    ve.ui.speechToTextDialog.prototype.getBodyHeight = function() {
        return 300;
    };

    /* Static Properties */
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
        'label': OO.ui.deferMsg('visualeditor-dialog-action-cancel'),
        'flags': 'safe',
        'modes': 'intro',
        'icon': 'close'
    }];

    /* Initialize the dialog elements */
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

        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = function() {}
        recognition.onresult = function(event) {
            console.log(event);
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    $("#oojs-stt-final textarea").each(function(index) {
                        console.log(index + ": " + $(this).text());
                        current_txt=$(this).text().trim();
                        new_recog_txt= event.results[i][0].transcript.trim() + ".";
                        new_txt=current_txt+"\n"+new_recog_txt;
                        $(this).text(new_txt.trim())
                    });
                    $("#oojs-stt-partial").html("");
                } else {
                    $("#oojs-stt-partial").html(event.results[i][0].transcript);
                }
            }
        };

        recognition.onerror = function(event) {}
        recognition.onend = function() {}
        recognition.start();
    };

    ve.ui.speechToTextDialog.prototype.getActionProcess = function(action) {
        var dialog = this;
        if (action === 'add') {
          new_text = null;
          $("#oojs-stt-final textarea").each(function(index) {
              new_text = $(this).text();
              $(this).text("");
          });

          var surfaceModel = ve.init.target.getSurface().getModel();
          var selection = surfaceModel.getSelection();
          // If selection is an instance of ve.dm.LinearSelection (as opposed to NullSelection or TableSelection)
          // you can get a range (start and end offset) using:
          var range = selection.getRange();
          surfaceModel.getFragment().adjustLinearSelection( range.end ).collapseToStart().insertContent( new_text + "\n");
        }
        return ve.ui.speechToTextDialog.super.prototype.getActionProcess.call(this, action);
    };


    /* Registration Dialog*/
    ve.ui.windowFactory.register(ve.ui.speechToTextDialog);
}
