import config from '@/config';
import { DBTypes } from '@/types/dbTypes';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
  private dbPath = join(__dirname, '../../..', 'data', config.dbMoviesFileName);

  async readDb(): Promise<DBTypes> {
    const data = readFileSync(this.dbPath, 'utf-8');
    return JSON.parse(data);
  }

  async writeDb(data: DBTypes) {
    writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
  }
}
