import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  style,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { CarouselItemDirective } from './carousel-item.directive';
import { CarouselItemElementDirective } from './carousel-item-element.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'carousel',
  exportAs: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterViewInit {
  @ContentChildren(CarouselItemDirective)
  items: QueryList<CarouselItemDirective>;

  @ViewChildren(CarouselItemElementDirective, { read: ElementRef })
  private itemsElements: QueryList<ElementRef>;

  @ViewChild('carousel') private carousel: ElementRef;
  @Input() timing = '250ms ease-in';
  @Input() showControls = true;
  @Input() slideLength;
  private player: AnimationPlayer;
  private itemWidth: number;
  private currentSlide = 0;
  carouselWrapperStyle = {};

  constructor(private builder: AnimationBuilder) { }

  private buildAnimation(offset, time: any) {
    return this.builder.build([
      animate(time == null ? this.timing : 0, style({ transform: `translateX(${offset}px)` }))
    ]);
  }

  /**
   * Progresses the carousel forward by 1 slide.
   */
  next() {
    this.active = (this.active + 1 == this.items.length) ? 0 : this.active +1;

    if (this.currentSlide + 3 == this.items.length) {
      let arr = this.items.toArray();
      let first = arr.shift();
      arr = arr.concat([first]);
      this.items.reset(arr);
      this.currentSlide--;
      this.transitionCarousel(0);
    }
    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    this.transitionCarousel(null);
  }

  /**
   * Regresses the carousel backwards by 1 slide.
   */
  prev() {
    this.active = (this.active == 0) ? this.items.length -1 : this.active -1;
    if (this.currentSlide  == 0) {
      let arr = this.items.toArray();
      let last = arr.pop();
      arr = [last].concat(arr);
      this.items.reset(arr);
      this.currentSlide++;
      this.transitionCarousel(0);
    }

    this.currentSlide =
      (this.currentSlide - 1 + this.items.length) % this.items.length;
    this.transitionCarousel(null);
  }

  ngAfterViewInit() {
    this.reSizeCarousel();
  }

  /**
   * Listens for changes to the viewport size and triggers a re-sizing of the carousel.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.reSizeCarousel();
  }

  /**
   * Re-sizes the carousel container and triggers `this.transitionCarousel()` to reset the childrens' positions.
   *
   * For use on initial load, and when changing viewport size.
   */
  visible = 3
  reSizeCarousel(): void {
    // re-size the container
    this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
    this.carouselWrapperStyle = {
      width: `${this.itemWidth*this.visible}px`,
    };
this.manageSlideRange();
    // trigger a fresh transition to the current slide to reset the position of the children
    this.transitionCarousel(null);
  }

  /**
   * Animates the carousel to the currently selected slide.
   *
   * **You must set `this.currentSlide` before calling this method, or it will have no effect.**
   */
  transitionCarousel(time: any) {
    // console.log("*", this.currentSlide);
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset, time);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }
  active= 0;
  slideConfigs =[];
  manageSlideRange(){//0 1 2 3 4
    this.slideConfigs = [];
      const middle = Math.floor((this.visible)/2);
      for(let i=this.active-middle; i < middle+this.active+1 ; i++){
        const slideConfig = {
          level:i,
          index:this.active +i < 0 ? this.items.length+i % this.items.length: this.active +i
        }
        this.slideConfigs.push(slideConfig);
      }
    // this.slideConfigs= customItems;
    }
}
