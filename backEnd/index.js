import express from 'express';
const app = express();
const port = 3001;
import methodOverride from 'method-override';
import ejs from 'ejs';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import "dotenv/config"
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { Int32 } from 'mongodb';
app.use(cors());
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};
app.post('/addWorkout', ensureAuthenticated, /* existing code */);
app.delete('/deleteWorkout', ensureAuthenticated, /* existing code */);

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.sendStatus(401); // No token, unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};
app.get('/getWorkouts', verifyToken, /* existing code */);
 
app.use(express.urlencoded());
app.use(express.json());
app.set('view engine', 'ejs');
app.engine('ejs', ejs.renderFile);
//app.engine('ejs', require('ejs').__express);
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());





mongoose.connect('mongodb://127.0.0.1:27017/ExpressTest')
  .then(() => console.log('Connected to MongoDB using Mongoose'))
  .catch(err => console.log('Could not connect to MongoDB', err));

const workoutSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  img: String,
  cost: Number
});

const Workout = mongoose.model('shoppings', workoutSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema);
passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await User.findOne({ username: username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    return done(null, user);
  }
));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user);
  } catch (err) {
      done(err);
  }
});



app.get('/register', (req, res) => {
  res.render('register');
});
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({ username: req.body.username, password: hashedPassword });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    res.redirect('/register');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  console.log(req.user);
  res.redirect('/');

});
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/logout', (req, res) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
  });
});


app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next()
})

app.get('/', (req, res) => {
  res.render('index',{user:req.user})
})

app.get('/api/workouts/add', (req, res) => {
  res.render('workoutForm.ejs');
  
})
app.get('/api/workouts/add2', (req, res) => {
  res.render('workoutForm2.ejs');
  
})

app.get('/api/workouts/subtract', (req, res) => {
  res.render('workoutDelete.ejs');
})

// we will continue this on thusday
app.get('/api/workouts/add/:id', (req, res) => {
  res.render('updateWorkout.ejs');
})

app.post('/api/workouts', async (req, res) => {
  const { name } = req.body;
  const { quantity } = req.body;
  const { img } = req.body
  const { cost } = req.body
  const workout = new Workout({
    name, quantity, img, cost
  });
  
  try {
    const result = await workout.save();
    console.log('Saved to database:', result);
    res.redirect('/workouts');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error saving to database');
  }
});

app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find();

    // Check the Accept header to determine the response type
    const acceptHeader = req.get('Accept');
    if (acceptHeader && acceptHeader.includes('text/html')) {
      // Send HTML for browser requests
      res.render('workouts', { workouts });
    } else {
      // Send JSON for other requests
      res.json({ workouts });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching from the database');
  }
});

app.get('/checkout', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.render('checkout',{workouts})
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching from database');
    
  }
  
});



// Define a PUT route handler for updating a workout.
app.put('/api/workouts/update/:id', (req, res) => {
  console.log("fired put");
  const workoutId = parseInt(req.params.id);
  const updatedName = req.body.name;
  const updatedQuantity = req.body.quantity;
  const updatedImg = req.body.img;
  const updatedCost = req.body.cost;
  const workout = Workout.find(w => w.id === workoutId);

  if (workout) {
    workout.name = updatedName;
    workout.quantity = updatedQuantity;
    workout.img = updatedImg;
    workout.cost = updatedCost;
    res.status(200).send(`Workout with ID ${workoutId} updated.`);
  } else {
    res.status(404).send(`Workout with ID ${workoutId} not found.`);
  }
});


// Define a DELETE route handler for deleting a workout.
app.delete('/api/workouts/delete/:id', (req,res)=>{

const workoutId = parseInt(req.params.id);

const index = Workout.findIndex(w => w.id === workoutId);
try{
if(index !==-1){
    Workout.splice(index,1);
    // res.status(200).send(`Workout with ID ${workoutId} deleted.`)
    res.redirect('/api/workouts/')
}else{
    res.status(404).send(`Workout with ID ${workoutId} not found.`)
}
}catch(error){
  console.error(error);
  res.status(500).send('Error Delete Workout from Database')
}
})
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
})
