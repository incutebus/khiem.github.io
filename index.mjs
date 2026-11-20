import express from 'express';
import fetch from 'node-fetch';
const planets = (await import('npm-solarsystem')).default;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

const UNSPLASH_KEY = process.env.UNSPLASH_KEY || "7756a1e81f817c186cf57294e1c19b37b49c54b8f34e7c499ee0ce5cd86cd16e";
const NASA_KEY = process.env.NASA_KEY || "9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD";

// planet names for the nav menu (used in the header partial)
app.locals.planetList = planets.getPlanets();

// home page: random background from Unsplash (random local image if the API fails)
app.get('/', async (req, res) => {
  let backups = ["solar-system.jpg", "space1.jpg", "space2.jpg", "space3.jpg", "space4.jpg"];
  let image = "/img/" + backups[Math.floor(Math.random() * backups.length)];
  try {
    let response = await fetch(`https://api.unsplash.com/photos/random/?client_id=${UNSPLASH_KEY}&featured=true&query=solar-system`);
    let data = await response.json();
    if (data.urls) image = data.urls.full;
  } catch (err) {
    console.log(err);
  }
  res.render("index", { image });
});

// one route for all planets, e.g. /planet?planetName=Earth
app.get('/planet', (req, res) => {
  let planetName = req.query.planetName;
  if (!app.locals.planetList.includes(planetName)) {
    return res.send("Planet not found");
  }
  let planetInfo = planets[`get${planetName}`]();
  if (planetName == "Mars") {
    planetInfo.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png/960px-Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png";
  }
  res.render('planet', { planetInfo, planetName });
});

// NASA picture of the day (today's date, US Eastern time like NASA uses)
app.get('/nasa', async (req, res) => {
  let today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  let apod = null;
  try {
    let response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&date=${today}`);
    let data = await response.json();
    if (data.url) apod = data;
  } catch (err) {
    console.log(err);
  }
  res.render('nasa', { apod, today });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server started');
});
