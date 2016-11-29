import R from 'ramda';
import chalk from 'chalk';

let trainSet = [];
let learnSet = [];

function transform(data) {
  const keys = data[0];
  // The last data is of length 1 for some reason
  const values = data.slice(1).filter(datum => datum.length > 1);

  function buildPlayerFromDatum(playerDatum) {
    const player = {};
    playerDatum.forEach((datum, index) => {
      const key = keys[index];

      // Data should only contain float & integer values
      player[key] = parseFloat(datum) || 0;
      if (player.LeagueIndex === 8 && player.Age === 0) {
        player.Age = 20.5;
      }
    });

    return player;
  }

  function removeAberrant(datum) {
    const temp = R.clone(datum);
    // Ensure league is valid
    const isLeagueValid = temp.LeagueIndex >= 1 && temp.LeagueIndex <= 8;
    const isAPMValid = temp.APM < 750; // 600 is 10 actions / seconds.
    return isLeagueValid && isAPMValid;
  }

  function reduceComplexity(datum) {
    const temp = R.clone(datum);
    delete temp.GameID;
//    delete temp.UniqueHotkeys; // From variance
//    delete temp.MinimapAttacks; // From variance
    delete temp.TotalMapExplored; // From common sense
    delete temp.TotalHours;
    delete temp.HoursPerWeek;
    delete temp.UniqueUnitsMade;
    delete temp.WorkersMade;
    delete temp.ComplexUnitsMade;
    delete temp.ComplexAbilitiesUsed;
    delete temp.ActionsInPAC;

    return temp;
  }

  function computeSumValues(playerData) {
    const copy = R.clone(playerData);
    return copy.reduce((prev, cur) => {
      const current = R.clone(cur);
      const previous = R.clone(prev);
      Object.keys(current).forEach((key) => {
        if (!(key in prev)) {
          previous[key] = 0.0;
        }

        if (!(key in current)) {
          current[key] = 0.0;
        }

        current[key] += previous[key];
      });

      return current;
    }, {});
  }

  function computeAverageValues(playerData) {
    const reduced = computeSumValues(playerData);
    const average = {};
    Object.keys(reduced).forEach((key) => {
      average[key] = reduced[key] / playerData.length;
    });

    return average;
  }

  // Second has no LeagueIndex
  function splitData(leagues) {
    function shuffle(a) {
      const temp = R.clone(a);
      let j;
      let x;

      for (let i = temp.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = temp[i - 1];
        temp[i - 1] = temp[j];
        temp[j] = x;
      }

      return temp;
    }

    const splitedLeagues = leagues.map((leaguePlayers) => {
      const first = shuffle(R.clone(leaguePlayers));
      const splitIndex = Math.ceil(first.length / 4);
      const second = first.splice(0, splitIndex);
      return { first, second };
    });

    const f = R.flatten(splitedLeagues.map(splitedLeaguePlayers => splitedLeaguePlayers.first));
    const s = R.flatten(splitedLeagues.map(splitedLeaguePlayers => splitedLeaguePlayers.second));

    return { first: f, second: s };
  }

  function computeMinMaxValues(playerData) {
    const min = R.clone(playerData[0]); // TODO put all values to 0
    const max = R.clone(min); // TODO put all values to 0
    Object.keys(min).forEach((key) => {
      min[key] = Number.MAX_SAFE_INTEGER;
      max[key] = -Number.MAX_SAFE_INTEGER;
    });

    playerData.forEach((player) => {
      Object.keys(player).forEach((key) => {
        const playerValue = parseFloat(player[key]);
        if (playerValue > parseFloat(max[key])) {
          max[key] = playerValue;
        }

        if (playerValue < parseFloat(min[key])) {
          min[key] = playerValue;
        }
      });
    });

    return { min, max };
  }

  /* TODO: not used
  function computeVarianceValues(playerData) {
    const averageValues = computeAverageValues(playerData);
    const variances = {};

    const temp = computeAverageValues(playerData.map((player) => {
      const copy = R.clone(player);
      Object.keys(copy).forEach((key) => {
        copy[key] = (copy[key] - averageValues[key]) ** 2;
      });
      return copy;
    }));

    Object.keys(temp).forEach((key) => {
      variances[key] = temp[key];
    });

    return variances;
  }

  function computeStandardDeviationValues(playerData) {
    const varianceValues = computeVarianceValues(playerData);
    const standardDeviations = {};
    Object.keys(varianceValues).forEach((key) => {
      standardDeviations[key] = varianceValues[key] ** 2;
    });

    return standardDeviations;
  }
  */

  // Convert data to objects, trim unrequired params, filter aberrant data
  let playerObjects = values.map(buildPlayerFromDatum)
                              .map(reduceComplexity)
                              .filter(removeAberrant);

  const averageValues = computeAverageValues(playerObjects);

  function assignAverageToNil(player) {
    const temp = R.clone(player);
    Object.keys(player).forEach((key) => {
      if (temp[key] === 0) {
        temp[key] = averageValues[key];
      }
    });

    return temp;
  }

  playerObjects = playerObjects.map(assignAverageToNil);
  const minMaxValues = computeMinMaxValues(playerObjects);
  console.log(`\n${chalk.bold.yellow(JSON.stringify(minMaxValues, null, 4))}`);

  function normalize(datum) {
    function shouldNormalize(key) { return key !== 'LeagueIndex'; }
    const temp = {};
    Object.keys(datum).forEach((key) => {
      if (shouldNormalize(key)) {
        const min = minMaxValues.min[key];
        const max = minMaxValues.max[key];
        temp[key] = (datum[key] - min) / (max - min);
      } else {
        temp[key] = datum[key];
      }

      // apply weights
      // $POIDS
      if (key === 'GapBetweenPACs') {
        temp[key] *= 1000;
      }

      if (key === 'ActionLatency') {
        temp[key] *= 1000;
      }

      if (key === 'APM') {
        temp[key] *= 1000;
      }

      if (key === 'UniqueHotkeys') {
        temp[key] *= 1;
      }

      if (key === 'AssignToHotkeys') {
        temp[key] *= 1;
      }

      if (key === 'MinimapAttacks') {
        temp[key] *= 10;
      }
    });

    return temp;
  }

  playerObjects = playerObjects.map(normalize);

  // STATS
  // const varianceValues = computeVarianceValues(playerObjects);
  // console.log('variances', varianceValues);
  // const standardDeviationValues = computeStandardDeviationValues(playerObjects);
  // console.log('standard deviations', standardDeviationValues);

  // compute average values;
  console.log(chalk.bold.green(`\n${playerObjects.length} ===> AVERAGE VALUES FOR ALL LEAGUES \n`));
  console.log(chalk.bold.green(JSON.stringify(averageValues, null, 4)));

  const league1Players = playerObjects.filter(player => player.LeagueIndex === 1);
  const league2Players = playerObjects.filter(player => player.LeagueIndex === 2);
  const league3Players = playerObjects.filter(player => player.LeagueIndex === 3);
  const league4Players = playerObjects.filter(player => player.LeagueIndex === 4);
  const league5Players = playerObjects.filter(player => player.LeagueIndex === 5);
  const league6Players = playerObjects.filter(player => player.LeagueIndex === 6);
  const league7Players = playerObjects.filter(player => player.LeagueIndex === 7);
  const league8Players = playerObjects.filter(player => player.LeagueIndex === 8);

  const splitedLeaguePlayers = [
    league1Players,
    league2Players,
    league3Players,
    league4Players,
    league5Players,
    league6Players,
    league7Players,
    league8Players,
  ];

  const dataSet = splitData(splitedLeaguePlayers);
  trainSet = dataSet.first;
  learnSet = dataSet.second;
  return { trainingSet: trainSet, learningSet: learnSet };
}

export default null;
export const getData = file => (
  transform(require(`../assets/${file}`))
);
