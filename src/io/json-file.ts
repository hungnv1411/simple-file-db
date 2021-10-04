import { Reader, Writer } from '@/interfaces';
import { TextFile } from './text-file';

export class JSONFile<T> implements Reader<T>, Writer<T> {
  private internalTextFile: TextFile;

  constructor(filePath: string) {
    this.internalTextFile = new TextFile(filePath);
  }

  async read(): Promise<T | null> {
    const data = await this.internalTextFile.read();
    if (data === null) {
      return null;
    } else {
      return JSON.parse(data) as T;
    }
  }

  async write(data: T): Promise<void> {
    return await this.internalTextFile.write(JSON.stringify(data, null, 2));
  }
}
