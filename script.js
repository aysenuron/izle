const API_KEY = "2e2fbbb041dce2daa7495a9e68ffe955";
const API_URL = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_KEY;

const searchBox = document.getElementById("search-box");
const suggestions = document.getElementById("suggestions");
const watchListRender = document.getElementById("watchlist");

searchBox.addEventListener("input", () => {
    const query = searchBox.value.trim();

    if(!query) {
        suggestions.innerHTML = "";
        return;
    };
    fetch(`${API_URL}&query=${query}`)
        .then(res => res.json())
        .then(data => displaySuggestions(data.results));
});

function displaySuggestions(movies) {
    suggestions.innerHTML = "";

    movies.slice(0, 5).forEach(movie => {
        const liContainer = document.createElement("div");
        const liPoster = document.createElement("img");
        const li = document.createElement("li");
        liPoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        liPoster.alt = movie.title;
        li.textContent = movie.title;
        liContainer.appendChild(liPoster);
        liContainer.appendChild(li);
        suggestions.appendChild(liContainer);

        liContainer.addEventListener("click", () => {
            suggestions.innerHTML = "";

            let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

            const isAlreadyAdded = watchlist.some(item => item.title === movie.title);

            if(!isAlreadyAdded && watchlist.length < 10) {
                watchlist.push({
                    title: movie.title,
                    posterURL : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                });
            } else {
                alert("You have 10 movies to watch already!")
            };

            localStorage.setItem("watchlist", JSON.stringify(watchlist));

            searchBox.value = "";

            location.reload();
        });
    });
};

function renderWatchList() {
    const movies = JSON.parse(localStorage.getItem("watchlist"));

    movies.forEach(movie => {
        const movieContainer = document.createElement("div");
        const movieTitle = document.createElement("p");
        const moviePoster = document.createElement("img");

        movieTitle.textContent = movie.title;
        moviePoster.src = movie.posterURL;
        moviePoster.alt = movie.tite;

        movieContainer.appendChild(moviePoster);
        movieContainer.appendChild(movieTitle);
        watchListRender.appendChild(movieContainer);

        const markAsWatched = document.createElement("button");
        markAsWatched.textContent = "Watched";
        movieContainer.appendChild(markAsWatched);

        markAsWatched.addEventListener("click", () => {
            let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

            watchlist = watchlist.filter(item => item.title !== movie.title);

            localStorage.setItem("watchlist", JSON.stringify(watchlist));

            movieContainer.remove();
        });
    });
};

if(localStorage.length > 0) {
    renderWatchList();
};