function Node(options) {
    var self = this;

    self.col = (typeof options['col'] === 'undefined') ? -1 : options['col'];
    self.value = options['value'];
    self.results = options['results'];
    self.tb = options['tb'];
    self.fb = options['fb'];
}

export default class DecisionTree {
    constructor(data, result) {
        var self = this;

        self.data = data;
        self.result = result;
    }    
}

DecisionTree.prototype.build = function(options) {
    var self = this;

    var players = [];
    var i;

    for(i=0; i<self.data.length; i++) {
        players.push(self.data[i]);
        players[i].push(self.result[i]);
    }

    self.tree = buildTree(players, entropy);
    return self.tree;
};

DecisionTree.prototype.classify = function(observation) {
    var self = this;
    return classify(observation, self.tree);
}

function classify(input, tree) {
    if(typeof tree.results !== 'undefined')    
        return tree.results;         
    else {
        var v = input[tree.col];
        var branch;

        if(!isNaN(parseFloat(v)) && isFinite(v)) {
            if(v>=tree.value) branch = tree.tb;
            else branch = tree.fb;
        } else {
            if(v === tree.value) branch = tree.tb;
            else branch = tree.fb;
        }
        return classify(input, branch);
    }
}

function buildTree(players, scoref) {

    if(players.length == 0) return new Node();

    var currentScore = scoref(players);    
    var bestGain = 0.0, bestCriteria, bestSets;
    var columnCount = players[0].length - 1;
    var col, i;

    for(col = 0; col < columnCount; col++) {
        var columnValues = {};
        for(i = 0; i < players.length; i++) {
            columnValues[players[i][col]] = 1;
        }
        var values = Object.keys(columnValues);
        for(i=0; i<values.length; i++) {
            var sets = divideSet(players,col,values[i]);
            var p = 1.*sets[0].length / players.length;
            var gain = currentScore - p*scoref(sets[0]) - (1-p)*scoref(sets[1]);
            if(gain > bestGain && sets[0].length > 0 && sets[1].length > 0) {
                bestGain = gain;
                bestCriteria = [col,values[i]];
                bestSets = sets;
            }
        }
    }

    if(bestGain > 0) {
        var trueBranch = buildTree(bestSets[0], scoref);
        var falseBranch = buildTree(bestSets[1], scoref);

        return new Node({
            col : bestCriteria[0],
            value : bestCriteria[1],
            tb : trueBranch,
            fb : falseBranch
        });

    } else {
        return new Node({
            results : uniqueCounts(players)
        });
    }
}

function entropy(players) {
    var log2 = function(x) { return Math.log(x)/Math.log(2); };
    var results = uniqueCounts(players);
    var ent = 0.0;
    var keys = Object.keys(results);
    var i;

    for(i = 0; i < keys.length; i++) {
        var p = 1.*results[keys[i]]/players.length;
        ent -= 1.*p*log2(p);
    }

    return ent;
}

function uniqueCounts(players) {
    var results = {};
    var i;

    for(i = 0; i < players.length; i++) {
        var r = players[i][players[i].length-1];

        if(typeof results[r] === 'undefined')
            results[r] = 0;

        results[r]++;
    }

    return results;
}

function divideSet(players, column, value) {
    var splitFunction;

    // is a number
    if(!isNaN(parseFloat(value)) && isFinite(value))
        splitFunction = function(row) {return row[column] >= value;};
    else
        splitFunction = function(row) {return row[column] === value;};

    var set1 = [], set2 = [];
    var i;

    for(i = 0; i < players.length; i++) {
        if(splitFunction(players[i]))
            set1.push(players[i]);
        else
            set2.push(players[i]);
    }

    return [set1,set2];
}