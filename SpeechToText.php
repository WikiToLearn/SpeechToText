<?php

if (!defined('MEDIAWIKI')) {
    die();
}
if (function_exists('wfLoadExtension')) {
    wfLoadExtension('SpeechToText');

    wfWarn( "Deprecated entry point to SpeechToText. Please use wfLoadExtension('SpeechToText').");

}
else
{
    die("MediaWiki version 1.25+ is required to use the SpeechToText extension");
}
?>
