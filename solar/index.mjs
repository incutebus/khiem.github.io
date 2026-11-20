import express from 'express';
import fetch from 'node-fetch';
const planets = (await import('npm-solarsystem')).default;

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

// List of planets used to build the navigation menu (from the npm-solarsystem package)
const planetList = planets.getPlanets(); // Mercury ... Neptune
app.locals.planetList = planetList;      // available in every view (used by the header partial)

// Fallback in case the package's Mars image URL is broken
// (fixing it inside node_modules would be lost when the server re-installs packages)
const marsImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png/960px-Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png";

// API keys: read from environment variables (set them in Render > Environment).
// The keys provided in the assignment are used if no environment variable is set.
const UNSPLASH_KEY = process.env.UNSPLASH_KEY || "7756a1e81f817c186cf57294e1c19b37b49c54b8f34e7c499ee0ce5cd86cd16e";
const NASA_KEY = process.env.NASA_KEY || "9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD";

// Local backgrounds used only if the Unsplash API fails (e.g. "rate limit exceeded")
const localBackgrounds = [
  "/img/solar-system.jpg",
  "/img/space1.jpg",
  "/img/space2.jpg",
  "/img/space3.jpg",
  "/img/space4.jpg"
];

// Root route: random background image from the Unsplash Web API
app.get('/', async (req, res) => {
  let url = `https://api.unsplash.com/photos/random/?client_id=${UNSPLASH_KEY}&featured=true&query=solar-system`;
  // pick a random local image as the fallback, so the background is still random if the API fails
  let randomImage = localBackgrounds[Math.floor(Math.random() * localBackgrounds.length)];

  try {
    let response = await fetch(url);
    let data = await response.json();
    if (data.urls) {
      randomImage = data.urls.full;
    } else {
      console.log("Unsplash API response:", data);
    }
  } catch (err) {
    console.log("Unsplash error:", err.message);
  }

  res.render("index", { "image": randomImage });
});

// One route for ALL planets, e.g. /planet?planetName=Earth
app.get('/planet', (req, res) => {
  let planetName = req.query.planetName;

  // Make sure the planet exists in the package before calling the function
  if (!planetName || typeof planets[`get${planetName}`] !== "function" || !planetList.includes(planetName)) {
    return res.status(404).render('notFound', { planetName });
  }

  let planetInfo = planets[`get${planetName}`]();
  if (planetName == "Mars") {
    planetInfo.image = marsImage;
  }

  res.render('planet', { planetInfo, planetName });
});

// NASA Picture of the Day
app.get('/nasa', async (req, res) => {
  // APOD's "today" is based on US Eastern time; build the date as YYYY-MM-DD
  let today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });

  // Only today's picture is shown. First ask for today's date explicitly; if that fails,
  // ask without a date (NASA then returns its current picture of the day).
  let urls = [
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&date=${today}`,
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`
  ];
  let apod = null;

  for (let url of urls) {
    try {
      let response = await fetch(url);
      let data = await response.json();
      if (data.url) {
        apod = data;
        break;
      }
      console.log("NASA API response:", data);
    } catch (err) {
      console.log("NASA API error:", err.message);
    }
  }

  res.render('nasa', { apod, today });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server started');
});

