const passport = require('passport');
const User = require('./models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = "345154522511-ig6vorp7s91n5jm2iom9m9t765qafh83.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://sociosync.onrender.com/api/auth/google/callback"
  // callbackURL: "/api/auth/google/callback"
},
  async (accessToken, refreshToken, profile, done)=> {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
   
    
    const getuser = await User.findOne({email: profile.emails[0].value})
    //No user was found... so create a new user with values from Facebook (all the profile. stuff)
    if (!getuser) {
      newUser = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
        password: profile.id,
      });
      await newUser.save();
      console.log("User created")
      return done(null, newUser);
    } else {
      //found user. Return
      return done(null, getuser);
    }

  }
));

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})
