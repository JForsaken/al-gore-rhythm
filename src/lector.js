// file paths
import jsonData from '../assets/data.json';
import csvData from '../assets/data.csv';

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
    // Ensure league is valid
    const isLeagueValid = datum.LeagueIndex >= 1 && datum.LeagueIndex <= 8;
    const isUnique = !uniqueIds.includes(datum.GameID); // Remove duplicates gamer ID
    const isHoursPerWeekValid = datum.HoursPerWeek < 100;
    const isAPMValid = datum.APM < 750; // 600 is 10 actions / seconds.
    const isAgeValid = datum.Age > 0 && datum.Age < 100;
    uniqueIds.push(datum.GameID);

    delete datum.GameID; // We don't need it ...
    return isLeagueValid && isUnique && isHoursPerWeekValid && isAPMValid && isAgeValid;
  }

  function normalize(datum) {
    return datum;
  }

  function reduceComplexity(datum) {
    return datum; // TODO Choose what datum keys we remove to reduce the complexity
  }

  function computeAverageValues(playerData) {
    const copy = JSON.parse(JSON.stringify(playerData));
    const reduced = copy.reduce((prev, cur) => {
      Object.keys(cur).forEach((key) => {
        if (!(key in prev)) {
          prev[key] = 0.0;
        }

        if (!(key in cur)) {
          cur[key] = 0.0;
        }

        cur[key] += prev[key];
      });

      return cur;
    }, {});

    const average = {};
    Object.keys(reduced).forEach((key) => {
      average[key] = reduced[key] / playerData.length;
    });

    return average;
  }

  const playerObjects = values.map(buildPlayerFromDatum)
                              .map(reduceComplexity)
                              .filter(removeAberrant)
                              .map(normalize);

  // compute average values;
  const averageValues = computeAverageValues(playerObjects);
  console.log('\n' + playerObjects.length + ' ===> AVERAGE VALUES FOR ALL LEAGUES v\n');
  console.log(averageValues);

  const league1Players = playerObjects.filter((player) => { return player.LeagueIndex === 1; });
  console.log('\n' + league1Players.length + ' ===> AVERAGE VALUES FOR LEAGUE 1 v\n');
  console.log(computeAverageValues(league1Players));

  const league2Players = playerObjects.filter((player) => { return player.LeagueIndex === 2; });
  console.log('\n' + league2Players.length + ' ===> AVERAGE VALUES FOR LEAGUE 2 v\n');
  console.log(computeAverageValues(league2Players));

  const league3Players = playerObjects.filter((player) => { return player.LeagueIndex === 3; });
  console.log('\n' + league3Players.length + ' ===> AVERAGE VALUES FOR LEAGUE 3 v\n');
  console.log(computeAverageValues(league3Players));

  const league4Players = playerObjects.filter((player) => { return player.LeagueIndex === 4; });
  console.log('\n' + league4Players.length + ' ===> AVERAGE VALUES FOR LEAGUE 4 v\n');
  console.log(computeAverageValues(league4Players));

  const league5Players = playerObjects.filter((player) => { return player.LeagueIndex === 5; });
  console.log('\n' + league5Players.length + ' ===> AVERAGE VALUES FOR LEAGUE 5 v\n');
  console.log(computeAverageValues(league5Players));

  const league6Players = playerObjects.filter((player) => { return player.LeagueIndex === 6; });
  console.log('\n' + league6Players.length + ' ===> AVERAGE VALUES FOR LEAGUE 6 v\n');
  console.log(computeAverageValues(league6Players));

  const league7Players = playerObjects.filter((player) => { return player.LeagueIndex === 7; });
  console.log('\n' + league7Players.length + ' ===> AVERAGE VALUES FOR LEAGUE 7 v\n');
  console.log(computeAverageValues(league7Players));

  const league8Players = playerObjects.filter((player) => { return player.LeagueIndex === 8; });
  console.log('\n' + league8Players.length + ' ===> AVERAGE VALUES FOR LEAGUE 8 v\n');
  console.log(computeAverageValues(league8Players));

  return playerObjects;
}

// testing read file of JSON and CSV
// Also tests webpack's CSV to JSON conversion
export default (type) => {
  if (type === 'JSON') {
    return jsonData;
  }

  return transform(csvData);
};
