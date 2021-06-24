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
// API key for The Movie Database
const tmdbAPIKey = "1363fbaac30c0fbba8280edaf170a171";
const tmdbImgSrcUrl = "https://image.tmdb.org/t/p/w500"; // we can adjust the 'w500' size call by various sizes if adjusting with CSS makes it look weird.
// love calc modal inputs and submit button
let modalElement = document.querySelector("#modal-close-outside");
let firstNameInputElement = document.querySelector("#nameInput1");
let secondNameInputElement = document.querySelector("#nameInput2");
let loveCalcButtonElement = document.querySelector("#modal-close-outside #loveCalcButton");

let triggerModalElement = document.querySelector("#calculateButton")

//local storage variables
let savedItemsArr = [];
let savedItemCounter = 0;
let historyEl = document.querySelector("#history");
            // *** GLOBAL VARIABLES END *** //

// generate a random number between min and (max - min)
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// love calc modal form submission handler
let modalFormSubmitHandler = function (event) {
  event.preventDefault();
  // retrieve names from user inputs
  let userName = $("#nameInput1").val();
  let partnerName = $("#nameInput2").val();
  if (userName && partnerName) {
    //console.log(userName, partnerName);
    calculateCompatibility(userName, partnerName);
    firstNameInputElement.value = "";
    secondNameInputElement.value = "";
  } else {
    alert("error");
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
      }
    })
    .then(response => {
        response.json()
            .then(function (data) {


                //console.log('love calculator: ', data, data.percentage)
                // check percentage amount to determine which genre to use in getMovieTitles
                if (data.percentage >= 0 && data.percentage < 26) {
                    let genreId = 27;
                    let genreName = "Horror";
                    getMovieTitles(genreId);
                    changeDisplay(data.fname, data.sname, data.percentage, genreName);
                } else if (data.percentage >=26 && data.percentage < 51) {
                    let genreId = 18;
                    let genreName = "Drama";
                    getMovieTitles(genreId);
                    changeDisplay(data.fname, data.sname, data.percentage, genreName);
                } else if (data.percentage >=51 && data.percentage < 76) {
                    let genreId = 53;
                    let genreName = "Action"
                    getMovieTitles(genreId);
                    changeDisplay(data.fname, data.sname, data.percentage, genreName);
                } else {
                    let genreId = 10749;
                    let genreName = "Romance";
                    getMovieTitles(genreId);
                    changeDisplay(data.fname, data.sname, data.percentage, genreName);
                }

                //console.log('love calculator: ', data)
                //console.log(genreId);
                
            })
    })
    .catch(err => {
        console.error(err);
    })
    .catch((err) => {
      console.error(err);
    });
}

