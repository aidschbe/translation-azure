export { Translator as default };
import FileManager from "./filemanager.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

// Usage:
// Documents: create translator (-> optionally upload glossary) -> upload files -> translate document -> download files -> delete files
// Text: create translator (-> optionally upload glossary) -> translate text
class Translator {

    // no args constructor using dotenv
    constructor() {
        dotenv.config();
        this.key = process.env.TRANSLATOR_KEY;
        this.textEndpoint = process.env.TRANSLATOR_TEXT;
        this.documentEndpoint = process.env.TRANSLATOR_DOCUMENTS;
        this.location = process.env.TRANSLATOR_LOCATION;

        this.glossary = process.env.GLOSSARY_URL;
        this.glossaryToken = process.env.GLOSSARY_TOKEN;
        this.source = process.env.SOURCE_URL;
        this.sourceToken = process.env.SOURCE_TOKEN;
        this.target = process.env.TARGET_URL;
        this.targetToken = process.env.TARGET_TOKEN;
    }

    // upload all files in given directory to source folder for translation
    uploadDirectoryToSource(fullDirectoryPath) {
        let files = new FileManager(this.source, this.sourceToken);
        files.uploadDirectoryContents(fullDirectoryPath);
    }

    // upload given single file to source folder for translation
    uploadFileToSource(fullFilePath) {
        let files = new FileManager(SOURCE_URL, SOURCE_TOKEN);
        files.uploadFile(fullFilePath)
    }

    // download all translated files from target folder
    downloadFilesFromTarget(downloadPath) {
        let files = new FileManager(this.target, this.targetToken);
        files.downloadAllFiles(downloadPath);
    }

    // delete all files in source and target containers
    deleteSourceAndTargetFiles() {
        let source = new FileManager(this.source, this.sourceToken);
        source.deleteAllFiles();

        let target = new FileManager(this.target, this.targetToken);
        target.deleteAllFiles();
    }

    // upload glossary file to glossary folder
    uploadGlossary(fullFilePath) {
        let files = new FileManager(this.glossary, this.glossaryToken);
        files.uploadFile(fullFilePath);
    }

    // translate a given text using text-api, for files use translateDocument()
    translateText(text, source_language, target_language,) {

        axios({
            baseURL: this.textEndpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': this.key,
                'Ocp-Apim-Subscription-Region': this.location,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'api-version': '3.0',
                'from': source_language,
                'to': target_language,
                'textType': 'html'
            },
            data: [{
                'text': text
            }],
            responseType: 'json'
        }).then(function (response) {
            // console.log(JSON.stringify(response.data, null, 4));

            console.log(response.data[0].translations[0].text);

            return response.data[0].translations[0].text;
        })
    }

    // translate all documents in source folder from source to target language, put translated files in target folder
    translateDocuments(source_language, target_language) {

        let route = '/batches';
        let endpoint = this.documentEndpoint + "/translator/text/batch/v1.1"

        let data = JSON.stringify({
            "inputs": [
                {
                    "source": {
                        "sourceUrl": this.source + "?" + this.sourceToken,
                        "storageSource": "AzureBlob",
                        "language": source_language
                    },
                    "targets": [
                        {
                            "targetUrl": this.target + "?" + this.targetToken,
                            "storageSource": "AzureBlob",
                            "category": "general",
                            "language": target_language,
                            "glossaries": [
                                {
                                    "glossaryUrl": `${this.glossary}/${source_language}-${target_language}-short.tsv?${this.glossaryToken}`,
                                    "format": "tsv"
                                }
                            ]
                        }]
                }]
        });

        let config = {
            method: 'post',
            baseURL: endpoint,
            url: route,
            headers: {
                'Ocp-Apim-Subscription-Key': this.key,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                let result = { statusText: response.statusText, statusCode: response.status, headers: response.headers };
                console.log()
                console.log(JSON.stringify(result, null, 2));
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    // test functions

    listGlossary() {
        let glossary = new FileManager(this.glossary, this.glossaryToken);
        glossary.listBlobs();
    }

    listSource() {
        let source = new FileManager(this.source, this.sourceToken);
        source.listBlobs();
    }

    listTarget() {
        let target = new FileManager(this.target, this.targetToken);
        target.listBlobs();
    }
}