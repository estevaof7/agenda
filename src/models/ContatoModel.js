const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: {type: Date, default: Date.now} //salvar a data que o usuário foi criado 
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) { //constructor function (mesa coisa que classes)
    this.body = body;
    this.errors = [];
    this.contato = null;
}

Contato.prototype.register = async function() {
    this.valida();

    if(this.errors.length > 0) return;

    this.contato = await ContatoModel.create(this.body);
}

Contato.prototype.valida = function() { 
    //prof disse que talvez alguma dessas verificações poderiam ter sido feitas no front-end com javascript mesmo
    //porque assim, ele posta a requisição, volta, redireciona em alguns momentos e talvez não precisava
    this.cleanUp();

    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
    if(!this.body.nome) this.errors.push('Nome é um campo obrigatório')
    if(!this.body.email && !this.body.telefone) {
        this.errors.push('Pelo menos um contato precisa ser enviado: E-mail ou telefone.')
    }
}

Contato.prototype.cleanUp = function() {
    for(const key in this.body) {
        if(typeof this.body[key] !== 'string') { //garantir que é tudo string
            this.body[key] = '';
        }
    }

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone
    }
}

Contato.prototype.edit = async function(id) {
    if(typeof id !== 'string') return;

    this.valida();
    if(this.errors.length > 0) {
        this.contato = await Contato.buscaPorId(id); 
        //prof só colocou return, mas como o meu não funcionou a rota 'back' lá no contatoController, tive que enviar o dado this.contato
        return;
    }

    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
}

//Métodos estáticos
Contato.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findById(id); 
    //Ou vai me retornar um usuário ou vai me retornar null
    //Não está atrelada ao prototype, então eu não precisa instanciar para utilizar essa função, seria como um método estático
    return contato;
}
Contato.buscaContatos = async function() {
    const contatos = await ContatoModel.find()
        .sort({ criadoEm: -1 }); 
    
    return contatos;
}
Contato.delete = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({_id: id});
    return contato;
}

module.exports = Contato;