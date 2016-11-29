// compute the euclidean distance between two vectors
// function assumes vectors are arrays of equal length
const dist = (v1, v2) => (
  Math.sqrt(v1.reduce((prev, cur, index) => {
    let coeff = 0;

    switch (index) {
      case 0:
        coeff = 2;
        break;
      case 1:
        coeff = 2;
        break;
      case 2:
        coeff = 2;
        break;
      case 3:
        coeff = 2;
        break;
      case 4:
        coeff = 2;
        break;
      case 5:
        coeff = 2;
        break;
      case 6:
        coeff = 2;
        break;
      case 7:
        coeff = 2;
        break;
      case 8:
        coeff = 2;
        break;
      default:
        coeff = 1;
        break;
    }

    return prev + (coeff * ((cur - v2[index]) ** 2));
  }), 0)
);

const updateMax = (val, arr) => (
  arr.reduce((prev, cur) => Math.max(prev, cur.distance), 0)
);

const mode = (store) => {
  // array of frequency
  const frequency = {};
  // holds the max frequency
  let max = 0;
  // holds the max frequency element
  let result;

  store.forEach((vote) => {
    frequency[vote] = (frequency[vote] || 0) + 1;
    if (frequency[vote] > max) {
      max = frequency[vote];
      result = vote;
    }
  });

  return result;
};

export default class KNN {
  constructor(degree) {
    this.trainingSet = [];
    this.k = degree;
  }

  // add a point to the training set
  learn(vector, label) {
    const obj = { vector, label };
    this.trainingSet.push(obj);
  }

  classify(vector) {
    const voteBlock = [];
    let maxDistance = 0;

    this.trainingSet.forEach((trainee) => {
      const obj = { distance: dist(vector, trainee.vector), vote: trainee.label };

      if (voteBlock.length < this.k) {
        voteBlock.push(obj);
        maxDistance = updateMax(maxDistance, voteBlock);
      } else if (obj.distance < maxDistance) {
        let betterCandidateExists = true;
        let count = 0;

        while (betterCandidateExists) {
          if (Number(voteBlock[count].distance) === maxDistance) {
            voteBlock.splice(count, 1, obj);
            maxDistance = updateMax(maxDistance, voteBlock);
            betterCandidateExists = false;
          } else if (count < voteBlock.length - 1) {
            count += 1;
          } else {
            betterCandidateExists = false;
          }
        }
      }
    });

    return mode(voteBlock.map(vb => vb.vote));
  }
}
