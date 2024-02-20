export { FileManager as default };
import { ContainerClient } from "@azure/storage-blob";
import * as path from 'node:path';
import * as fs from 'fs';

class FileManager {

    constructor(SAS_URL, SAS_token) {
        this.SAS_URL = SAS_URL;
        this.SAS_token = SAS_token
    }

    // hashtag denotes private variable/function in js
    #connectToContainer() {
        try {
            return new ContainerClient(`${this.SAS_URL}?${this.SAS_token}`);
        } catch (error) {
            console.err(`Error: ${error.message}`);
        }
    }

    // mainly for testing purposes
    async listBlobs() {

        let container = this.#connectToContainer();

        for await (const blob of container.listBlobsFlat()) {

            // Get Blob Client from name, to get the URL
            const tempBlockBlobClient = container.getBlockBlobClient(blob.name);

            // Display blob name and URL
            console.log(
                `\tname: ${blob.name}\n\t`
            );
        }
    }

    // uploads all files in a folder, currently regardless of filetype
    uploadDirectoryContents(fullDirectoryPath) {

        let dirPath = path.resolve(fullDirectoryPath);

        let dirContents = fs.readdirSync(dirPath);

        dirContents.forEach(element => {

            let filepath = `${dirPath}\\${element}`;

            if (fs.statSync(filepath).isFile()) {

                this.uploadFile(filepath)
            }
        }
        );
    }

    // overwrites existing files of the same name
    uploadFile(fullFilePath) {

        let filepath = path.resolve(fullFilePath);

        let container = this.#connectToContainer();

        const blobName = path.basename(fullFilePath);

        const newBlob = container.getBlockBlobClient(blobName);

        newBlob.uploadFile(filepath);

    }

    // overwrites existing files of the same name
    downloadFile(fileName, downloadFolder) {

        let dir = path.resolve(downloadFolder);
        let filepath = `${dir}\\${fileName}`

        let container = this.#connectToContainer();

        let blob = container.getBlobClient(fileName);

        blob.downloadToFile(filepath);

    }

    async downloadAllFiles(downloadFolder) {

        let container = this.#connectToContainer();

        for await (const blob of container.listBlobsFlat()) {

            this.downloadFile(blob.name, downloadFolder);
        }
    }

    deleteFile(filename) {

        const options = {
            deleteSnapshots: 'include' // or 'only'
        }

        let container = this.#connectToContainer();

        let blob = container.getBlockBlobClient(filename);

        blob.deleteIfExists(options);

    }

    async deleteAllFiles() {

        let container = this.#connectToContainer();

        for await (const blob of container.listBlobsFlat()) {

            this.deleteFile(blob.name);
        }
    }


}



