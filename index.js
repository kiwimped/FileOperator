import express from 'express';
const app = express();
const port = 3000;
import methodOverride from 'method-override';
import ejs from 'ejs';

import { MongoClient } from 'mongodb';
const uri = "mongodb://127.0.0.1:27017/"


let db;

(async function() {
    try {
      const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
      console.log('Connected to MongoDB.');
      db = client.db("expressTexr");

    } catch (err) {
      console.error('Error occurred while connecting to MongoDB:', err);
    }
})();

const workouts = [
  { id: 1, name: 'Pushups' },
  { id: 2, name: 'Situps' },
  { id: 3, name: 'Jogging' },
]



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

app.post('/api/workouts', (req, res) => {
  const { name } = req.body;

  const newWorkout = {
    name,
  };

  const collection = db.collection('workouts');
  collection.insertOne(newWorkout, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error saving to database');
      return;
    }
    console.log('Saved to database');
  });
  res.redirect('/api/workouts');
});

app.get('/api/workouts', async (req, res) => {
  try {
      const collection = db.collection('workouts');
      const workouts = await collection.find({}).toArray();
      res.render("workouts",{workouts});
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