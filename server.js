//import dependencies

const express = require("express")
const app = express()
const mysql = require('mysql2');
const dotenv = require('dotenv')


app.get('', (req,res) =>{
    res.send("Good evening!.")
})

// configure environment variables
dotenv.config();

// create a connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


// test the connection
db.connect((err) => {
    // connection is not successful
    if(err) {
        return console.log("Error connecting to the database: ", err)
    }

    // connection is successful
    console.log("Successfully connected to MySQL: ", db.threadId)
})

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



// retrieve all patients
app.get('/get-patients', (req, res) => {
    const getPatients = "SELECT patient_id, first_name, last_name FROM patients"
    db.query(getPatients, (err, results) => {
        // if I have an error 
        if(err) {
            return res.status(400).send("Failed to get patients", err)
        }

        // res.status(200).render('data', { data })
        res.status(200).send(results)
    })
})

// GET endpoint to retrieve all providers
app.get('/providers', (req, res) => {
  const getProviders = 'SELECT first_name, last_name, provider_specialty FROM providers';
  
  db.query(getProviders, (error, results) => {
      if (error) {
          return res.status(400).send("Failed to get providers", err)
      }
      res.status(200).send(results)
  });
});


// GET endpoint to retrieve patients by first name
app.get('/patients/by-name', (req, res) => {
    const firstName = req.query.first_name; 

    if (!firstName) {
        return res.status(400).send({ error: 'First name is required' });
    }

    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    
    db.query(query, [firstName], (error, results) => {
        if (error) {
            return res.status(400).send ({ error: error.message });
        }
        res.status(200).send(results);
    });
});

//Create a GET endpoint that retrieves all providers by their specialty

app.get('/providers/by-specialty', (req, res) => {
    const specialty = req.query.specialty;

    if (!specialty) {
        return res.status(400).send({ error: 'Specialty is required' });
    }

    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    
    db.query(query, [specialty], (error, results) => {
        if (error) {
            return res.status(400).send({ error: error.message });
        }
        res.status(200).send(results);
    });
});




//start and listen to the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)
})



