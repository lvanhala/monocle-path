import {monoclePath} from './lib'

interface Data {
  users: User[]
}

interface User {
  name: string
  address: Address
}

interface Address {
  street: string
}

const data: Data = {
  users: [
    {
      name: 'John',
      address: {
        street: 'some street'
      }
    }
  ]
}

const print = (o: any) => console.log(JSON.stringify(o, null, 2))

const optionalByIndex = monoclePath<Data>()
  .prop('users')
  .byIndex(0)
  .prop('address')
  .prop('street')
  .toOptional()

print(optionalByIndex.set('Another street')(data))
print(optionalByIndex.modify((s) => s.toUpperCase())(data))

const findJohn = monoclePath<Data>()
  .prop('users')
  .find((user) => user.name === 'John')
  .toOptional()

print(findJohn.getOption(data))

const notFoundByIndex = monoclePath<Data>()
  .prop('users')
  .byIndex(1)
  .toOptional()

console.log(notFoundByIndex.getOption(data))
