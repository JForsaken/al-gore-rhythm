import getData from './lector';
import KNN from './scholar';

const data = getData('CSV');
 const copy = JSON.parse(JSON.stringify(data));
//console.log(data);

for (var key in data)
{
	if (data.hasOwnProperty(key)) {
		console.log(key + " -> " + data[key]);
	}
}

var p = {
    "p1": "value1",
    "p2": "value2",
    "p3": "value3"
};

for (var key in p) {
  if (p.hasOwnProperty(key)) {
    console.log(key + " -> " + p['p1']);
  }
}

const k = 3; // number of params
const knn = new KNN(k);

knn.learn([-1, 2, 3], 'good');
knn.learn([0, 0, 0], 'good');
knn.learn([10, 10, 10], 'bad');
knn.learn([9, 12, 9], 'bad');

// returns 'good'
console.log(knn.classify([1, 0, 1]));

// returns 'bad'
console.log(knn.classify([11, 11, 9]));