// push 5 random movie titles from 5 random pages to the movieTitlesArray
// TO DO: add back genreId parameter to function below
async function getMovieTitles(genreId) {
    for(var i = 0; i < 7; i++) {
        // to generate a random page number from 1 - 500
        let randomPage = randomNum(1, 6);
        // to generate a random result index from 0 - 19
        let randomResult = randomNum(0, 20);
        // await call makes the fetch call synchronous 
        const response = await fetch("https://api.themoviedb.org/3/discover/movie?api_key=" + tmdbAPIKey + "&language=en-US&sort_by=popularity.desc&with_genres=" + genreId + "&with_original_language=en&include_adult=true&page=" + randomPage);

        if (response.ok) {
            const data = await response.json();
            //console.log('movie title: ', data);
            // if has an image url, push the movie title to the movieTitlesArray
            if (data.results[randomResult].poster_path) {
                // pull movie ID from data object
                const movieId = data.results[randomResult].id;
                // pull movie title from data object
                const movieTitle = data.results[randomResult].title;
                // push movie title to movieTitlesArray
                movieTitlesArray.push(movieTitle)
                // pull watch provider data
                const streamingResponse = await fetch("https://api.themoviedb.org/3/movie/" + movieId + "/watch/providers?api_key=1363fbaac30c0fbba8280edaf170a171")

                if (streamingResponse.ok) {
                    const streamingData = await streamingResponse.json();
                    //console.log(streamingData)
                    if (!streamingData.results.US) {
                        const watchProvider = 'Not Available to stream or rent on digital platforms';
                        watchProviderArray.push(watchProvider);
                    }
                    else if (!streamingData.results.US.flatrate && !streamingData.results.US.rent) {
                        const watchProvider = 'Not Available to stream or rent on digital platforms';
                        watchProviderArray.push(watchProvider);
                    }
                    else if (streamingData.results.US.flatrate) {
                        const watchProvider = 'Stream: ' + streamingData.results.US.flatrate[0].provider_name;
                        watchProviderArray.push(watchProvider);
                    }
                    else {
                        const watchProvider = 'Rent: ' + streamingData.results.US.rent[0].provider_name;
                        watchProviderArray.push(watchProvider);
                    }
                }

                // create movieObject from 2 arrays
                movieObject = watchProviderArray.reduce(function (result, field, index) {
                    result[movieTitlesArray[index]] = field;
                    return result
                }, {});

                // console.log(movieTitlesArray)
                // console.log(watchProviderArray)
                // console.log(movieObject);

                // pull img file path for the poster
                const tmdbImgPath = data.results[randomResult].poster_path;
                // create header for movie title
                let movieTitleEl = document.createElement('H1')
                // create text of h1 header
                let headerEl = document.createTextNode(movieTitle);
                // create img element
                let imgEL = document.createElement('img');
                imgEL.setAttribute('src', tmdbImgSrcUrl + tmdbImgPath);
                imgEL.setAttribute('class', "movieList");
                // will change where the posters are being appended to once the containers are set up
                 // append textEl to movieTitleEL
        // movieTitleEl.appendChild(headerEl);
        // append movie title to body of DOM
        // document.querySelector('#movie' + i).appendChild(movieTitleEl);
        // append image to body of DOM
        document.querySelector('#movie' + i).appendChild(imgEL);

                }
               
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

        // console.log(movieTitlesArray);
        // console.log(watchProviderArray);
        // console.log(movieObject);

        // pull img file path for the poster
        const tmdbImgPath = data.results[randomResult].poster_path;
        // create header for movie title
        let movieTitleEl = document.createElement("H1");
        // create text of h1 header
        let headerEl = document.createTextNode(movieTitle);
        // create img element
        let imgEL = document.createElement("img");
        imgEL.setAttribute("src", tmdbImgSrcUrl + tmdbImgPath);
        // will change where the posters are being appended to once the containers are set up
        // append textEl to movieTitleEL
        movieTitleEl.appendChild(headerEl);
        // append movie title to body of DOM
        document.querySelector("body").appendChild(movieTitleEl);
        // append image to body of DOM
        document.querySelector("body").appendChild(imgEL);
      }
    

    function changeDisplay(name1, name2, percentage, genre) {
      let jumbotronStartElement = document.querySelector("#jumbotronStart");
      jumbotronStartElement.style.display = "none";
      triggerModalElement.textContent = "Try Again?";
      triggerModalElement.style.margin = "1rem";
      let jumbotronEndElement = document.querySelector("#jumbotronEnd");
      let endingHeadline = document.createElement("h3");
      endingHeadline.textContent = name1 + " and " + name2 + ", your compatibility score is " + percentage + "%! For a score like that, we recommend these " + genre + " films:";
      jumbotronEndElement.appendChild(endingHeadline);

      //object to add to localstorage
      let savedItemsObj = {
        firstName: name1,
        secondName: name2,
        compatPercent: percentage
      }
      // savedItemsObj.id = savedItemCounter;
      // savedItemsArr.push(savedItemsObj);
      
      //saveNames();

     // savedItemCounter++;
     displaySavedItems(savedItemsObj);

    }
    
//function to display history
const displaySavedItems = function(savedItemsObj) {
  let saveItemEl = document.createElement("li")
  saveItemEl.className = "jumbotron";

  //add ID as custom attribute
  saveItemEl.setAttribute("data-couple-id", savedItemCounter);

  //create div to hold info
  let savedInfo = document.createElement("div");
  savedInfo.className = "history";
  //add html content to div
  savedInfo.innerHTML = "<h4 class='first-name'>" + savedItemsObj.firstName + "+" + savedItemsObj.secondName + "= " + savedItemsObj.compatPercent + "% compatibility</h4>";  

  saveItemEl.appendChild(savedInfo);

  historyEl.appendChild(saveItemEl);

  savedItemsObj.id = savedItemCounter;
  savedItemsArr.push(savedItemsObj);

  saveNames();

  
  savedItemCounter++;

}

//save names to local storage
const saveNames = function () {
  localStorage.setItem("couples", JSON.stringify(savedItemsArr));
};

// display names from local storage
const loadSaveItems = function () {
  let saveNames = localStorage.getItem("couples");

if (saveNames === null) {
  return false;
}
//parse into array of objects
saveNames = JSON.parse(saveNames);

//loop through array
for (var i = 0; i < saveNames.length; i++) {
  displaySavedItems(saveNames[i]);
}
}
//event listener for local storage
triggerModalElement.addEventListener("click", displaySavedItems);

loadSaveItems();
