import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-message',
  templateUrl: './dynamic-message.component.html',
  styleUrls: ['./dynamic-message.component.css']
})
export class DynamicMessageComponent implements OnInit {
    
  constructor() { }
  @Input() message;
  ngOnInit(): void {
    console.log(this.message);
  }

}
