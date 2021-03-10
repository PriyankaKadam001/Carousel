import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselFinalComponent } from './carousel-final.component';

describe('CarouselFinalComponent', () => {
  let component: CarouselFinalComponent;
  let fixture: ComponentFixture<CarouselFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
