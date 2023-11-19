import express from 'express';
const app = express();
const port = 3000;
import methodOverride from 'method-override';
import ejs from 'ejs';

import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/ExpressTest-Copy'
mongoose.connect('mongodb://127.0.0.1:27017/ExpressTest-Copy')
  .then(() => console.log('Connected to MongoDB using Mongoose'))
  .catch(err => console.log('Could not connect to MongoDB', err));

const workoutSchema = new mongoose.Schema({
  name: String
});


const Workout = mongoose.model('shopping', workoutSchema);



app.use(express.urlencoded());
app.use(express.json());
app.set('view engine', 'ejs');


app.engine('ejs', ejs.renderFile);
//app.engine('ejs', require('ejs').__express);
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next()
})




app.get('/', (req, res) => {
  res.send(`<button ><a href="/api/workouts""> shopping </a> </button> <button ><a href="/api/workouts/add""> add shopping item </a> </button> <button><a href="/api/workouts/subtract"> remove shopping item</a></button> `)
})



app.get('/api/workouts/add', (req, res) => {
  res.render('workoutForm.ejs');
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

  const workout = new Workout({
    name
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
    res.render('workouts',{workouts})
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

  const workout = workouts.find(w => w.id === workoutId);

  if (workout) {
    workout.name = updatedName;
    res.status(200).send(`Workout with ID ${workoutId} updated.`);
  } else {
    res.status(404).send(`Workout with ID ${workoutId} not found.`);
  }
});


// Define a DELETE route handler for deleting a workout.
app.delete('/api/workouts/delete/:id', (req, res) => {
  const workoutId = parseInt(req.params.id);

  const index = workouts.findIndex(w => w.id === workoutId);

  if (index !== -1) {
    workouts.splice(index, 1);
    res.status(200).send(`Workout with ID ${workoutId} deleted.`);
    res.redirect('/api/workouts')
  } else {
    res.status(404).send(`Workout with ID ${workoutId} not found.`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
})