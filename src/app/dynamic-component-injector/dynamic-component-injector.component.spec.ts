import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicComponentInjectorComponent } from './dynamic-component-injector.component';

describe('DynamicComponentInjectorComponent', () => {
  let component: DynamicComponentInjectorComponent;
  let fixture: ComponentFixture<DynamicComponentInjectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicComponentInjectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicComponentInjectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
