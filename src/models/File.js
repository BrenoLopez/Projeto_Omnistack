const mongoose = require('mongoose');

const File = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true
         }
     },
    {
        //toda vez que o arquivo for convertido em json ou objeto carregar o file.virtual automaticamente 
        timestamps : true,
        toObject: {virtuals:true},
        toJSON : {virtuals: true}
});
//campo virtual 
//não existe no banco de dados mas existe aqui no codigos
File.virtual('url').get(function(){
      const url = process.env.URL||'http://localhost:3500';
    return `${url}/files/${encodeURIComponent(this.path)}`;
})
module.exports = mongoose.model("File",File);