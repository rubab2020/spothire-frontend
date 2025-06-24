import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CommonService } from "../../services/common.service";
import { responsiveService } from "../../services/responsive.service";
import * as $ from "jquery";
declare var $: any;

@Component({
  selector: "app-prv-job-content",
  templateUrl: "./prv-job-content.component.html",
  styleUrls: ["./prv-job-content.component.css"],
})
export class PrvJobContentComponent implements OnInit {
  @Input() profile: any;
  @Input() job: any;
  @Input() hideCloseButton: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Input() logoCoverSctnClass: any;

  defaultProfImg: any = "../assets/images/default_profile.png";
  defaultCoverPhoto: any = "../assets/images/default_cover.png";

  public isMobile: Boolean; //responsive checker

  constructor(
    public cmnService: CommonService,
    private responsiveService: responsiveService,
  ) {}

  ngOnInit() {
    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });

    $(".modal").modal("hide");
  }

  showProfile(id) {
    this.onClick.emit(id);
  }
}
