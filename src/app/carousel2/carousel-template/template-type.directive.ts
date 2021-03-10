import { Directive, Input, TemplateRef } from "@angular/core";

@Directive({
    selector: '[CarouselTemplate]',
    host: {
    }
})
export class PrimeTemplate {
    
    @Input() type: string;
    
    @Input('CarouselTemplate') name: string;
    
    constructor(public template: TemplateRef<any>) {}
    
    getType(): string {
        return this.name;
    }
}
