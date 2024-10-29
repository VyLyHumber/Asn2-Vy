
/******************************************************************************
***
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Vy Ly Student ID: N01600569 Date: 28 Otc 2024
*
*
******************************************************************************
**/
// Load necessary modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();
const port = 5500;

// Load JSON data
let jsonData;
fs.readFile(path.join(__dirname, 'movieData.json'), 'utf8', (err, data) => {
    if (err) throw err;
    jsonData = JSON.parse(data);
    console.log('JSON data loaded successfully');
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up Handlebars Asn2
/* step8 */
/*
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: {
        isMetascorePresent: function(metascore) {
            return metascore && typeof metascore === 'string' && metascore.trim() !== ""; // Kiểm tra nếu metascore không rỗng
        }
    }
}));
app.set('view engine', 'hbs');
*/
/* step 9 */
/*
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: {
        highlightMetascore: function(metascore) {
            // Check if metascore is a string and handle it accordingly
            if (typeof metascore === 'string') {
                return metascore.trim() === "" || metascore.trim() === "N/A" ? 'highlight' : '';
            }
            // If metascore is not a string (e.g., null or undefined), do not highlight
            return '';
        }
    }
}));
*/
/* step 10 */
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        highlightMetascore: function(metascore) {
            return (typeof metascore === 'string' && (metascore.trim() === "" || metascore.trim() === "N/A")) ? 'highlight' : '';
        }
    },
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'hbs');

// Step 2: Home route
/*
app.get('/', (req, res) => {
    res.render('index', { title: 'Home', name: 'Vy Ly', studentId: 'N01600569' });
});*/
app.get('/', (req, res) => {
    res.render('index', { title: 'Home', name: 'Vy Ly', studentId: 'N01600569' });
});

// Step 4: Data route
app.get('/data/', (req, res) => {
    res.render('data', { title: 'Movie Data', jsonData });
});

// Step 5: Movie ID route
app.get('/data/movie/:index', (req, res) => {
    if (!jsonData) {
        return res.status(500).send('JSON data not loaded yet.');
    }

    const index = parseInt(req.params.index, 10);
    if (!isNaN(index) && index >= 0 && index < jsonData.length) {
        const movie = jsonData[index];
        res.render('data', { title: 'Movie Details', jsonData: [movie] });
    } else {
        res.status(404).send('Cannot find movie id.');
    }
});

// Step 6: Movie ID search route
app.get('/data/search/id/', (req, res) => {
    res.render('searchID', { title: 'Search by Movie ID' });
});

app.post('/data/search/id/', (req, res) => {
    const movieID = parseInt(req.body.movie_id, 10);
    if (!jsonData) {
        return res.status(500).send('JSON data not loaded yet.');
    }

    const result = jsonData.find(movie => movie.Movie_ID === movieID);
    if (result) {
        res.render('data', { title: 'Movie Information', jsonData: [result] });
    } else {
        res.status(404).send('Cannot find movie id.');
    }
});

// Step 7: Movie Title search route
app.get('/data/search/title/', (req, res) => {
    res.render('searchTitle', { title: 'Search by Movie Title' });
});

app.post('/data/search/title/', (req, res) => {
    const movieTitle = req.body.movie_title.toLowerCase();
    if (!jsonData) {
        return res.status(500).send('JSON data not loaded yet.');
    }

    const foundMovies = jsonData.filter(movie => 
        movie.Title.toLowerCase().includes(movieTitle)
    );

    if (foundMovies.length > 0) {
        res.render('data', { title: 'Search Results', jsonData: foundMovies });
    } else {
        res.status(404).send('Cannot find movies with that title.');
    }
});

// Step 7 - ASN2: Display all movie data in a table

// Step 8 - ASN2
/*
app.get('/allData', (req, res) => {
    if (!jsonData) {
        return res.status(500).send('JSON data not loaded yet.');
    }
    const filteredData = jsonData.filter(movie => 
        movie.Metascore && typeof movie.Metascore === 'string' && movie.Metascore.trim() !== ""
    );
    res.render('allData', { title: 'All Movies', jsonData: filteredData });
});*/
// Step 9 - ASN2
app.get('/allData', (req, res) => {
    if (!jsonData) {
        return res.status(500).send('JSON data not loaded yet.');
    }
    res.render('allData', { title: 'All Movies', jsonData });
});

// Step 3: 404 error handling
app.use((req, res) => {
    res.status(404).send('Error 404: Page not found');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
