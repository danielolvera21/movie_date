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
// create an empty array for movie titles
let movieTitlesArray = [];
// create an empty array for watch providers
let watchProviderArray = [];
// create an empty array that'll combine the two above arrays to key:value pairs respectively
let movieObject = {};

// CREATE JSON for data storage
let userOutputJSON = [
    //   { loveCalcResults: [], posters: [] },
    //   { loveCalcResults: [], posters: [] },
    //   { loveCalcResults: [], posters: [] },
    //   { loveCalcResults: [], posters: [] },
    //   { loveCalcResults: [], posters: [] },
];
// API key for The Movie Database
const tmdbAPIKey = "1363fbaac30c0fbba8280edaf170a171";
const tmdbImgSrcUrl = "https://image.tmdb.org/t/p/w500"; // we can adjust the 'w500' size call by various sizes if adjusting with CSS makes it look weird.
// love calc modal inputs and submit button
let modalElement = document.querySelector("#modal-close-outside");
let firstNameInputElement = document.querySelector("#nameInput1");
let secondNameInputElement = document.querySelector("#nameInput2");
let loveCalcButtonElement = document.querySelector("#modal-close-outside #loveCalcButton");
const jumbotronEndElement = document.querySelector('#jumbotronEnd');
let previouslySearchedElement = document.querySelector("#previouslySearched");
let previousResultsButtonElements = document.getElementsByClassName("previousResultsButtons");


let triggerModalElement = document.querySelector("#calculateButton");
let modal = UIkit.modal("#modal-close-outside");
let tryAgainButtonElement = document.createElement("button");
// *** GLOBAL VARIABLES END *** //

// generate a random number between min and (max - min)
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// love calc modal form submission handler
let modalFormSubmitHandler = function (event) {
    event.preventDefault();
    // retrieve names from user inputs
    let userName = $("#nameInput1").val();
    let partnerName = $("#nameInput2").val();
    if (userName && partnerName) {
        // hide the modal
        UIkit.modal(modalElement).hide();
        //remove existing h3 if exists
        jumbotronEndElement.innerHTML = '';
        // remove existing image elements from carousell
        var imgElements = document.querySelectorAll("img"); // HTMLCollection
        for (var i = 0; i < imgElements.length; i++) {
            var img = imgElements[i];
            img.parentNode.removeChild(img);
        }
        calculateCompatibility(userName, partnerName);
        firstNameInputElement.value = "";
        secondNameInputElement.value = "";
        modal.hide();
    } else {
        modal.show();
        alert("error")
        // NON-MVP GOAL: send to a function that turns the input box borders red and shakes them, then prompts user to try again
    }
};
$("#loveCalcButton").click(modalFormSubmitHandler);

// love calc fetch
function calculateCompatibility(name1, name2) {
    fetch(
        "https://love-calculator.p.rapidapi.com/getPercentage?fname=" +
        name1 +
        "&sname=" +
        name2,
        {
            method: "GET",
            headers: {
                "x-rapidapi-key": "0b6124141dmsh2d9b8cd35806733p134e12jsn5b6d5b327fcd",
                "x-rapidapi-host": "love-calculator.p.rapidapi.com",
            },
        }
    )
        .then((response) => {
            response.json().then(function (data) {
                // check percentage amount to determine which genre to use in getMovieTitles
                if (data.percentage >= 0 && data.percentage < 26) {
                    let genreId = 27;
                    let genreName = "Horror";
                    getMovieTitles(
                        genreId,
                        data.fname,
                        data.sname,
                        data.percentage,
                        genreName
                    );
                    changeDisplay(data.fname, data.sname, data.percentage, genreName);
                } else if (data.percentage >= 26 && data.percentage < 51) {
                    let genreId = 18;
                    let genreName = "Drama";
                    getMovieTitles(
                        genreId,
                        data.fname,
                        data.sname,
                        data.percentage,
                        genreName
                    );
                    changeDisplay(data.fname, data.sname, data.percentage, genreName);
                } else if (data.percentage >= 51 && data.percentage < 76) {
                    let genreId = 53;
                    let genreName = "Action";
                    getMovieTitles(
                        genreId,
                        data.fname,
                        data.sname,
                        data.percentage,
                        genreName
                    );
                    changeDisplay(data.fname, data.sname, data.percentage, genreName);
                } else {
                    let genreId = 10749;
                    let genreName = "Romance";
                    getMovieTitles(
                        genreId,
                        data.fname,
                        data.sname,
                        data.percentage,
                        genreName
                    );
                    changeDisplay(data.fname, data.sname, data.percentage, genreName);
                }
            });
        })
        .catch((err) => {
            console.error(err);
        });
}

