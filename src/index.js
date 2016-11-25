import { getData } from './lector';
import KNN from './scholar';

getData('CSV');

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
