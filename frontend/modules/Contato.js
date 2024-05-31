import validator from 'validator';

export default class Contato {
    constructor(formClass) { 
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }
    events() {
        if(!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        })
    }

    validate(e) {
        const el = e.target;

        const nomeInput = el.querySelector('input[name="nome"]');
        const emailInput = el.querySelector('input[name="email"]');
        const telefoneInput = el.querySelector('input[name="telefone"]');

        let error = false;

        if(nomeInput.value.length === 0) {
            this.errorMsg('Nome é um campo obrigatório', nomeInput);
            error = true;
        } else nomeInput.nextElementSibling && nomeInput.nextElementSibling.remove();

        if(emailInput.value.length === 0 && telefoneInput.value.length === 0) {
            this.errorMsg('Pelo menos um contato precisa ser enviado: E-mail ou telefone.', telefoneInput);
            error = true;
        } else if(!validator.isEmail(emailInput.value) && emailInput.value.length !== 0) {
            this.errorMsg('E-mail inválido', emailInput);
            telefoneInput.nextElementSibling && telefoneInput.nextElementSibling.remove();
            error = true;
        } else {
            telefoneInput.nextElementSibling && telefoneInput.nextElementSibling.remove();
            emailInput.nextElementSibling && emailInput.nextElementSibling.remove();
        }

        if(!error) el.submit();
    }

    errorMsg(msg, input) {
        if(!input.nextElementSibling) {
            const el = document.createElement('p');
            el.setAttribute('class', 'text-danger');
            el.innerText = msg;
            input.insertAdjacentElement('afterend', el);
        }
    }
}