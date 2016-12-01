import fs from 'fs';
import chalk from 'chalk';
import readline from 'readline-sync';
import R from 'ramda';

import { getData } from './lector';
import { getDateTime } from './helpers';

import KNN from './scholar';
import DecisionTree from './scholar2';


const getFeatureVectorFromPlayer = p => R.keys(R.omit(['LeagueIndex'], p)).map(x => p[x]);


/* Terminal Menu */

const welcome = '\nWelcome to Al Gore Rhythm!';
const algorithmMessage = `\nType 1 for KNN\nType 2 for Decision Tree `;
const message = `In which file is the data located inside the ${chalk.underline.red('assets')} folder (JSON/CSV)? `;
console.log(chalk.underline.bold.blue(welcome));
const algorithm = parseInt(readline.question(chalk.bold.cyan(algorithmMessage)), 10);
const file = readline.question(chalk.bold.cyan(message));
const extension = file.split('.').slice(-1)[0].toUpperCase();

/* Data manipulation */

let data;
if (extension === 'CSV') { // CSV, so transform the data to JSON
  data = getData(file, false);
} else if (extension === 'JSON') { // JSON, so data already transform, use as is
  data = require(`../assets/${file}`);
}

/* Serialize JSON to file */

// fs.writeFileSync(`./assets/${getDateTime()}.json`, JSON.stringify(data));

/* Machine learning */

let goodEstimation = 0;
let badEstimation = 0;

// KNN
if (algorithm === 1) {
  const k = 58;
  const knn = new KNN(k);

  console.log(chalk.bold.blue('\nRunning KNN ...'));

  data.trainingSet.forEach((player) => {
    knn.learn(getFeatureVectorFromPlayer(player), player.LeagueIndex);
  });

  data.learningSet.forEach((player) => {
    const result = knn.classify(getFeatureVectorFromPlayer(player));
    if (player.LeagueIndex === result) {
      goodEstimation += 1;
    } else {
      badEstimation += 1;
    }
  });
}

// Decision tree
if (algorithm === 2) {
  console.log(chalk.bold.blue('\nRunning Decision Tree ...'));

  const result = [];
  const set = data.trainingSet.map((datum) => {
    result.push(datum.LeagueIndex);
    return getFeatureVectorFromPlayer(datum);
  });

  const tree = new DecisionTree(set, result);
  tree.build();

  data.learningSet.forEach((player) => {
    const treeResult = tree.classify(getFeatureVectorFromPlayer(player));
    if (player.LeagueIndex === parseInt(Object.keys(treeResult)[0], 10)) {
      goodEstimation += 1;
    } else {
      badEstimation += 1;
    }
  });
}

if (algorithm === 3) {
  console.log(chalk.bold.blue('\nRunning KNN Weight Tracker ...'));

  const coeffs = [1, 1, 1, 1, 1, 1];
  const cursor = 5;

  let max = 0;
  for (let t = 1; t <= 100; t += 1) {
    for (let i = 0; i < 6; i += 1) {
      coeffs[i] += cursor;
      const k = 58;
      const knn = new KNN(k, coeffs);

      goodEstimation = 0;
      badEstimation = 0;

      data.trainingSet.forEach((player) => {
        knn.learn(getFeatureVectorFromPlayer(player), player.LeagueIndex);
      });

      data.learningSet.forEach((player) => {
        const result = knn.classify(getFeatureVectorFromPlayer(player));
        if (player.LeagueIndex === result) {
          goodEstimation += 1;
        } else {
          badEstimation += 1;
        }
      });

      const curPrec = (goodEstimation / (goodEstimation + badEstimation)) * 100;

      if (curPrec >= max) {
        max = curPrec;
        const coeffsStr = coeffs.reduce((acc, curr) => `${acc}, ${curr}`);
        console.log(`${coeffsStr}: ${curPrec}`);
      } else {
        coeffs[i] -= cursor;
      }
    }
  }
}

const precision = (goodEstimation / (goodEstimation + badEstimation)) * 100;
console.log(chalk.bold.cyan(`\n${chalk.underline('PRECISION')} ==> ${precision}%`));
console.log(chalk.bold.green(`${chalk.underline('GOOD')} ==> ${goodEstimation}`));
console.log(chalk.bold.red(`${chalk.underline('BAD')} ==> ${badEstimation}\n`));
