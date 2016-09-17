if ("webkitSpeechRecognition" in window) {
    var webkitSpeechRecognitionOBJ = new webkitSpeechRecognition();
    webkitSpeechRecognitionOBJ.continuous = true;
    webkitSpeechRecognitionOBJ.interimResults = true;
    webkitSpeechRecognitionOBJ.lang = mw.config.get("wgContentLanguage");

    webkitSpeechRecognitionOBJ.onstart = function() {
        var windowManager = ve.init.target.getSurface().getDialogs();
        var speechToTextDialog = windowManager.getCurrentWindow();
        speechToTextDialog.actions.setMode('running');
        speechToTextDialog.labelFinal.setReadOnly(true);
    }
    webkitSpeechRecognitionOBJ.onresult = function(event) {
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
        var windowManager = ve.init.target.getSurface().getDialogs();
        var speechToTextDialog = windowManager.getCurrentWindow();
        speechToTextDialog.labelFinal.setReadOnly(false);
        speechToTextDialog.actions.setMode('done');
    }
    webkitSpeechRecognitionOBJ.onend = function() {
        var windowManager = ve.init.target.getSurface().getDialogs();
        var speechToTextDialog = windowManager.getCurrentWindow();
        speechToTextDialog.labelFinal.setReadOnly(false);
        speechToTextDialog.actions.setMode('done');
    }
}
