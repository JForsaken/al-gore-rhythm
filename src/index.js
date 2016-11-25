import fs from 'fs';
import chalk from 'chalk';
import readline from 'readline-sync';

import { getData } from './lector';
import { getDateTime } from './helpers';

import KNN from './scholar';
import DecisionTree from './scholar2';


/* Terminal Menu */

const welcome = '\nWelcome to Al Gore Rhythm!';
const algorithmMessage = `\nType 1 for KNN\nType 2 for Decision Tree `;
const message = `In which file is the data located inside the ${chalk.underline.red('assets')} folder (JSON/CSV)? `;
console.log(chalk.underline.bold.blue(welcome));
const algorithm = readline.question(chalk.bold.cyan(algorithmMessage));
const file = readline.question(chalk.bold.cyan(message));
const extension = file.split('.').slice(-1)[0].toUpperCase();

/* Data manipulation */

let data;
if (extension === 'CSV') { // CSV, so transform the data to JSON
  data = getData(file, algorithm == 2);
} else if (extension === 'JSON') { // JSON, so data already transform, use as is
  data = require(`../assets/${file}`);
}

/* Serialize JSON to file */

fs.writeFileSync(`./assets/${getDateTime()}.json`, JSON.stringify(data));

/* Machine learning */

// KNN
if(algorithm == 1)
{
	console.log('Running KNN ...')

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
}
// Decision tree
if(algorithm == 2)
{
	console.log('Running Decision tree ...');

	var set = [];
	var result = [];

	data.forEach((datum, index) => {
	    datum.splice(0, 1);
	    result.push(datum[0]);
	    datum.splice(0, 1);
	});

	set.push(data);
	var tree = new DecisionTree(set[0], result);
	tree.build();

	var evaluation1 = sanitize([27,8,250,109.821,0.0031596071,0.0004223237,3,0.0002502659,0.0002502659,0.0035819308,32.8421,55.0568,4.952,22,0.0016737,5,0.0001720578,0.00015642]);								// ???
	var evaluation2 = sanitize([18,12,350,67.4754,0.0004225216,0.0001690086,1,0.000029407021,0.0001448646,0.002885219,42.437,68.0502,4.3222,16,0.00074847,7,0,0.00043459]);										// ???
    var evaluation3 = sanitize([18,2,200,78.2244,0.0019381047,0.0002170677,6,0,0.0005581742,0.0023257256,48.5638,86.24,5.5733,22,0.0018916,6,0,0]);																// 2
	var evaluation4 = sanitize([22,24,1250,121.7802,0.0038408486,0.0005826674,6,0.0005113204,0.0014150495,0.004007325,24.6667,45.3887,4.9733,25,0.0010464,10,0.0002259323,0.00052321]); 						// 6
	var evaluation5 = sanitize([35,20,800,53.6736,0.0012491483,0.0001703384,3,0,0.0001703384,0.0030093118,57.2152,84.8553,2.9245,16,0.00081384,5,0,0]); 														// 4 

	console.log("Player league (evaluation) : ", tree.classify(evaluation1));
	console.log("Player league (evaluation) : ", tree.classify(evaluation2));
	console.log("Player league (existing)   : ", tree.classify(evaluation3));
	console.log("Player league (existing)   : ", tree.classify(evaluation4));
	console.log("Player league (existing)   : ", tree.classify(evaluation5));
}

function sanitize(evaluation){
	
	var player = [];
    
    evaluation.forEach((datum, index) => {
      player.push(parseFloat(datum) || 0);
    });
    
    return player;
}