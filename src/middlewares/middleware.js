exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    //essas variáveisvão ser acessadas no ejs
    res.locals.user = req.session.user; //Para todas as rotas terem acesso ao usuário da sessão
    next();
}

exports.checkCsrfError = (err, req, res, next) => {
    if(err) {
        return res.render('404');
    }

    next();
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
}

exports.loginRequired = (req, res, next) => {
    if(!req.session.user) { //Se o usuário não estiver logado
        req.flash('errors', 'Você precisa fazer login.');
        req.session.save(() => res.redirect('/')); //Para salvar a sessão antes de redirecionar
        return; 
    } //Se passar daqui, quer dizer que o usuário está logado então eu posso mandar para o próximo middleware

    next();
};