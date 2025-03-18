// exports watchlist data stored in localStorage to watchlist.js
export default function local() {
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith("watchlist")
  );
  const watchlist = keys.map((key) => JSON.parse(localStorage.getItem(key)));
  return watchlist;
}
// calls DOM items
const list = document.querySelector(".list");
const inputBox = document.querySelector(".input-box");
const inputBtn = document.querySelector(".input-btn");

let imdbArr = [];
// checks if inputBtn is active (to stop an error on watchlist.js)
if (inputBtn) {
  inputBtn.addEventListener("click", async () => {
    dataGrab();
    list.innerHTML = "";
    imdbArr = [];
  });
}

document.addEventListener("click", async (e) => {
  // finds the closest object to the wishlist-btn
  const watchlistBtn = e.target.closest(".wishlist-btn");

  if (watchlistBtn) {
    // checks for the closest .card class
    const card = watchlistBtn.closest(".card");
    // grabs the hidden elements with the id inside (couldnt think of another way)
    const id = card.querySelector(".imdbID").textContent;
    // gets the movies data passing in the id to the fetch request function
    const movieData = await getMovieData(id);
    // saves the following data
    const watchlistItem = {
      title: movieData.Title,
      imdbID: movieData.imdbID,
      poster: movieData.Poster,
      imdbRating: movieData.imdbRating,
      genre: movieData.Genre,
      runtime: movieData.Runtime,
      plot: movieData.Plot,
    };
    // converts the data into a string
    localStorage.setItem(`watchlist:${id}`, JSON.stringify(watchlistItem));
    // calls local to parse the data
    local();
  }
  // adds a removeBtn to the watchlist
  const removeBtn = e.target.closest(".remove-btn");
  if (removeBtn) {
    const card = removeBtn.closest(".card");
    const id = card.querySelector(".imdbID").textContent;
    localStorage.removeItem(`watchlist:${id}`);
    card.remove();
  }
});
// used by the above items in the document to grab the data and store it in local
async function getMovieData(id) {
  const res = await fetch(
    `http://www.omdbapi.com/?i=${id}&y=&plot=short&r=json&apikey=545cc5dc`
  );
  return await res.json();
}
// uses the search query gets the data in the input box and pulls from the api
async function dataGrab() {
  const res = await fetch(
    `http://www.omdbapi.com/?s=${inputBox.value}&y=&plot=short&r=json&apikey=545cc5dc`
  );
  const data = await res.json();
  // pushes all the data to the imdbArr
  for (let i = 0; i < data.Search.length; i++) {
    imdbArr.push(data.Search[i].imdbID);
  }
  // calls render to push to the page
  render();
}
// render function used to render all the api data to the page
async function render() {
  for (let i = 0; i < imdbArr.length; i++) {
    const res = await fetch(
      // uses the id from the dataGrab function to get more data such as
      // the rating, genre, runtime, plot ect..
      `http://www.omdbapi.com/?i=${imdbArr[i]}&y=&plot=short&r=json&apikey=545cc5dc`
    );
    const data = await res.json();
    // list items that are rendered to the page
    list.innerHTML += `
        <div class="card">
          <img class="film-img" src="${data.Poster}" alt="" />
          <div class="card-info">
            <div class="card-title-row">
              <h2>${data.Title}</h2>
              <img src="./src/images/RatingIcon.png" alt="" />
              <p>${data.imdbRating}</p>
            </div>
            <div class="card-details">
              <p>${data.Runtime}</p>
              <p>${data.Genre}</p>
              <div class="wishlist-btn">
                <button class="btn">
                  <img src="./src/images/watchlistIcon.png" alt="" />
                </button>
                <p>Watchlist</p>
              </div>
            </div>
            <div class="card-description">
              <p>${data.Plot}</p>
              <p class="imdbID" hidden>${data.imdbID}</p>
            </div>
          </div>
        </div>
      `;
  }
}
