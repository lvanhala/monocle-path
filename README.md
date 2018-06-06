# monocle-path
A typescript utility for accessing and updating JS objects using monocle-ts

## Installation
```sh
yarn add monocle-path
```

## Usage

```ts
import {monoclePath} from 'monocle-path'

interface Data {
  users: User[]
}

interface User {
  name: string
}

const data: Data = {
  users: [
    {
      name: 'John'
    }
  ]
}

const print = (o: any) => console.log(JSON.stringify(o))

const findByIndex = monoclePath<Data>()
  .prop('users')
  .byIndex(0)
  .prop('name')
  .toOptional()

print(findByIndex.set('Steve')(data)) // {"users":[{"name":"Steve"}]}

print(findByIndex.modify((s) => s.toUpperCase())(data)) // {"users":[{"name":"JOHN"}]}

const findJohn = monoclePath<Data>()
  .prop('users')
  .find((user) => user.name === 'John')
  .toOptional()

print(findJohn.getOption(data)) // Some({"value":{"name":"John"})

const notFoundByIndex = monoclePath<Data>()
  .prop('users')
  .byIndex(1)
  .toOptional()

print(notFoundByIndex.getOption(data)) // None
```
