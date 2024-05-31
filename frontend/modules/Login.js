import validator from 'validator';

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if(!this.form) return; //Se o form não existe, return
        this.form.addEventListener('submit', e => {
            e.preventDefault(); //não envia o formulário
            this.validate(e);
        });
    }

    validate(e) {
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]');
        const passwordInput = el.querySelector('input[name="password"]');
        const emailError = el.querySelector('.email-error');
        const passwordError = el.querySelector('.password-error');
        let error = false;

        this.clear(emailError, passwordError);

        if(!validator.isEmail(emailInput.value)) {
            emailError.innerHTML = 'Email inválido';
            error = true;
        }
        if(passwordInput.value.length < 3 || passwordInput.value.length > 50) {
            passwordError.innerHTML = 'Senha precisa ter entre 3 e 50 caracteres';
            error = true;
        }

        if(!error) el.submit();
    }

    clear() {
        for(let argument of arguments) {
            argument.innerHTML = '';
        }
    }
}   