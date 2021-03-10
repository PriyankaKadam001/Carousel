import { Directive, Input, TemplateRef } from "@angular/core";

@Directive({
    selector: '[testTemplate]',
    host: {
    }
})
export class CarouselTemplate {
    
    @Input() type: string;
    
    @Input('testTemplate') name: string;
    ngOnInit(){
        console.log(this.name);
    }
    constructor(public template: TemplateRef<any>) {}
    
    getType(): string {
        return this.name;
    }
}
