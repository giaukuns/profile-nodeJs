const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const opts = {};
const User = require("../models/User/user.model");
const jwt = require("jsonwebtoken");

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = `${process.env.JWT_PRIVATE_KEY}`;

module.exports = (passport) => {
  passport.use(
    new JWTStrategy(opts, (payload, done) => {
      User.findOne({ email: payload.email })
        .then((user) => {
          if (!user) return done(null, false);
          return done(null, user);
        })
        .catch((err) => JSON.stringify(err));
    })
  );
};
