/*
 *    SEED DESCRIPTION
 *
 *    1) Call to RandomUser API. The array returned contains 50 fake users by default, each of then under the form of an object.
 *    2) Pass the city, obtained via the first api call, to a function that returns accurate coords (lat, lon).
 *    3) Retrieve a random picture from unplash with a custom query to match user's gender (man or woman).
 *    4) Hash the password obtained via the first api call.
 *    5) Format and execute of the query.
 */

/* Require relevant npm packages */
const db = require("./connection");
const fetch = require("node-fetch");
const bcrypt = require("bcryptjs");
const getCoords = require("city-to-coords");
const Vibrant = require("node-vibrant");

const tags = [
  "outgoing",
  "spontaneous",
  "intelligent",
  "passionate",
  "affectionate",
  "ambitious",
  "sweet",
  "creative",
  "dumb"
];

const shuffle = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

(async () => {
  try {
    let data = await fetch("https://randomuser.me/api/?nat=fr&results=500");
    data = await data.json();
    data.results.forEach(async elem => {
      const {
        name: { first, last },
        email,
        gender,
        location: { city },
        login: { username, password }
      } = elem;

      const { lat, lng } = await getCoords(city);
      const attr = gender === "male" ? "man" : "woman";
      const pic = await fetch(`https://source.unsplash.com/random/?${attr}`);
      const color = await Vibrant.from(pic.url).getPalette(
        (err, palette) => palette
      );
      const saltKey = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, saltKey);

      const query = {
        text: `INSERT INTO
                        users (
                          firstname,
                          lastname,
                          email,
                          gender,
                          age,
                          avatar,
                          login,
                          password,
                          city,
                          latitude,
                          longitude,
                          tags,
                          lastconnection,
                          bio,
                          palette,
                          score, 
                          orientation
                        )
                        VALUES($1, $2, $3, $4, $5, ARRAY[$6], $7, $8, $9, $10, $11, $12, localtimestamp, $13, $14, $15, $16)`,
        values: [
          first.replace(/(^|[\s-])\S/g, match => match.toUpperCase()),
          last.replace(/(^|[\s-])\S/g, match => match.toUpperCase()),
          email,
          gender === "male" ? 1 : 2,
          `19${Math.floor(Math.random() * (99 - 85 + 1)) +
            85}-12-31T23:00:00.000Z`,
          pic.url,
          username,
          hashedPassword,
          city.replace(/(^|[\s-])\S/g, match => match.toUpperCase()),
          parseFloat(lat),
          parseFloat(lng),
          // tags[Math.floor(Math.random() * tags.length)],
          `{${shuffle(tags)
            .slice(0, 3)
            .join(",")}}`,
          "Vape bicycle rights polaroid selfies, 3 wolf moon mlkshk lyft locavore fam iPhone wayfarers. Ramps tumblr XOXO poutine keffiyeh four loko lumbersexual bespoke. Enamel pin before they sold out cray organic, 90's sartorial truffaut bushwick kinfolk la croix aesthetic. Squid distillery fanny pack tacos. Migas poke lyft irony chambray sustainable messenger bag celiac portland vice put a bird on it. Poutine photo booth hella bushwick meggings, lyft farm-to-table swag succulents retro polaroid man braid celiac you probably haven't heard of them humblebrag.",
          color.LightVibrant.getHex(),
          Math.floor(Math.random() * 1001),
          Math.floor(Math.random() * 3) + 1
        ]
      };
      db.pool.query(query, err => {
        err ? console.log(err.stack) : 0;
      });
    });
  } catch (err) {
    console.log(err);
  }
})();
