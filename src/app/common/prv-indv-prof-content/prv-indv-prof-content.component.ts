import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-prv-indv-prof-content',
  templateUrl: './prv-indv-prof-content.component.html',
  styleUrls: ['./prv-indv-prof-content.component.css']
})
export class PrvIndvProfContentComponent implements OnInit {
  @Input() profile: any; 
  @Input() logoCoverSctnClass: any; 
  @Input() hideCloseButton: any;


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

  noPhone:string = "../assets/images/no-phone.png";
  defaultProfImg:any = "../assets/images/default_profile.png";
  defaultCoverPhoto:any = "../assets/images/default_cover.png";
  defaultCompImg:any = "../assets/images/default_company.png";
  defaultEducationImg:any = "../assets/images/default-education.png";
  defaultAwardImg:any = "../assets/images/default_award.png";

  constructor(private cmnService: CommonService) { }

  ngOnInit() {
  }

  getSwiperConfig(expIndex) {
    let config = {...this.config}; 
    if(this.profile.experiences[expIndex].work_images.length <= 1)
      config.pagination = false;
    else 
      config.pagination = true;

    return config;
  }

}
