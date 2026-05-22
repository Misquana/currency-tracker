function greet(name) {
  if (name) {
    return `Привет, ${name}!`
  } else {
    return 'Привет, незнакомец!'
  }
}
console.log(greet())

function sum(a, b) {
  return a + b
}
console.log()

const result = sum(3, 4)

console.log(result)

const isAdult = (age) => {
  if (age >= 18) {
    return true
  } else {
    return false
  }
}
console.log(isAdult(19))

const getMaxOfThree = (a, b, c) => {
  if (a > b && a > c) {
    return a
  } else if (a < b && c < b) {
    return b
  } else {
    if (a < c && c > b)
      return c
  }
}
console.log(getMaxOfThree(1, 4, 2))
