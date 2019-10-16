import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

import { Observable } from 'rxjs';

import { HomePage } from '../home/home.page';

@IonicPage()
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {


  slides = [
    {
      title: 'Slide 1',
      text: 'text slide 1'
    }
  ]

  constructor(private navCtrl: NavController) {
    console.log('vish')
  }

  public updateHasVisited() {
    this.navCtrl.push(HomePage)
  }
}
