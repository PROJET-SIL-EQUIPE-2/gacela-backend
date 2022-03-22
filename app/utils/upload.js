const pathlib = require("path");
const fs = require("fs");

const upload = (files) => {
    let uploadedFilePath;
    let uploadedFiles = [];
    for (let i = 0; i < files.length; i++) {
        let {
            originalname,
            path
        } = files[i];
        uploadedFilePath = path + pathlib.extname(originalname);
        uploadedFiles.push(uploadedFilePath);
        fs.rename(path, uploadedFilePath, (err) => {
            if ( err ){
                return {
                    error: err
                }
            }
        })
    }
    return uploadedFiles;
}
const deleteFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
        fs.unlink(files[i], (err) => {
            if ( err ){
                return {
                    error: err
                }
            }
        })
    }
}

module.exports = upload