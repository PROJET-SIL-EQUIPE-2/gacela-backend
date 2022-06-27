const pathlib = require("path");
const fs = require("fs");

const upload = (file) => {
    if (file){
        let uploadedFilePath;
        let {originalname, path} = file;
        uploadedFilePath = path + pathlib.extname(originalname);
        fs.rename(path, uploadedFilePath, (err) => {
            if ( err ){
                return {
                    error: err
                }
            }
        })
        console.log(pathlib.extname(originalname))
        console.log(pathlib.basename(uploadedFilePath))
        return {name: pathlib.basename(uploadedFilePath), ext: pathlib.extname(originalname)};
    }
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