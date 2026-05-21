const numbers = [3, 7, 2, 8, 5, 1, 9, 4, 6, 10]; 
const result = numbers.reduce((acc, num) => acc + num, 0);
console.log(result); 

const numbers = [3, 7, 2, 8, 5, 1, 9, 4, 6, 10] ;
const doubled = numbers.map(num => num * 2);
console.log(doubled);

const numbers = [3, 7, 2, 8, 5, 1, 9, 4, 6, 10]; 
const even = numbers.filter(num => num % 2);
console.log(even);

const numbers = [3, 7, 2, 8, 5, 1, 9, 4, 6, 10]; 
const max = numbers.reduce((currentMax, num) => num > currentMax ? num : currentMax);
console.log(max);

const numbers = [3, 7, 2, 8, 5, 1, 9, 4, 6, 10];
const sum = numbers.reduce((acc, num) => acc + num, 0);
const average = sum / numbers.length;
console.log(average);

const numbers = [3, 7, 2, 8, 5, 1, 9, 4, 6, 10]; 
const decrease = numbers.toSorted((a, b) => b - a);
console.log(decrease);

