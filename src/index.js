import fs from 'fs';
import chalk from 'chalk';
import readline from 'readline-sync';

import { getData } from './lector';
import { getDateTime } from './helpers';
import KNN from './scholar';


/* Terminal Menu */

const welcome = '\nWelcome to Al Gore Rhythm!';
const message = `In which file is the data located inside the ${chalk.underline.red('assets')} folder (JSON/CSV)? `;
console.log(chalk.underline.bold.blue(welcome));
const file = readline.question(chalk.bold.cyan(message));
const extension = file.split('.').slice(-1)[0].toUpperCase();

/* Data manipulation */

let data;
if (extension === 'CSV') { // CSV, so transform the data to JSON
  data = getData(file);
} else if (extension === 'JSON') { // JSON, so data already transform, use as is
  data = require(`../assets/${file}`);
}

/* Serialize JSON to file */

fs.writeFileSync(`./assets/${getDateTime()}.json`, JSON.stringify(data));

/* Machine learning */

const k = 37; // number of params
const knn = new KNN(k);

function getFeatureVectorFromPlayer(player) {
  const features = [];
  Object.keys(player).forEach(function (key) {
    if (key !== 'LeagueIndex') {
      features.push(player[key]);
    }
  });

  return features;
}

data.trainingSet.forEach((player) => {
  knn.learn(getFeatureVectorFromPlayer(player), player.LeagueIndex);
});

/* Machine estimation */

let goodEstimation = 0;
let badEstimation = 0;
data.learningSet.forEach((player) => {
  const result = knn.classify(getFeatureVectorFromPlayer(player));
  if (player.LeagueIndex === result) {
    goodEstimation += 1;
  }
  else {
    badEstimation += 1;
  }
});

console.log(`PRECISION ==> ${goodEstimation / (goodEstimation + badEstimation)}%`);
console.log(`GOOD ==> ${goodEstimation}`);
console.log(`BAD ==> ${badEstimation}`);
