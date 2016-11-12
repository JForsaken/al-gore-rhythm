// file paths
import jsonData from '../assets/data.json';
import csvData from '../assets/data.csv';

function transform(data) {
  const keys = data[0];
  const values = data.slice(1);

  function buildPlayerFromDatum(playerData) {
    const player = {};
    playerData.forEach((datum, index) => {
      const key = keys[index];
      player[key] = parseFloat(datum); // Data should only contain float & integer values
    });

    return player;
  }

  const playerObjects = values.map(buildPlayerFromDatum);
  return playerObjects;
}

function normalize(datum) {

}

// testing read file of JSON and CSV
// Also tests webpack's CSV to JSON conversion
export default (type) => {
  if (type === 'JSON') {
    return jsonData;
  }

  return transform(csvData);
};
