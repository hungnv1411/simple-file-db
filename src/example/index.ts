import path from 'path';
import { BaseConnection } from '../connection';

type User = { _id?: string; name?: string; email?: string };
const testUser: User = {
  name: 'test',
  email: 'test@yopmail.com',
};
const conn = new BaseConnection<User>(path.join(__dirname, 'test.json'), false);
conn.create(testUser);
