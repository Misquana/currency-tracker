const user = {
  name: 'Yarik',
  age: 18,
  email: 'Yarik@mail.com',
  isActive: true,
}
console.log(user)
const users = [
  { name: 'Vlad', age: 19, email: 'Vlad@mail.com', isActive: true },
  { name: 'Vera', age: 30, email: 'Vera@mail.com', isActive: false },
  { name: 'Slava', age: 17, email: 'Slava@mail.com', isActive: false },
  { name: 'Sasha', age: 25, email: 'Sasha@mail.com', isActive: true },
]

const isActive = users.filter(user => user.isActive === true)
console.log(isActive)

const userName = isActive.map(user => user.name)
console.log(userName)

const { name, email } = users[0]
console.log(`Имя: ${name}, Email: ${email}`)

function formatUser({ name, email }) {
  return `${name} (${email})`
}
console.log(formatUser(users[0]))
console.log(formatUser(users[1]))
