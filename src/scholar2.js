function Node(options) {
  const self = this;

  self.col = (typeof options.col === 'undefined') ? -1 : options.col;
  self.value = options.value;
  self.results = options.results;
  self.tb = options.tb;
  self.fb = options.fb;
}

export default class DecisionTree {
  constructor(data, result) {
    const self = this;

    self.data = data;
    self.result = result;
  }
}

function classify(input, tree) {
  if (typeof tree.results !== 'undefined') {
    return tree.results;
  }
  const v = input[tree.col];
  let branch;

  if (!isNaN(parseFloat(v)) && isFinite(v)) {
    if (v >= tree.value) {
      branch = tree.tb;
    } else {
      branch = tree.fb;
    }
  } else if (v === tree.value) {
    branch = tree.tb;
  } else {
    branch = tree.fb;
  }

  return classify(input, branch);
}

DecisionTree.prototype.classify = function protoClassify(observation) {
  const self = this;
  return classify(observation, self.tree);
};

function uniqueCounts(players) {
  const results = {};

  for (let i = 0; i < players.length; i += 1) {
    const r = players[i][players[i].length - 1];

    if (typeof results[r] === 'undefined') {
      results[r] = 0;
    }

    results[r] += 1;
  }

  return results;
}

function entropy(players) {
  const log2 = x => Math.log(x) / Math.log(2);

  const results = uniqueCounts(players);
  let ent = 0.0;
  const keys = Object.keys(results);

  for (let i = 0; i < keys.length; i += 1) {
    const p = (1.0 * results[keys[i]]) / players.length;
    ent -= 1.0 * p * log2(p);
  }

  return ent;
}

function divideSet(players, column, value) {
  let splitFunction;

  // is a number
  if (!isNaN(parseFloat(value)) && isFinite(value)) {
    splitFunction = player => player[column] >= value;
  } else {
    splitFunction = player => player[column] === value;
  }

  const set1 = [];
  const set2 = [];

  for (let i = 0; i < players.length; i += 1) {
    if (splitFunction(players[i])) {
      set1.push(players[i]);
    } else {
      set2.push(players[i]);
    }
  }

  return [set1, set2];
}

function build(players, score) {
  if (players.length === 0) {
    return new Node();
  }

  const currentScore = score(players);
  let bestGain = 0.0;
  let bestCriteria;
  let bestSets;
  const columnCount = players[0].length - 1;
  let col;
  let i;

  for (col = 0; col < columnCount; col += 1) {
    const columnValues = {};
    for (i = 0; i < players.length; i += 1) {
      columnValues[players[i][col]] = 1;
    }
    const values = Object.keys(columnValues);
    for (i = 0; i < values.length; i += 1) {
      const sets = divideSet(players, col, values[i]);
      const p = (1.0 * sets[0].length) / players.length;
      const gain = currentScore - (p * score(sets[0])) - ((1 - p) * score(sets[1]));
      if (gain > bestGain && sets[0].length > 0 && sets[1].length > 0) {
        bestGain = gain;
        bestCriteria = [col, values[i]];
        bestSets = sets;
      }
    }
  }

  if (bestGain > 0) {
    const trueBranch = build(bestSets[0], score);
    const falseBranch = build(bestSets[1], score);

    return new Node({
      col: bestCriteria[0],
      value: bestCriteria[1],
      tb: trueBranch,
      fb: falseBranch,
    });
  }

  return new Node({
    results: uniqueCounts(players),
  });
}

DecisionTree.prototype.build = function protoBuild() {
  const self = this;
  const players = [];

  for (let i = 0; i < self.data.length; i += 1) {
    players.push(self.data[i]);
    players[i].push(self.result[i]);
  }

  self.tree = build(players, entropy);
  return self.tree;
};
