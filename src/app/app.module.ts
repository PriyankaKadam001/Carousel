import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { CarouselComponent } from './carousel/carousel.component';
import { CarouselItemDirective } from './carousel/carousel-item.directive';
import { CarouselItemElementDirective } from './carousel/carousel-item-element.directive';
import { DynamicTemplatesComponent } from './carousel/dynamic-templates/dynamic-templates.component';
import { CarouselTemplateComponent } from './carousel2/carousel-template/carousel-template.component';
import { CarouselFinalComponent } from './carousel-final/carousel-final.component';
import { CarouselTemplate } from './carousel-final/template-type.directive';

@NgModule({
  imports:      [ BrowserModule, BrowserAnimationsModule, FormsModule ],
  declarations: [ AppComponent, CarouselComponent, CarouselItemDirective, CarouselItemElementDirective, DynamicTemplatesComponent, CarouselTemplateComponent, CarouselFinalComponent, CarouselTemplate ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