// push 5 random movie titles from 5 random pages to the movieTitlesArray
// TO DO: add back genreId parameter to function below
async function getMovieTitles(genreId, name1, name2, percentage, genreName) {
    let loveCalcResultsObj = { loveCalcResults: [], posters: [] };
    loveCalcResultsObj.loveCalcResults.push(name1, name2, percentage, genreName);
    //   userOutputJSON[0].loveCalcResults.push(name1, name2, percentage, genreName);
    for (var i = 0; i < 7; i++) {
        // to generate a random page number from 1 - 500
        let randomPage = randomNum(1, 6);
        // to generate a random result index from 0 - 19
        let randomResult = randomNum(0, 20);
        // await call makes the fetch call synchronous
        const response = await fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=" +
            tmdbAPIKey +
            "&language=en-US&sort_by=popularity.desc&with_genres=" +
            genreId +
            "&with_original_language=en&include_adult=true&page=" +
            randomPage
        );

        if (response.ok) {
            const data = await response.json();
            // pull movie title from data object
            const movieTitle = data.results[randomResult].title;
            // if has an image url, push the movie title to the movieTitlesArray
            if (data.results[randomResult].poster_path && !movieTitlesArray.includes(movieTitle)) {
                // pull movie ID from data object
                const movieId = data.results[randomResult].id;

                // push movie title to movieTitlesArray
                movieTitlesArray.push(movieTitle);
                // pull watch provider data
                const streamingResponse = await fetch(
                    "https://api.themoviedb.org/3/movie/" +
                    movieId +
                    "/watch/providers?api_key=1363fbaac30c0fbba8280edaf170a171"
                );

                if (streamingResponse.ok) {
                    const streamingData = await streamingResponse.json();
                    if (!streamingData.results.US) {
                        const watchProvider =
                            "Not Available to stream or rent on digital platforms";
                        watchProviderArray.push(watchProvider);
                    } else if (
                        !streamingData.results.US.flatrate &&
                        !streamingData.results.US.rent
                    ) {
                        const watchProvider =
                            "Not Available to stream or rent on digital platforms";
                        watchProviderArray.push(watchProvider);
                    } else if (streamingData.results.US.flatrate) {
                        const watchProvider =
                            "Stream: " + streamingData.results.US.flatrate[0].provider_name;
                        watchProviderArray.push(watchProvider);
                    } else {
                        const watchProvider =
                            "Rent: " + streamingData.results.US.rent[0].provider_name;
                        watchProviderArray.push(watchProvider);
                    }

                }

                // create movieObject from 2 arrays
                movieObject = watchProviderArray.reduce(function (
                    result,
                    field,
                    index
                ) {
                    result[movieTitlesArray[index]] = field;
                    return result;
                },
                    {});

                // pull img file path for the poster
                const tmdbImgPath = data.results[randomResult].poster_path;

                // create header for movie title
                let movieTitleEl = document.createElement("H1");
                // create text of h1 header
                let headerEl = document.createTextNode(movieTitle);
                // create img element
                let imgEL = document.createElement("img");
                imgEL.setAttribute("src", tmdbImgSrcUrl + tmdbImgPath);
                let imgURL = imgEL.src;
                loveCalcResultsObj.posters.push(imgURL);
                dataPersistence(loveCalcResultsObj);
                //titles as alt text for movie posters
                imgEL.alt = movieTitle;

                imgEL.setAttribute("class", "movieList");
                let movieContainer = document.querySelector("#movie" + i);
                movieContainer.appendChild(imgEL);
            }
        }
    }
}

