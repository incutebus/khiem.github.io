import express from 'express';
import fetch from 'node-fetch';
import { faker } from '@faker-js/faker';
import path from 'path';
import { fileURLToPath } from 'url';

// folder that contains this file, so views/ and public/ are found locally and on Render
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.render("index");
});

// Node package: Faker creates fake users for the access review table
app.get('/identity', (req, res) => {
  let users = [];
  for (let i = 0; i < 5; i++) {
    users.push({
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(["Admin", "Developer", "Read-only"]),
      mfa: faker.datatype.boolean(),
      lastSignIn: faker.date.recent({ days: 30 }).toLocaleDateString()
    });
  }
  res.render("identity", { users });
});

app.get('/pipeline', (req, res) => {
  res.render("pipeline");
});

app.get('/iac', (req, res) => {
  res.render("iac");
});

// Web API: endoflife.date shows which versions still get security updates
app.get('/versions', async (req, res) => {
  let products = ["nodejs", "python", "kubernetes", "terraform"];
  let product = products.includes(req.query.product) ? req.query.product : "nodejs";
  let releases = [];
  try {
    let response = await fetch(`https://endoflife.date/api/v1/products/${product}`);
    let data = await response.json();
    releases = data.result.releases.slice(0, 10); // newest 10 versions
  } catch (err) {
    console.log(err);
  }
  res.render("versions", { products, product, releases });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server started');
});
