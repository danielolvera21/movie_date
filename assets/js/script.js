// *** START PSEUDO CODE *** //

// create a click handler for the 'love calculation button' (MVP)
// on click, trigger modal to display (MVP)
// When user submits names:
// store user inputs for first names (MVP)
// pass as parameters to run through the love calculator API fetch (MVP)
// push the names to the js object (MVP)
// save js object to local storage (MVP)
// display the couple name in the history section by adding as a button element (MVP)
// display calculating love graphic (NON MVP)
// have fade/disappear after a few seconds (NON MVP)
// display love percentage (MVP)
// add css class dynamically to style the display based on what percentage range it falls into (NON MVP)
// based on the percentage, pull the genre associated with that percentage (MVP)
// pass that genre through the TMDB API fetch as parameter to pull a randomized list of 10? movie titles (MVP)
// push those titles to an array (MVP)
// create a for loop to iterate over the array and pass the movie title name through the OMDB API fetch (http://www.omdbapi.com/ for documentation) to pull all imdb movie IDs  (MVP)
// push those imdb movie ids to a new array (MVP)
// create a for loop to iterate over the new array and pass the IMDB movie IDs through the TMDB API fetch to pull the image file path for each poster  (MVP)
// push the file paths to a new array (MVP)
// create a for loop to create the img element using the file path as the 'src' attribute (MVP)
// append to page (MVP)
// When user clicks movie poster image:
// open a new tab to the IMDB movie page (url syntax: https://www.imdb.com/title/<imdb movie ID> ) (NON MVP)
// have a modal pop up that shows: 
// what streaming platforms its on (MVP if possible)
// If in 'now playing' - show release date, maybe a link to fandango to so they can search if movie is playing around them (NON MVP)
// When user refreshes/revisits page getItems from local storage and recreate the search history couples (MVP)

// *** END PSEUDO CODE *** //        

// *** GLOBAL VARIABLES START *** //

// create empty movie titles array
let movieTitlesArray = [];
// API key for The Movie Database
const tmdbAPIKey = '1363fbaac30c0fbba8280edaf170a171';
const tmdbImgSrcUrl = 'https://image.tmdb.org/t/p/original/'; // we can adjust the 'original' size call by various sizes if adjusting with CSS makes it look weird.

// *** GLOBAL VARIABLES END *** //

// generate a random number between min and (max - min)
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// for testing purposes I've pulled Step Brothers imdb movie ID
const imdbMovieID = '834500'


// To display the image we retreive from TMDB API to DOM
fetch('https://api.themoviedb.org/3/movie/' + imdbMovieID + '/images?api_key=' + tmdbAPIKey + '&language=en-US&include_image_language=en,null')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log('img url: ', data);
                // pull img file path for the highest rated image (index 0)
                const tmdbImgPath = data.posters[0].file_path;
                // create img element and append to body of DOM
                let imgEL = document.createElement('img');
                imgEL.setAttribute('src', tmdbImgSrcUrl + tmdbImgPath);

                document.querySelector('body').appendChild(imgEL);
            })
        }

    })

// pull list of genres with ids
fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=" + tmdbAPIKey + "&language=en-US")
    .then(function (response) {
        if (response.ok) {
            response.json()
                .then(function (data) {
                    console.log('genre id: ', data);
                })
        }
    })


// push 5 random movie titles from 5 random pages to the movieTitlesArray


for (var i = 0; i < 5; i++) {
    // to generate a random page number from 1 - 500
    let randomPage = randomNum(1, 501);
    // to generate a random result index from 0 - 19
    let randomResult = randomNum(0, 20);
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=" + tmdbAPIKey + "&language=en-US&sort_by=popularity.desc&with_genres=10749&with_original_language=en&include_adult=true&page=" + randomPage)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log('movie title: ', data);
                    console.log(data.results[randomResult].backdrop_path)

                    if (data.results[randomResult].backdrop_path) {
                        movieTitlesArray.push(data.results[randomResult].title)
                        console.log(movieTitlesArray);
                    } 
                })
            }
        })
}



// love calc fetch
fetch("https://love-calculator.p.rapidapi.com/getPercentage?fname=Bleakney&sname=Bob", {
    "method": "GET",
    "headers": {
        "x-rapidapi-key": "0b6124141dmsh2d9b8cd35806733p134e12jsn5b6d5b327fcd",
        "x-rapidapi-host": "love-calculator.p.rapidapi.com"
    }
})
    .then(response => {
        response.json()
            .then(function (data) {
                console.log('love calculator: ', data)
            })
    })
    .catch(err => {
        console.error(err);
    });

