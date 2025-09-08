const cloudinary = require('cloudinary').v2;

class ImageHelper{
    constructor(){
        cloudinary.config();
    };

    uploadimage = async (picture) =>{
        let uploadRes = await cloudinary.uploader.upload(picture);
        return uploadRes.secure_url;
    }



}

module.exports = { ImageHelper }