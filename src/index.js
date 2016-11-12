import getData from './lector';

const data = getData('CSV');
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

// An item should be a list of values
function parseCSVItem(item) {
  return buildPlayerFromDatum(item);
}

const playerObjects = values.map(parseCSVItem);
console.log(playerObjects);
