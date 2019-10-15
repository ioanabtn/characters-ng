module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) { 
            return next();
        }

        const customError = {
            message: "You are not authenticated",
            status: 500
        }
        return next(customError);
    }
}