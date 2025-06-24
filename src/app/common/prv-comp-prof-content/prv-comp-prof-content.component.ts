import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-prv-comp-prof-content',
  templateUrl: './prv-comp-prof-content.component.html',
  styleUrls: ['./prv-comp-prof-content.component.css']
})
export class PrvCompProfContentComponent implements OnInit {
  @Input() profile: any; 
  @Input() logoCoverSctnClass: any;
  @Input() hideCloseButton: any;

  noPhone:string = "../assets/images/no-phone.png";
  defaultProfImg:any = "../assets/images/default_profile.png";
  defaultCoverPhoto:any = "../assets/images/default_cover.png";
  
  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 'auto',
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: false,
    pagination: true
  };
  
  constructor(private cmnService: CommonService) {
  }

  ngOnInit() {
    if(this.profile && this.profile.images && this.profile.images.length <= 1)
      this.config.pagination = false;
  }

}
