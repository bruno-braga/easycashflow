import { Injectable } from '@angular/core';
import Nedb from 'nedb';

@Injectable()
export class DbHasVisitedSingleton{
  private instance: any;

  public getInstance() {
    if (!this.instance) {
      this.instance = new Nedb({ filename: 'hasVisited', autoload: true });
    }

    return this.instance;
  }
 }
