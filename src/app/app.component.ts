import { Component, ViewChild } from '@angular/core';

import { HomePage } from '../pages/home/home.page';
import { OnboardingPage } from '../pages/onboarding/onboarding';

import { Platform } from 'ionic-angular';
import { DbHasVisitedService } from '../database/db.hasVisited.service';
import { Observable } from 'rxjs';

@Component({
    template: `<ion-nav #myNav [root]="rootPage"></ion-nav>`,
})

export class MyApp {
    @ViewChild('myNav') nav;

    rootPage : any = '';

    constructor(private platform: Platform, private hasVisited : DbHasVisitedService) {
      this.platform.ready().then(() => {
        this.hasVisited.hasVisited()
          .then((res) => {
              if (res && res.length == 0) {
                this.rootPage = OnboardingPage
                return this.hasVisited.setVisited()
              }

            this.rootPage = HomePage
            return this.hasVisited.visited(res)
          })
          .then((hasVisited) => {
            console.log(hasVisited)
          })
          .catch(err => console.log(err))
      })
    }
}
