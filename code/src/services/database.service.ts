import config from '@/config';
import { DBTypes } from '@/types/db-types';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
  _dbPath = join(__dirname, '../../..', 'data', config.dbMoviesFileName);

  async readDb(): Promise<DBTypes> {
    const data = await readFile(this.dbPath, 'utf-8');
    return JSON.parse(data);
  }

  async writeDb(data: DBTypes) {
    await writeFile(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  get dbPath() {
    return this._dbPath;
  }
}
