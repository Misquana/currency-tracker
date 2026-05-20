function greet(name){
    if (name) {
    return `Привет, ${name}!`;
  } else { 
    return "Привет, незнакомец!";
    }
}


function sum(a,b) {
    return a + b;
}
const result = sum(3, 4);




const isAdult = (age) => {
if (age >=18) {
    return true;      
  } else {
    return false;
    }
}



const getMaxOfThree = (a, b, c) => {
    if (a > b && a > c) {
    return a;
  } else if (a < b && c < b) {
    return b;
  } else {
    if (a < c && c > b)
    return c
    }
}  
