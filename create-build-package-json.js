const exist = require("./package.json");
const fs = require("fs");

const devDependencies = {
  "@babel/core": "^7.12.10",
  "@types/js-cookie": "^2.2.7",
  "@types/mime": "^2.0.3",
  "babel-jest": "^26.6.3",
  husky: "^7.0.4",
};

const data = JSON.stringify({ ...exist, devDependencies });

// console.log(exist);
fs.writeFile("package.json", data, (err) => {
  if (err) {
    throw err;
  }
  console.log("JSON data is saved.");
});
