import { Reader, Writer } from './interfaces';

export type Adapter<T> = Reader<T> & Writer<T>;

export class Db<T = unknown> {
  private adapter: Adapter<T>;
  data: T | null = null;
  private dirty = true;

  constructor(adapter: Adapter<T>) {
    if (adapter) {
      this.adapter = adapter;
    } else {
      throw new Error('missing adapter');
    }
  }

  async read(): Promise<void> {
    if (this.dirty) {
      this.data = await this.adapter.read();
      this.dirty = false;
    }
  }

  async write(): Promise<void> {
    if (this.data) {
      await this.adapter.write(this.data);
      this.dirty = true;
    }
  }
}
