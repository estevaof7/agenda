const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
    res.render('contato', {
        contato: {} //se for um novo contato, o value dos inputs ficará em branco, se for editar, o value dos inputs vão receber os dados embaixo no método editIndex 
    });
};

exports.register = async (req, res) => { //async por causa do Contato.register
    try {
        const contato = new Contato(req.body);
        await contato.register();
        
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('index'));
            //prof colocou a rota 'back' mas por algum motivo, no meu não funcionou
            return; 
        }

        req.flash('success', 'Contato registrado com sucesso.');
        req.session.save(() => res.redirect('/contato/index')); 
        return; 
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};
exports.editIndex = async (req, res) => {
    if(!req.params.id) return res.render('404'); //se não for enviado um id nos parâmetros

    const contato = await Contato.buscaPorId(req.params.id);

    if(!contato) res.render('404');

    res.render('contato', { contato }); //Estou injetanto, em outras palavras, estou dizendo "contato: contato"
}
exports.edit = async (req, res) => {
    try {
        if(!req.params.id) return res.render('404');
    
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);
    
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`)); 
            //prof colocou a rota 'back' mas por algum motivo, no meu não funcionou
            return; 
        }
    
        req.flash('success', 'Contato editado com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`)); 
        return; 
    
    } catch (e) {
        console.log(e);
        res.render('404');    
    }
}
exports.delete = async (req, res) => {
    if(!req.params.id) return res.render('404'); 

    const contato = await Contato.delete(req.params.id);

    if(!contato) res.render('404');

    req.flash('success', 'Contato apagado com sucesso.');
    req.session.save(() => res.redirect('back')); 
    return; 
}