import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CommonService } from "../../services/common.service";
import * as $ from "jquery";
declare var $: any;

@Component({
  selector: "app-jobs-filter-modal",
  templateUrl: "./jobs-filter-modal.component.html",
  styleUrls: ["./jobs-filter-modal.component.css"],
})
export class JobsFilterModalComponent implements OnInit {
  @Input() filters: any;
  @Output() onClickApplyFilter: EventEmitter<any> = new EventEmitter();
  @Output() onClickClearFilter: EventEmitter<any> = new EventEmitter();

  isActionBtnsDisabled = true;

  constructor(public cmnService: CommonService) {}

  ngOnInit() {}

  hasFitlerOption(filters) {
    let count = 0;
    for (let index in filters) {
      if (filters[index].length == 0) count++;
    }

    return Object.keys(filters).length != count ? true : false;
  }

  applyFilter() {
    this.onClickApplyFilter.emit();
  }

  clearFilter() {
    this.onClickClearFilter.emit();
    this.isActionBtnsDisabled = true;
  }

  checkActionButtons() {
    let isChecked = false;
    let checkboxes = $("input:checkbox");
    checkboxes.each(function () {
      if (this.checked) {
        isChecked = true;
      }
    });
    this.isActionBtnsDisabled = isChecked ? false : true;
  }
}
