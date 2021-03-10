import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  style,
  transition,
  trigger,
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
  animations:[trigger('animation', [
    transition(':enter', [
      style({ height: '0px', 'padding-top': '0', 'padding-bottom': '0'}),  // initial
      animate('0.5s',
        style({ height: '*', 'padding-top': '*', 'padding-bottom': '*'}))  // final
    ]),
    transition(':leave', [
      style({ height: '*', 'padding-top': '*', 'padding-bottom': '*', opacity: 1}),  // initial
      animate('0.5s',
        style({ height: '0px', 'padding-top': '0', 'padding-bottom': '0', opacity: 0}))  // final
    ])
  ])]
})
export class CarouselComponent implements AfterViewInit {
  // @ContentChildren(CarouselItemDirective)
  // items: QueryList<CarouselItemDirective>;

  // @ViewChildren(CarouselItems

  @ViewChild('carousel') private carousel: ElementRef;
  @Input() timing = '250ms ease-in';
  @Input() showControls = true;
  public currentSlide = 0;
  public visibleItems = 3;
  carouselWrapperStyle = {};
  public active = 0;
  public items= [0,1,2,3,5]
  slideData;
  $li;
  visible = 3;
  slideConfigs;
  @ViewChildren('someName') someDivs;

  constructor(private builder: AnimationBuilder, private el: ElementRef) { }

  ngAfterViewInit(){
    this.$li = this.el.nativeElement.querySelectorAll('.item');
    this.manageSlideRange();
  }
  prev(){
    let arr1 = this.slideConfigs;
    let last1 = arr1.pop();
    arr1 = [last1].concat(arr1);
    this.slideConfigs = arr1;
    this.slideStates.unshift(this.slideStates.pop());
    this.move();

  }

  manageSlideRange(){//0 1 2 3 4
      this.slideConfigs = [];
      const middle = Math.floor((this.items.length)/2);
      for(let i=0; i < this.items.length ; i++){
        const slideConfig = {
          level:i-middle,
          index: i
        }
        this.slideConfigs.push(slideConfig);
      }
      this.generateStyleState();
    }
    slideStates = []
    generateStyleState(){
      let scalingFactor = 0.2;
      this.slideStates= [];
      this.slideConfigs.forEach((element,index) => {
        const styleObj = {
          transform:'scale('+(element.level === 0 ? 1 : 1-scalingFactor)+')',
          opacity: element.level === 0 ? 1 : 0.5,
          left:70*index+'px'          
        }
        this.slideStates.push(styleObj);
      });
    }
    move(){
     const slideItem =this.someDivs.toArray();
    }
  }
