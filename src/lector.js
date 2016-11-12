// file paths
import jsonData from '../assets/data.json';
import csvData from '../assets/data.csv';

function transform(data) {
  const keys = data[0];
  const values = data.slice(1).filter((datum) => {
    return datum.length > 1;
  }); // The last data is of length 1 for some reasons

  const uniqueIds = [];

  function buildPlayerFromDatum(playerDatum) {
    const player = {};
    playerDatum.forEach((datum, index) => {
      const key = keys[index];

      // Data should only contain float & integer values
      player[key] = parseFloat(datum) || 0;
    });

    return player;
  }

  function normalize(datum) {
    // Ensure league is valid
    const isLeagueValid = datum.LeagueIndex >= 1 && datum.LeagueIndex <= 8;
    const isUnique = !uniqueIds.includes(datum.GameID); // Remove duplicates gamer ID

    uniqueIds.push(datum.GameID);
    return isLeagueValid && isUnique;
  }

  function reduceComplexity(datum) {
    return datum; // TODO Choose what datum keys we remove to reduce the complexity
  }

  function computeAverageValues(playerData) {
    const reduced = playerData.reduce((prev, cur) => {
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

  const playerObjects = values.map(buildPlayerFromDatum).map(reduceComplexity);
  // compute average values;
  const averageValues = computeAverageValues(playerObjects);
  console.log(averageValues);
  return playerObjects.filter(normalize);
}

// testing read file of JSON and CSV
// Also tests webpack's CSV to JSON conversion
export default (type) => {
  if (type === 'JSON') {
    return jsonData;
  }

  return transform(csvData);
};
