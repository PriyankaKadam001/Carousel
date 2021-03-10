import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { DynamicMessageComponent } from './dynamic-message/dynamic-message.component';

@Component({
  selector: 'app-dynamic-component-injector',
  templateUrl: './dynamic-component-injector.component.html',
  styleUrls: ['./dynamic-component-injector.component.css']
})
export class DynamicComponentInjectorComponent implements OnInit {

  constructor(private resolver: ComponentFactoryResolver) { }

  @ViewChild('dyComponent',  {read:ViewContainerRef}) container: ViewContainerRef;
  componentRef :any; 
  ngOnInit(): void {
  }

  createComponent(){
    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(DynamicMessageComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.message = "test";
  }

}
