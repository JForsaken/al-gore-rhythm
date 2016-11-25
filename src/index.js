
import { getData } from './lector';

import KNN from './scholar';
import DecisionTree from './scholar2';

var data = [];
var result = [];

var rows = getData('CSV', true);

rows.forEach((datum, index) => {
    datum.splice(0, 1);
    result.push(datum[0]);
    datum.splice(0, 1);
});

data.push(rows);

console.log(data);

var dt = new DecisionTree(data[0], result);
dt.build();

console.log("Classify : ", dt.classify([22,4,300,90.4908,0.0012559372,0.0002511874,3,0,0.000411034,0.0026717209,66.2414,65.641,5.9402,21,0.00061655,4,0,0]));
 
