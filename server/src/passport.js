const LocalStrategy = require('passport-local').Strategy;
const usersService = require('./api/services/usersService');
const bcrypt = require('bcrypt');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //match user
            usersService.findUsersByEmail(email)
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'That email is not registered' });
                    }

                    bcrypt.compare(password, user.rows[0].doc.password, function(err, isMatch) {
                            if(err) throw err;

                            if(isMatch) {
                                return done(null, user.rows[0].doc);
                            } else {
                                return done(null, false, { message: 'Password incorrect' });
                            }
                        });
                })
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
      });
      
      passport.deserializeUser((id, done) => {
          console.log(id)
        usersService.getUserById(id).then(() => {
          done(err, user);
        });
      });
}