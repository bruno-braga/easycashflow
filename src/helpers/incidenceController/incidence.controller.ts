import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class IncidenceController {
  constructor(private alertCtrl: AlertController) {}

  private incidenceTypes: any[] = ['current', 'all', 'fromCurrentToLast'];

  
}
