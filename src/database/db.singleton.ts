import { Injectable } from '@angular/core';
import Nedb from 'nedb';

@Injectable()
export class DbSingleton {
  private instance: any;

  public getInstance() {
    if (!this.instance) {
      this.instance = new Nedb({ filename: 'easycashflow', autoload: true });
    }

    return this.instance;
  }
 }
