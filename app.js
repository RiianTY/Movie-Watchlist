const list = document.querySelector(".list");
const inputBox = document.querySelector(".input-box");
const inputBtn = document.querySelector(".input-btn");

let imdbArr = [];
let watchlistArr = [];

inputBtn.addEventListener("click", async () => {
  dataGrab();
  list.innerHTML = "";
  imdbArr = [];
});

document.addEventListener("click", async (e) => {
  const watchlistBtn = e.target.closest(".wishlist-btn");

  if (watchlistBtn) {
    const card = watchlistBtn.closest(".card");
    const title = card.querySelector("h2").textContent;
    const movieData = await getMovieData(title);

    // Push only specific fields
    const watchlistItem = {
      title: movieData.Title,
      imdbID: movieData.imdbID,
      poster: movieData.Poster,
    };
    watchlistArr.push(watchlistItem);
    console.log(watchlistArr);
  }
});

async function getMovieData(title) {
  const res = await fetch(
    `http://www.omdbapi.com/?t=${title}&y=&plot=short&r=json&apikey=545cc5dc`
  );
  return await res.json();
}

async function dataGrab() {
  const res = await fetch(
    `http://www.omdbapi.com/?s=${inputBox.value}&y=&plot=short&r=json&apikey=545cc5dc`
  );
  const data = await res.json();

  for (let i = 0; i < data.Search.length; i++) {
    imdbArr.push(data.Search[i].imdbID);
  }
  render();
}

async function render() {
  for (let i = 0; i < imdbArr.length; i++) {
    const res = await fetch(
      `http://www.omdbapi.com/?i=${imdbArr[i]}&y=&plot=short&r=json&apikey=545cc5dc`
    );
    const data = await res.json();

    console.log(data);
    list.innerHTML += `
        <div class="card">
              <img
                class="film-img"
                src="${data.Poster}"
                alt=""
              />
              <div class="card-info">
                <div class="card-title-row">
                  <h2>${data.Title}</h2>
                  <img src="./src/images/placeholders/RatingIcon.png" alt="" />
                  <p>${data.imdbRating}</p>
                </div>
                <div class="card-details">
                  <p>${data.Runtime}</p>
                  <p>${data.Genre}</p>
                  <div class="wishlist-btn">
                    <button class="btn">
                      <img src="./src/images/placeholders/watchlistIcon.png" alt="" />
                    </button>
                    <p>Watchlist</p>
                  </div>
                </div>
                <div class="card-description">
                  <p>
                    ${data.Plot}
                  </p>
                </div>
              </div>
            </div>
        `;
  }
}
