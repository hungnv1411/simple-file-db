import _ from 'lodash';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Db } from './db';
import { JSONFile } from './io/json-file';

export interface BaseModel {
  _id?: string;
}

export class BaseConnection<T extends BaseModel> {
  private db: Db<T[]>;
  constructor(dbName: string, relativePath = true) {
    const adapter = new JSONFile<T[]>(relativePath ? path.join(__dirname, dbName) : dbName);
    this.db = new Db<T[]>(adapter);
  }

  public async find(): Promise<T[]> {
    await this.db.read();
    return this.db.data || [];
  }

  private async _findOne(predicate: Partial<T>): Promise<T> {
    await this.db.read();
    const chain = _.chain<T[]>(this.db.data);
    const result = chain
      .find((v: T, index: number) => {
        const keys = _.keysIn(predicate);
        if (
          _.some(keys, k => {
            return v[k] !== predicate[k];
          })
        ) {
          return false;
        }
        return true;
      })
      ?.value();
    return result ? (result as T) : null;
  }

  public async findOne(predicate: Partial<T> | { $or: Array<Partial<T>> }): Promise<T> {
    const listPredicates = predicate['$or'];
    if (listPredicates) {
      for (const pre of listPredicates) {
        const r = this._findOne(pre);
        if (r) return r;
      }
    }
    return this._findOne(predicate as Partial<T>);
  }

  public async findById(id: string): Promise<T> {
    return this._findOne({ _id: id } as T);
  }

  public async findByIdAndUpdate(id: string, data: Partial<T>): Promise<T> {
    this.db.read();
    const result = _.find(this.db.data, el => el['_id'] === id);
    if (result) {
      _.keysIn(data).forEach(key => {
        result[key] = data[key];
      });
      await this.db.write();
    }
    return result;
  }

  public async findByIdAndDelete(id: string): Promise<T> {
    this.db.read();
    const removedEls = _.remove(this.db.data, el => el['_id'] === id);
    const result = removedEls && removedEls.length > 0 ? removedEls[0] : null;
    if (result) {
      await this.db.write();
    }
    return result;
  }

  public async create(data: Partial<T>): Promise<T> {
    if (data._id) {
      throw new Error('Object must not have _id');
    }
    await this.db.read();
    const id = uuidv4();
    const result = { _id: id, ...data } as T;
    const dbData = this.db.data || [];
    dbData.push(result);
    this.db.data = dbData;
    await this.db.write();
    return result;
  }
}
