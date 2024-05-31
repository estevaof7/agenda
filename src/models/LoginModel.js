const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = []; //vai controlar para não ser postado com algum erro
        this.user = null;
    }

    async login() {
        this.valida();
        if (this.errors.length > 0) return;
        
        this.user = await LoginModel.findOne({email: this.body.email});

        if(!this.user) {
            this.errors.push('Usuário não existe');
            return;
        }
        if (bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida');
            this.user = null;
            return;
        }

    }

    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();
        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        //isso vai fazer um tipo de criptografia da senha (não é criptografia mas é quase isso)
        //Então lá no MongoDB vai chegar uma senha totalmente diferente
        this.user = await LoginModel.create(this.body); //se o usuário for criado, vou poder acessá-lo
        //não precisa de try-catch pois ele já está sendo tratado no loginController
    
    }

    async userExists() {
        this.user = await LoginModel.findOne({email: this.body.email});
        if(this.user) this.errors.push('Usuário já existe');
    }

    valida() {
        this.cleanUp();

        //o email precisa ser válido
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
        // a senha precisa ter entre 3 e 50 caracteres

        if(this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres.')
        }
    }

    cleanUp() {
        for(const key in this.body) {
            if(typeof this.body[key] !== 'string') { //garantir que é tudo string
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
}

module.exports = Login;