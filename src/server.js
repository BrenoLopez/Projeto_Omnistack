const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');


const app = express();
app.use(cors());

//Fazendo isto meu backend recebe requisições tanto por http quanto por web socket 
const server = require('http').Server(app);
const io = require('socket.io')(server);
///////////////////////////////////////////////////////////////////////////////////


//quando a aplicação for aberta no front gera uma conexao que recebe o socket 
io.on('connection', socket => {
    socket.on('connectionRoom' , box =>{
        socket.join(box);
    })
})
/////////////////////////////////////////////////////////////////////////////

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-a95mf.mongodb.net/omnistack?retryWrites=true',{
    useNewUrlParser: true
});

//passando informação global para a aplicação definindo nova variavel em req
//toda aplicação vai ter acesso a variavel io dentro de req  
app.use((req,res ,next)=>{
    req.io = io;
    return next();
});
///////////////////////////////////////////////////////////////////////////

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(require('./routes'));
app.use('/files', express.static(path.resolve(__dirname,'..','tmp')));

server.listen(process.env.PORT||3500, ()=>{
    console.log('Servidor Inciado!');
});
