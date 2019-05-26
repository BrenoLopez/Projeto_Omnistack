const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    //indico pasta onde o arquivo vai   
    dest: path.resolve(__dirname,'..','..','tmp'),
    // indico qual tipo de armazenamento irei usar 
    storage: multer.diskStorage({
        //coloco destino para onde o arquivo vai e qual nome ele deve ter 
        destination:  (req, file, cb)=>{
            cb(null,path.resolve(__dirname,'..','..','tmp'));
        },
        filename: (req, file, cb)=>{
            
            crypto.randomBytes(16, (err, hash)=>{
                if(err) cb(err);

                file.key = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, file.key);
            })
        }
    })
};