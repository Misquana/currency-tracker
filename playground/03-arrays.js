const numbers = [3, 7, 2, 8, 5, 1, 9, 4, 6, 10]
const result = numbers.reduce((acc, num) => acc + num, 0)
console.log(result)

const doubled = numbers.map(num => num * 2)
console.log(doubled)

const even = numbers.filter(num => num % 2)
console.log(even)

const max = numbers.reduce((currentMax, num) => num > currentMax ? num : currentMax)
console.log(max)

const sum = numbers.reduce((acc, num) => acc + num, 0)
const average = sum / numbers.length
console.log(average)

const decrease = numbers.toSorted((a, b) => b - a)
console.log(decrease)
