import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, ActivatedRoute, NavigationEnd, Event } from "@angular/router";
import { responsiveService } from "./services/responsive.service";

//for checking user is online or offline
import { Observable } from "rxjs";
import { fromEvent } from "rxjs/observable/fromEvent";
import { of } from "rxjs/observable/of";
import { merge } from "rxjs/observable/merge";
import { mapTo } from "rxjs/operators";
import { AuthService } from "./services/auth.service";
import { NotificationService } from "./notification/notification.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  public showErrorModal = false;
  online$: Observable<boolean>;
  public isOnline: any;

  constructor(
    titleService: Title,
    router: Router,
    activatedRoute: ActivatedRoute,
    private responsiveService: responsiveService,
    private notifService: NotificationService,
    authService: AuthService,
    private toastr: ToastrService
  ) {
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, "online").pipe(mapTo(true)),
      fromEvent(window, "offline").pipe(mapTo(false))
    );

    this.networkStatus();

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        var title = this.getTitle(
          router.routerState,
          router.routerState.root
        ).join("-");
        titleService.setTitle(title);
      }
    });


    // reset Token Interval after a cerition period of time repteadly
    let fourtyNineMinutes = 49*60*1000; // min*senconds*milisenocds
    setInterval(function() { 
      authService.getToken();
    }, fourtyNineMinutes);
  }

  ngOnInit() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      if (isMobile) {
        // console.log('Mobile device detected')
      } else {
        // console.log('Desktop detected')
      }
    });
    this.onResize();

    // notificaions
    this.notifService.getPermission();
    this.notifService.monitorRefresh();
    this.notifService.receiveMessage();
    this.notifService.currentMessage.subscribe(message => {
      // show notificaion if chat feed is not focused
      if(window.location.href !== message['data'].open_url){
        this.toastr.info(message['notification'].body, message['notification'].title, {
          closeButton: true,
        });
      }
    });
  }

  onResize() {
    this.responsiveService.checkWidth();
  }

  public networkStatus() {
    this.online$.subscribe((value) => {
      if (this.isOnline == false && value == true) {
        window.location.reload();
      }
      this.isOnline = value;
      if (this.isOnline) this.showErrorModal = false;
      else this.showErrorModal = true;
    });
  }

  getTitle(state, parent) {
    var data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }
}
