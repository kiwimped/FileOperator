const express = require('express');
const app = express();
const port = 3000;
const methodOverride = require('method-override')

app.use(express.urlencoded());
app.use(express.json());
app.set('view engine','ejs'); 

app.engine('ejs', require('ejs').__express);
app.use(methodOverride('_method'))

app.use((req,res,next) =>{
console.log(`${req.method} request for ${req.url}`);
next()
})


const shopping = [
    { id: 1, name: 'Orange Juice' },
    { id: 2, name: 'Pizza Pockets' },
    { id: 3, name: 'Box of Eggs' },
]

app.get('/', (req, res) =>{
    res.send(`<button ><a href="/api/shopping""> shopping </a> </button> <button ><a href="/api/shopping/add""> add Grocery </a> </button>`)
})


app.get('/api/shopping', (req,res) =>{
  res.render("shopping.ejs", {shopping})
})



app.get('/api/shopping/add', (req,res) =>{
    res.render('shoppingForm.ejs');
})


// we will continue this on thusday
app.get('/api/shopping/add/:id', (req,res) =>{
    res.render('updateShopping.ejs');
})

app.post('/api/shopping', (req, res)=>{

    console.log(req.body.name);

    const newWorkout ={
    id:shopping.length + 1,
    name: req.body.name
    };

    shopping.push(newWorkout);
    res.redirect('/api/shopping');

})


// Define a PUT route handler for updating a workout.
app.post('/api/shopping/update/:id', (req, res) => {
  console.log("fired put");
  const shoppingId = parseInt(req.params.id);
  const updatedName = req.body.name;

  const shop = shopping.find(w => w.id === shoppingId);

  if (shop) {
    shop.name = updatedName;
    res.status(200).send(`Shopping item with ID ${shoppingId} updated.`);
  } else {
    res.status(404).send(`Shopping item with ID ${shoppingId} not found.`);
  }
  });
 


// Define a DELETE route handler for deleting a workout.
app.post('/api/shopping/delete/:id', (req, res) => {
    const shoppingId = parseInt(req.params.id);

    const index = shopping.findIndex(s => s.id === shoppingId);

    if (index !== -1) {
      shopping.splice(index, 1);
    //   res.status(200).send(`Workout with ID ${workoutId} deleted.`);
      res.redirect('/api/shopping')
    } else {
      res.status(404).send(`shopping item with ID ${shoppingId} not found.`);
    }
  });

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
})

