import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { CommonService } from "../../services/common.service";
import * as $ from "jquery";
declare var $: any;

@Component({
  selector: "app-hire-applied-filter-modal",
  templateUrl: "./hire-applied-filter-modal.component.html",
  styleUrls: ["./hire-applied-filter-modal.component.css"],
})
export class HireAppliedFilterModalComponent implements OnInit {
  @Input() filters: any;
  @Output() onClickApplyFilter: EventEmitter<any> = new EventEmitter();
  @Output() onClickClearFilter: EventEmitter<any> = new EventEmitter();

  isActionBtnsDisabled = true;

  isJobTitleCollapsed = false;
  isSkillsCollapsed = true;
  isQualificationsCollapsed = true;
  isUniversitiesCollapsed = true;
  isLocationsCollapsed = true;

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

  removeFilter() {
    this.onClickClearFilter.emit();
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
