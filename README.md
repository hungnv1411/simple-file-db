# simple-file-db

A simple file database based on lowdb

## Example

```ts
import path from 'path';
import { BaseConnection } from '../connection';

type User = { _id?: string; name?: string; email?: string };
const testUser: User = {
  name: 'test',
  email: 'test@yopmail.com',
};
const conn = new BaseConnection<User>(path.join(__dirname, 'test.json'), false);
(async () => {
  const savedUser: User = await conn.create(testUser);

  const listUser: User[] = await conn.find();
  console.log('list user', listUser);

  const findUser = await conn.findById(savedUser._id);
  console.log('find user with id: ', savedUser._id, findUser);

  const updatedUser = await conn.findByIdAndUpdate(savedUser._id, {
    name: 'new test user',
  });
  console.log('updated user', updatedUser);

  const deletedUser = await conn.findByIdAndDelete(savedUser._id);
  console.log('deleted user', updatedUser);
})();
```
