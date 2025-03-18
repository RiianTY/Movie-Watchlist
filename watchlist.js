// pulls in the local function from app.js to get the data needed for render
import local from "/app.js";

// calls DOM item
const list = document.querySelector(".watchlist");
// creates render to push saved data in the local storage to the watchlist page

function render(watchlist) {
  if (watchlist.length > 0) {
    // sets list.innerHtml to empty to clear previous data
    list.innerHTML = "";
    // loops over the localstorage data and calls it data
    watchlist.forEach((data) => {
      // html that is pushed to the page
      list.innerHTML += `
        <div class="card">
          <img class="film-img" src="${data.poster}" alt="" />
          <div class="card-info">
            <div class="card-title-row">
              <h2>${data.title}</h2>
              <img src="./src/images/RatingIcon.png" alt="" />
              <p>${data.imdbRating}</p>
            </div>
            <div class="card-details">
              <p>${data.runtime}</p>
              <p>${data.genre}</p>
              <div class="wishlist-btn">
                <button class="btn remove-btn">
                  <img src="./src/images/watchlistRemoveIcon.png" alt="" />
                </button>
                <p>Remove</p>
              </div>
            </div>
            <div class="card-description">
              <p>${data.plot}</p>
              <p class="imdbID" hidden>${data.imdbID}</p>
            </div>
          </div>
        </div>
    `;
    });
  }
}
// calls a render when the page orignally loads
render(local());
