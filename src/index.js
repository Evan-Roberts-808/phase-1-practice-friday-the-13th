document.addEventListener('DOMContentLoaded', () => {
    let movies; // declare movies variable outside function
    let currentMovie; // declare currentMovie variable outside function
  
    const movieTitle = document.querySelector('#title'); // declare movieTitle variable outside function
    const movieYear = document.querySelector('#year-released'); // declare movieYear variable outside function
    const movieDescription = document.querySelector('#description'); // declare movieDescription variable outside function
    const movieWatched = document.querySelector('#watched'); // declare movieWatched variable outside function
    const movieBloodAmount = document.querySelector('#amount'); // declare movieBloodAmount variable outside function
    const movieList = document.querySelector('#movie-list'); // declare movieList variable outside function
    const bloodForm = document.querySelector('#blood-form'); // declare bloodForm variable outside function
  
    function displayMovieDetails(movie) {
      movieTitle.textContent = movie.title;
      movieYear.textContent = movie.year;
      movieDescription.textContent = movie.description;
      movieBloodAmount.textContent = movie.blood_amount;
  
      // Check the watched property and set the button text accordingly
      if (movie.watched === true) {
        movieWatched.textContent = 'Watched';
      } else {
        movieWatched.textContent = 'Watch';
      }
    }
  
    
    function updateBloodAmount(movie, newBloodAmount) {
      fetch(`http://localhost:3000/movies/${movie.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blood_amount: newBloodAmount
        })
      })
        .then(updatedMovie => {
          movie.blood_amount = updatedMovie.blood_amount;
          movieBloodAmount.textContent = updatedMovie.blood_amount;
          bloodForm.reset();
        })
    }
  
    function addBlood(event) {
      event.preventDefault();
  
      const currentBloodAmount = parseInt(currentMovie.blood_amount);
      const newBloodAmount = currentBloodAmount + parseInt(document.querySelector('#blood-amount').value);
  
      updateBloodAmount(currentMovie, newBloodAmount);
    }
  
    function toggleWatched(event) {
      event.preventDefault();
      currentMovie.watched = !currentMovie.watched;
  
      fetch(`http://localhost:3000/movies/${currentMovie.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          watched: currentMovie.watched
        })
      })
        .then(updatedMovie => {
          currentMovie = updatedMovie;
          if (updatedMovie.watched === false) {
            movieWatched.textContent = 'Watch';
          } else {
            movieWatched.textContent = 'Watched';
          }
        })
    }
  
    function addMoviesToDOM(movies) {
      movies.forEach(movieData => {
        const movieImage = document.createElement('img');
        movieImage.src = movieData.image;
        movieImage.alt = movieData.title;
        movieImage.classList.add('movie-image');
        movieList.appendChild(movieImage);
  
        movieImage.addEventListener('click', () => {
          currentMovie = movieData;
          displayMovieDetails(movieData);
        });
      });
    }
  
    fetch('http://localhost:3000/movies')
      .then(response => response.json())
      .then(data => {
        movies = data;
        currentMovie = movies[0];
  
        addMoviesToDOM(movies);
        displayMovieDetails(currentMovie);
      });

      bloodForm.addEventListener('submit', addBlood);
      movieWatched.addEventListener('click', toggleWatched);
    });
