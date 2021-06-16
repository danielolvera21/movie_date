// API key for The Movie Database
const tmdbAPIKey = '1363fbaac30c0fbba8280edaf170a171';
// for testing purposes I've pulled Step Brothers imdb movie ID
const imdbMovieID = 'tt0838283'
const tmdbImgSrcUrl = 'https://image.tmdb.org/t/p/original/'; // we can adjust the 'original' size call by various sizes if adjusting with CSS makes it look weird.

// To display the image we retreive from TMDB API to DOM
fetch('https://api.themoviedb.org/3/movie/' + imdbMovieID + '/images?api_key=' + tmdbAPIKey + '&language=en-US&include_image_language=en,null')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                // pull img file path for the highest rated image (index 0)
                const tmdbImgPath = data.posters[0].file_path;
                // create img element and append to body of DOM
                let imgEL = document.createElement('img');
                imgEL.setAttribute('src', tmdbImgSrcUrl + tmdbImgPath);

                document.querySelector('body').appendChild(imgEL);
            })
        }

    })
