import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: "./star-rating.component.html",
  styleUrls: ['./star-rating.component.css'],
})
export class StarRatingComponent implements OnInit {
  @Input() score;
  @Input() maxScore = 5;
	@Input() forDisplay = false;
	@Output() rateChanged = new EventEmitter();
  
  range = [];
  marked = -1;

  constructor() { }

  ngOnInit() {
    for (var i = 0; i < this.maxScore; i++) {
      this.range.push(i);
    }
  }

  public mark = (index) => {
    this.marked = this.marked == index ? index - 1 : index;
    this.score = this.marked + 1;
    this.rateChanged.next({ 
      score : this.score,
    });
  }

  public isMarked = (index) => {
      if (index <= this.marked) {
        return 'fa-star';
      }
      else {
        return 'fa-star-o';
      }
  }
}
