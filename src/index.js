import fs from 'fs';
import chalk from 'chalk';
import readline from 'readline-sync';

import { getData } from './lector';
import { getDateTime } from './helpers';

import KNN from './scholar';
import DecisionTree from './scholar2';

const k = 37; // number of params
const knn = new KNN(k);

function getFeatureVectorFromPlayer(player) {
  const features = [];
  Object.keys(player).forEach((key) => {
    if (key !== 'LeagueIndex') {
      features.push(player[key]);
    }
  });

  return features;
}

function sanitize(evaluation) {
  const player = [];

  evaluation.forEach((datum) => {
    player.push(parseFloat(datum) || 0);
  });

  return player;
}

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
  data = getData(file, algorithm === 2);
} else if (extension === 'JSON') { // JSON, so data already transform, use as is
  data = require(`../assets/${file}`);
}

/* Serialize JSON to file */

fs.writeFileSync(`./assets/${getDateTime()}.json`, JSON.stringify(data));

/* Machine learning */

// KNN
if (algorithm === 1) {
  console.log(chalk.bold.blue('\nRunning KNN ...'));

  data.trainingSet.forEach((player) => {
    knn.learn(getFeatureVectorFromPlayer(player), player.LeagueIndex);
  });

  let goodEstimation = 0;
  let badEstimation = 0;
  data.learningSet.forEach((player) => {
    const result = knn.classify(getFeatureVectorFromPlayer(player));
    if (player.LeagueIndex === result) {
      goodEstimation += 1;
    } else {
      badEstimation += 1;
    }
  });

  const precision = (goodEstimation / (goodEstimation + badEstimation)) * 100;
  console.log(chalk.bold.cyan(`\n${chalk.underline('PRECISION')} ==> ${precision}%`));
  console.log(chalk.bold.green(`${chalk.underline('GOOD')} ==> ${goodEstimation}`));
  console.log(chalk.bold.red(`${chalk.underline('BAD')} ==> ${badEstimation}\n`));
}

// Decision tree
if (algorithm === 2) {
  console.log(chalk.bold.blue('\nRunning Decision tree ...'));

  const set = [];
  const result = [];

  data.forEach((datum) => {
    datum.splice(0, 1);
    result.push(datum[0]);
    datum.splice(0, 1);
  });

  set.push(data);
  const tree = new DecisionTree(set[0], result);
  tree.build();

  /* eslint-disable max-len */
  const evaluation1 = sanitize([27, 8, 250, 109.821, 0.0031596071, 0.0004223237, 3, 0.0002502659, 0.0002502659, 0.0035819308, 32.8421, 55.0568, 4.952, 22, 0.0016737, 5, 0.0001720578, 0.00015642]);
  const evaluation2 = sanitize([18, 12, 350, 67.4754, 0.0004225216, 0.0001690086, 1, 0.000029407021, 0.0001448646, 0.002885219, 42.437, 68.0502, 4.3222, 16, 0.00074847, 7, 0, 0.00043459]);
  const evaluation3 = sanitize([18, 2, 200, 78.2244, 0.0019381047, 0.0002170677, 6, 0, 0.0005581742, 0.0023257256, 48.5638, 86.24, 5.5733, 22, 0.0018916, 6, 0, 0]);
  const evaluation4 = sanitize([22, 24, 1250, 121.7802, 0.0038408486, 0.0005826674, 6, 0.0005113204, 0.0014150495, 0.004007325, 24.6667, 45.3887, 4.9733, 25, 0.0010464, 10, 0.0002259323, 0.00052321]);
  const evaluation5 = sanitize([35, 20, 800, 53.6736, 0.0012491483, 0.0001703384, 3, 0, 0.0001703384, 0.0030093118, 57.2152, 84.8553, 2.9245, 16, 0.00081384, 5, 0, 0]);
  /* eslint-enable max-len */

  const result1 = tree.classify(evaluation1);
  const result2 = tree.classify(evaluation2);
  const result3 = tree.classify(evaluation3);
  const result4 = tree.classify(evaluation4);
  const result5 = tree.classify(evaluation5);

  console.log('\nPlayer league (evaluation) : ', Object.keys(result1)[0]);
  console.log('Player league (evaluation) : ', Object.keys(result2)[0]);
  console.log('Player league (existing)   : ', Object.keys(result3)[0]);
  console.log('Player league (existing)   : ', Object.keys(result4)[0]);
  console.log('Player league (existing)   : ', Object.keys(result5)[0]);
}
