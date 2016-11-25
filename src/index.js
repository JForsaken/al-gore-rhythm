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

const k = 3; // number of params
const knn = new KNN(k);

knn.learn([-1, 2, 3], 'good');
knn.learn([0, 0, 0], 'good');
knn.learn([10, 10, 10], 'bad');
knn.learn([9, 12, 9], 'bad');

/* Machine estimation */

// returns 'good'
console.log(knn.classify([1, 0, 1]));

// returns 'bad'
console.log(knn.classify([11, 11, 9]));
