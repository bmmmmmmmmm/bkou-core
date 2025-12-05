const dupJSON = (value) => JSON.parse(JSON.stringify(value))
const reverseString = (string) => [...string].reverse().join('')

const toHump = (name) => name.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
const toLine = (name) => name.replace(/([A-Z])/g, '_$1').toLowerCase()
