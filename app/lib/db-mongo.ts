import { Db, Collection } from 'mongodb';
import clientPromise from './mongodb';

export class MongoDB {
  private db: Db | null = null;
  private collections: { [key: string]: Collection } = {};

  private async connect(): Promise<Db> {
    if (!this.db) {
      const client = await clientPromise;
      this.db = client.db(); // The database name is already in the connection string
    }
    return this.db;
  }

  async getCollection(name: string): Promise<Collection> {
    await this.connect();
    if (!this.collections[name]) {
      this.collections[name] = this.db!.collection(name);
    }
    return this.collections[name];
  }
}

const mongoDB = new MongoDB();
export default mongoDB;
