import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeModel, TreeModelSettings, NodeEvent } from 'ng2-tree';

import { Area }                  from '../../../model/time/area';
import { AreaService }           from '../../../service/time/area.service';
import { ResourceListComponent } from '../resource//list/list.component';
import { AreaType }              from '../../../shared/const';

import { AreaNg2TreeComponent } from './ng2-tree/ng2-tree.component';

@Component({
  selector: 'time-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {
  @ViewChild(AreaNg2TreeComponent)
  ng2TreeComponent: AreaNg2TreeComponent;

  @ViewChild(ResourceListComponent)
  resourceListComponent: ResourceListComponent;

  constructor(
    private areaService: AreaService,
  ) { }

  ngOnInit() {
  }

  selectAreaNode($event): void {
    this.resourceListComponent.setFilterAreaId($event);
    this.resourceListComponent.refreshClassify(0, this.resourceListComponent.pageSize);
  }
}
