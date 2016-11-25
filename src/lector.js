import R from 'ramda';

let trainSet = [];
let learnSet = [];

function transform(data) {
  const keys = data[0];
  const uniqueIds = [];
  // The last data is of length 1 for some reason
  const values = data.slice(1).filter(datum => datum.length > 1);

  function buildPlayerFromDatum(playerDatum) {
    const player = {};
    playerDatum.forEach((datum, index) => {
      const key = keys[index];

      // Data should only contain float & integer values
      player[key] = parseFloat(datum) || 0;
    });

    return player;
  }

  function removeAberrant(datum) {
    const temp = R.clone(datum);
    // Ensure league is valid
    const isLeagueValid = temp.LeagueIndex >= 1 && temp.LeagueIndex <= 8;
    const isHoursPerWeekValid = temp.HoursPerWeek < 100;
    const isAPMValid = temp.APM < 750; // 600 is 10 actions / seconds.
    return isLeagueValid && isHoursPerWeekValid && isAPMValid;
  }

  function normalize(datum) {
    return datum;
  }

  function reduceComplexity(datum) {
    const temp = R.clone(datum);
    delete temp.TotalMapExplored;
    delete temp.UniqueUnitsMade;
    delete temp.Age;

    return temp;
  }

  function computeAverageValues(playerData) {
    const copy = R.clone(playerData);
    const reduced = copy.reduce((prev, cur) => {
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

    const average = {};
    Object.keys(reduced).forEach((key) => {
      average[key] = reduced[key] / playerData.length;
    });

    return average;
  }

  function splitData(leagues) {
    const splitedLeagues = leagues.map((leaguePlayers) => {
      const first = R.clone(leaguePlayers);
      const splitIndex = Math.ceil(first.length / 2);
      const second = first.splice(0, splitIndex);
      return { first, second };
    });

    const f = R.flatten(splitedLeagues.map(splitedLeaguePlayers => splitedLeaguePlayers.first));
    const s = R.flatten(splitedLeagues.map(splitedLeaguePlayers => splitedLeaguePlayers.second));

    return { first: f, second: s };
  }

  function computeMinMaxValues(playerData) {
    const min = R.clone(playerData[0]); // TODO put all values to 0
    Object.keys(min).forEach((key) => {
       min[key] = 0;
    });
    const max = R.clone(min); // TODO put all values to 0

    return playerData;
  }

  let playerObjects = values.map(buildPlayerFromDatum)
                              .map(reduceComplexity)
                              .filter(removeAberrant);

  // const minMaxValues = computeMinMaxValues(playerObjects);
  playerObjects = playerObjects.map(normalize);

  // compute average values;
  const averageValues = computeAverageValues(playerObjects);
  console.log(`\n${playerObjects.length} ===> AVERAGE VALUES FOR ALL LEAGUES \n`);
  console.log(averageValues);

  const league1Players = playerObjects.filter(player => player.LeagueIndex === 1);
  console.log(`\n${league1Players.length} ===> AVERAGE VALUES FOR LEAGUE 1 \n`);
  console.log(computeAverageValues(league1Players));

  const league2Players = playerObjects.filter(player => player.LeagueIndex === 2);
  console.log(`\n${league2Players.length} ===> AVERAGE VALUES FOR LEAGUE 2 \n`);
  console.log(computeAverageValues(league2Players));

  const league3Players = playerObjects.filter(player => player.LeagueIndex === 3);
  console.log(`\n${league3Players.length} ===> AVERAGE VALUES FOR LEAGUE 3 \n`);
  console.log(computeAverageValues(league3Players));

  const league4Players = playerObjects.filter(player => player.LeagueIndex === 4);
  console.log(`\n${league4Players.length} ===> AVERAGE VALUES FOR LEAGUE 4 \n`);
  console.log(computeAverageValues(league4Players));

  const league5Players = playerObjects.filter(player => player.LeagueIndex === 5);
  console.log(`\n${league5Players.length} ===> AVERAGE VALUES FOR LEAGUE 5 \n`);
  console.log(computeAverageValues(league5Players));

  const league6Players = playerObjects.filter(player => player.LeagueIndex === 6);
  console.log(`\n${league6Players.length} ===> AVERAGE VALUES FOR LEAGUE 6 \n`);
  console.log(computeAverageValues(league6Players));

  const league7Players = playerObjects.filter(player => player.LeagueIndex === 7);
  console.log(`\n${league7Players.length} ===> AVERAGE VALUES FOR LEAGUE 7 \n`);
  console.log(computeAverageValues(league7Players));

  const league8Players = playerObjects.filter(player => player.LeagueIndex === 8);
  console.log(`\n${league8Players.length} ===> AVERAGE VALUES FOR LEAGUE 8 \n`);
  console.log(computeAverageValues(league8Players));

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

function transformRaw(data) {  
  console.log('test');

  const keys = data[0];
  const uniqueIds = [];
  const values = data.slice(1).filter(datum => datum.length > 1);

  function buildPlayerFromDatum(playerDatum) {
    const player = [];
    
    playerDatum.forEach((datum, index) => {
      player.push(parseFloat(datum) || 0);
    });
    
    return player;
  }

  function removeAberrant(datum) {
    const temp = R.clone(datum);
    
    const isLeagueValid = temp[1] >= 1 && temp[1] <= 8;
    const isHoursPerWeekValid = temp[3] < 100;
    const isAPMValid = temp[5] < 750; 

    return isLeagueValid && isHoursPerWeekValid && isAPMValid;
  }

  function normalize(datum) {
    return datum;
  }

  function reduceComplexity(datum) {
    const temp = R.clone(datum);

    delete temp[15];
    delete temp[17];
    delete temp[2];

    return temp;
  } 

  var playerObjects = values.map(buildPlayerFromDatum)
                              .map(reduceComplexity)
                              .filter(removeAberrant);
  
  return playerObjects;
}

export default null;
export const getData = (file, raw) => raw ? transformRaw(require(`../assets/${file}`)) : transform(require(`../assets/${file}`));

