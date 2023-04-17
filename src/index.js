document.addEventListener('DOMContentLoaded', () => {
    let movies; // declare movies variable outside function
    let currentMovie; // declare currentMovie variable outside function
  
    const movieTitle = document.querySelector('#title');
    const movieYear = document.querySelector('#year-released');
    const movieDescription = document.querySelector('#description');
    const movieWatched = document.querySelector('#watched');
    const movieBloodAmount = document.querySelector('#amount');
    const movieList = document.querySelector('#movie-list');
    const bloodForm = document.querySelector('#blood-form');
  
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
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(updatedMovie => {
          movie.blood_amount = updatedMovie.blood_amount;
          movieBloodAmount.textContent = updatedMovie.blood_amount;
          bloodForm.reset();
        })
        .catch(error => {
          console.error('Error:', error);
        });
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
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(updatedMovie => {
          currentMovie = updatedMovie;
          if (updatedMovie.watched === false) {
            movieWatched.textContent = 'Watch';
          } else {
            movieWatched.textContent = 'Watched';
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
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
