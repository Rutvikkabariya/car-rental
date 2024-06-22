
module.exports = middleware = (req, res, next) => {
    
    // Authentication 
    if (req.session.user)
        next();
    else
    res.redirect('/login')
}