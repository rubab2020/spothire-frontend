import { Injectable } from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import { environment } from '../../environments/environment';
declare var ga:Function; // <-- Here we declare GA variable

@Injectable()
export class GoogleAnalyticsService {

  constructor(router: Router) {
    if (!environment.production) return; // <-- If you want to enable GA only in production
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.url);
        ga('send', 'pageview');
      }
    })
  }

  /**
   * Emit google analytics event
   * Fire event example:
   * this.emitEvent("testCategory", "testAction", "testLabel", 10);
   * @param {string} eventCategory
   * @param {string} eventAction
   * @param {string} eventLabel
   * @param {number} eventValue
   */
  public emitEvent(eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null) {
    // console.log('goog-analytics-1');
     if (typeof ga === 'function') {
       ga('send', 'event', {
         eventCategory: eventCategory,
         eventLabel: eventLabel,
         eventAction: eventAction,
         eventValue: eventValue
       });
      //  console.log('goog-analytics-2');
     }
   }
}
