document.addEventListener('DOMContentLoaded', () => {

    // Challenge 1: create images for each movie and add to movie-list nav
    fetch('http://localhost:3000/movies')
      .then(response => response.json())
      .then(data => {
        const movieList = document.querySelector('#movie-list');
  
        data.forEach(movie => {
          const movieImage = document.createElement('img');
          movieImage.src = movie.image;
          movieImage.alt = movie.title;
          movieImage.classList.add('movie-image');
          movieList.appendChild(movieImage);
        });
  
    // Challenge 2: show details of first movie in dataset
    displayMovieDetails(data[0]);
  
    // Challenge 3: add event listener to each movie image
        const movieImages = document.querySelectorAll('.movie-image');
        movieImages.forEach((image, index) => {
          image.addEventListener('click', () => {
            displayMovieDetails(data[index]);
          });
        });
      });
  
      function displayMovieDetails(movie) {
        const movieTitle = document.querySelector('#title');
        const movieYear = document.querySelector('#year-released');
        const movieDescription = document.querySelector('#description');
        const movieWatched = document.querySelector('#watched');
        const movieBloodAmount = document.querySelector('#amount');
      
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
      
        // Challenge 4
        // When you click on the button in the details it should toggle between Watched or 
        // Unwatched depending on the value of watched for the movie currently being displayed.
        // The watched value should stay the same when you click between the different movies.
        movieWatched.addEventListener('click', (e) => {
          e.preventDefault();
          movie.watched = !movie.watched;
      
          fetch(`http://localhost:3000/movies/${movie.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              watched: movie.watched
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(updatedMovie => {
            if (updatedMovie.watched === false) {
              movieWatched.textContent = 'Watch';
            } else {
              movieWatched.textContent = 'Watched';
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
        });
      
        // Challenge 5
        // On the right side there's a form that allows the user to enter a number of blood drops
        // to add to each movie (don't ask why). For each movie, I should be able to add more drops.
        const bloodForm = document.querySelector('#blood-form');
        bloodForm.addEventListener('submit', (event) => { 
          event.preventDefault();
          const currentBlood = parseInt(movieBloodAmount.textContent);
          const newBlood = currentBlood + parseInt(document.querySelector('#blood-amount').value);
      
          fetch(`http://localhost:3000/movies/${movie.id}`, { 
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              blood_amount: newBlood
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(updatedMovie => {
            movieBloodAmount.textContent = updatedMovie.blood_amount;
            bloodForm.reset();
          })
          .catch(error => {
            console.error('Error:', error);
          });
        });
      }
    })
      