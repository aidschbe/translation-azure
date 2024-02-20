import Translator from "./translator.js";

// filepaths
let glossary = "c:/temp/eng-ger.tsv";
let source = "C:/temp/untranslatedTexts/";
let downloads = "C:/temp/downloads";

const translator = new Translator();

// upload glossary
// translator.uploadGlossary(glossary);

// upload source files
// translator.uploadDirectoryToSource(source);

// translate files
// translator.translateDocument("de", "en");

// download translated files
// translator.downloadFilesFromTarget(downloads);

// delete source + target files
// translator.deleteSourceAndTargetFiles();

// check container contents
// translator.listGlossary();
// translator.listSource();
translator.listTarget();


// translate text
let result = translator.translateText("das ist ein test", "de", "en");
console.log(result);