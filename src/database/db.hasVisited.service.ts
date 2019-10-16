import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DbHasVisitedSingleton } from './db.hasVisited.singleton';

@Injectable()
export class DbHasVisitedService {
  private db: any;

  constructor(
    private dbSingleton: DbHasVisitedSingleton) {
    this.db = this.dbSingleton.getInstance();
  }

  public hasVisited() {
    return new Promise((resolve, reject) => {
      this.db.find({ $and: [ { hasVisited: { $exists: true } }, { hasVisited: true } ] }, function(err, docs) {
        if (err)
          reject(err)
        
        resolve(docs)
      })
    })
  }

  public visited(result) {
    return new Promise((resolve, reject) => {
      resolve(result)
    })
  }

  public setVisited() {
    return new Promise((resolve, reject) => {
      this.db.insert({ hasVisited: true }, function(err, docs) {
        if (err)
          reject(err)
        
        resolve(docs)
      })
    })
  }
}
