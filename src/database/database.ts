import PouchDb from 'pouchdb';
import PouchDbFind from 'pouchdb-find';

export class PouchDbSingleton {
  private static _database: any;

  public static getInstance() {
    if (!PouchDbSingleton._database) {
      PouchDbSingleton._database = new PouchDb('easycashflow');
      PouchDb.plugin(PouchDbFind);
    }

    return PouchDbSingleton._database;
  }
 }