// create h3 display showing comp % and genre 
async function changeDisplay(name1, name2, percentage, genre) {
    let jumbotronStartElement = document.querySelector("#jumbotronStart");
    jumbotronStartElement.style.display = "none";
    triggerModalElement.style.display = "none";
    let jumbotronEndElement = document.querySelector("#jumbotronEnd");
    let endingHeadline = document.createElement("h3");
    endingHeadline.textContent =
    capitalizeFirstLetter(name1) +
        " and " +
        capitalizeFirstLetter(name2) +
        ", your compatibility score is " +
        percentage +
        "%! For a score like that, we recommend these " +
        genre +
        " films:";
    jumbotronEndElement.appendChild(endingHeadline);
    tryAgainButtonElement.setAttribute("type", "button");
    tryAgainButtonElement.setAttribute("id", "tryAgainButton");
    tryAgainButtonElement.setAttribute(
        "class",
        "uk-button uk-button-default uk-button-large button-centered"
    );
    tryAgainButtonElement.textContent = "Try Again?";
    let calculateButtonContainerElement = document.querySelector(
        ".calculate-btn-container"
    );
    calculateButtonContainerElement.appendChild(tryAgainButtonElement);
}

tryAgainButtonElement.addEventListener("click", function () {
    location.reload();
});

// set up localStorage
let dataPersistence = function (dataObject) {
    // send JSON to localStorage
    if (dataObject.posters.length !== 6) {
        return;
    } else {
        let checkLocalStorageValue = JSON.parse(localStorage.getItem("userOutput:"));
        if (checkLocalStorageValue === null) {
            checkLocalStorageValue = [];
        }
        checkLocalStorageValue.push(dataObject);
        localStorage.setItem("userOutput:", JSON.stringify(checkLocalStorageValue));
        createLocalStorageButtons();
    }
};

// create the button to display previously searched couples
let createLocalStorageButtons = function () {
    previouslySearchedElement.innerHTML = "";
    let localStorageObject = JSON.parse(localStorage.getItem("userOutput:"));
    for (i = 0; i < localStorageObject.length; i++) {
        let previousName1 = localStorageObject[i].loveCalcResults[0];
        let previousName2 = localStorageObject[i].loveCalcResults[1];
        let previousScore = localStorageObject[i].loveCalcResults[2];
        let previousGenre = localStorageObject[i].loveCalcResults[3];
        let posterPathArray = localStorageObject[i].posters;
        let previousResultsButtonElement = document.createElement('button');
        previousResultsButtonElement.setAttribute("type", "button");
        previousResultsButtonElement.setAttribute("class", "uk-button uk-button-default uk-button-large button-centered previousResultsButtons");
        previousResultsButtonElement.value = localStorageObject[i];
        previousResultsButtonElement.textContent = previousName1 + " + " + previousName2;
        previouslySearchedElement.appendChild(previousResultsButtonElement);
        previousResultsButtonElement.addEventListener("click", function () {
            let movieContainers = document.getElementsByClassName("movieContainer");
            let movieListItems = document.getElementsByClassName("movieList")
            //remove existing h3 if exists
            jumbotronEndElement.innerHTML = '';
            for (i = 0; i < movieContainers.length; i++) {
                if (movieContainers[i].hasChildNodes()) {
                    movieContainers[i].removeChild(movieListItems[i]);
                }
                let newPosterImage = document.createElement("img");
                newPosterImage.setAttribute("src", posterPathArray[i]);
                newPosterImage.setAttribute("class", "movieList");
                movieContainers[i].appendChild(newPosterImage);
            }
            changeDisplay(previousName1, previousName2, previousScore, previousGenre)
            console.log(previousName1, previousName2, previousScore, previousGenre)
        })
    }
}

// load buttons
createLocalStorageButtons();




