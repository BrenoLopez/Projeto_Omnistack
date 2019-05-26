const File = require('../models/File');
const Box = require('../models/Box');
class FileController {
  async  store(req,res){
        //criar um arquivo 
        const box =  await Box.findById(req.params.id);

        const file = await File.create({
            title: req.file.originalname,
            path: req.file.key
        });

        box.files.push(file);        
        await box.save();
        //pega todos os usuarios conectados na aplicação em determinada box com o id 
        //envia informações com dados do arquivo sincronizando web e mobile em tempo real 
        req.io.sockets.in(box._id).emit('file',file);
        
        return res.json(file);
    }
}

module.exports = new FileController;