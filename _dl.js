const https = require("https");
const fs = require("fs");
const files = {
  "prettier-babel.js": "https://unpkg.com/prettier@3.3.3/plugins/babel.js",
  "prettier-estree.js": "https://unpkg.com/prettier@3.3.3/plugins/estree.js",
  "prettier-postcss.js": "https://unpkg.com/prettier@3.3.3/plugins/postcss.js",
  "prettier-html.js": "https://unpkg.com/prettier@3.3.3/plugins/html.js",
};
let done = 0;
for (const [name, url] of Object.entries(files)) {
  https.get(url, (r) => {
    let d = "";
    r.on("data", (c) => (d += c));
    r.on("end", () => {
      fs.writeFileSync(name, d);
      console.log(name, d.length);
      if (++done === 4) console.log("ALL OK");
    });
  });
}
