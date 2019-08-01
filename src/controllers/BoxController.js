const Box = require('../models/Box');

class BoxController {
  
  async  store(req,res){    
    const box = await Box.create(req.body);
       
        return res.json(box);

    }


    async show(req,res){
      //populate trás todos os dados do meu relacionamento 
      // options : sort faz a ordenação decrescente dos arquivos que foram inseridos
      // de cima para baixo   
    const box = await Box.findById(req.params.id).populate({
      path: 'files',
      options: {sort: { createdAt : -1}}
});       
    return res.json(box);

    }

}


module.exports = new BoxController;