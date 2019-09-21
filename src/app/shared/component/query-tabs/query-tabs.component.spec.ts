import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryTabsComponent } from './query-tabs.component';

describe('QueryTabsComponent', () => {
  let component: QueryTabsComponent;
  let fixture: ComponentFixture<QueryTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QueryTabsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
