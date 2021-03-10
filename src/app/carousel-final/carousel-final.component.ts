import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, TemplateRef, ContentChildren, QueryList, NgZone, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import {CarouselTemplate} from './template-type.directive';
@Component({
  selector: 'app-carousel-final',
  templateUrl: './carousel-final.component.html',
  styleUrls: ['./carousel-final.component.css']
})
export class CarouselFinalComponent {
  @Input() get page():number {
		return this._page;
	}
	set page(val:number) {
		if (this.isCreated && val !== this._page) {
			if (this.autoplayInterval) {
				this.stopAutoplay();
				this.allowAutoplay = false;
			}

			if (val > this._page && val <= (this.totalDots() - 1)) {
				this.step(-1, val);
			}
			else if (val < this._page ) {
				this.step(1, val);
			}
		} 

		this._page = val;
	}
		
	@Input() get numVisible():number {
		return this._numVisible;
	}
	set numVisible(val:number) {
		this._numVisible = val;
	}
		
	@Input() get numScroll():number {
		return this._numVisible;
	}
	set numScroll(val:number) {
		this._numScroll = val;
	}
	
	@Input() responsiveOptions: any[];
	
	@Input() orientation = "horizontal";
	
	@Input() verticalViewPortHeight = "300px";
	
	@Input() contentClass: String = "";

	@Input() indicatorsContentClass: String = "";

	@Input() get value() :any[] {
		return this._value;
	};
	set value(val) {
		this._value = val;
	}
	
	@Input() circular:boolean = false;

	@Input() autoplayInterval:number = 0;

	@Input() style: any;

	@Input() styleClass: string;
	
 	@Output() onPage: EventEmitter<any> = new EventEmitter();

	@ViewChild('itemsContainer') itemsContainer: ElementRef;

	// @ContentChild(Header) headerFacet;

    // @ContentChild(Footer) footerFacet;


	_numVisible: number = 1;

	_numScroll: number = 1;

	_oldNumScroll: number = 0;

	prevState: any = {
		numScroll:0,
		numVisible:0,
		value: []
	};

	defaultNumScroll:number = 1;

	defaultNumVisible:number = 1;

	_page: number = 0;

	_value: any[];

	carouselStyle:any;

	id:string;

	totalShiftedItems;

	isRemainingItemsAdded:boolean = false;

	animationTimeout:any;

	translateTimeout:any;

	remainingItems: number = 0;

	_items: any[];

	startPos: any;

	documentResizeListener: any;

	clonedItemsForStarting: any[];

	clonedItemsForFinishing: any[];

	allowAutoplay: boolean;

	interval: any;

	isCreated: boolean;

	swipeThreshold: number = 20;

    itemTemplate: TemplateRef<any>;
    
    headerTemplate: TemplateRef<any>;

    footerTemplate: TemplateRef<any>;
	@ContentChildren(CarouselTemplate) templates: QueryList<any>;

	constructor(public el: ElementRef, public zone: NgZone, public cd: ChangeDetectorRef) { 
		this.totalShiftedItems = this.page * this.numScroll * -1; 
	}

	ngOnChanges(simpleChange: SimpleChanges) {
		if (simpleChange.value) {
			if (this.circular && this._value) {
				this.setCloneItems();
			}
		}

		if (this.isCreated) {
			
			if (simpleChange.numVisible) {
				if (this.responsiveOptions) {
					this.defaultNumVisible = this.numVisible;
				}

				if (this.isCircular()) {
					this.setCloneItems();
				}

				this.createStyle();
				this.calculatePosition();
			}

			if (simpleChange.numScroll) {
				if (this.responsiveOptions) {
					this.defaultNumScroll = this.numScroll;
				}
			}
		}
	}

	ngAfterContentInit() {
		this.id = 'Priyanka';
		this.allowAutoplay = !!this.autoplayInterval;

		if (this.circular) {
			this.setCloneItems();
		}

		if (this.responsiveOptions) {
			this.defaultNumScroll = this._numScroll;
			this.defaultNumVisible = this._numVisible;
		}

		this.createStyle();
		this.calculatePosition();

		if (this.responsiveOptions) {
			this.bindDocumentListeners();
		}
		this.templates.forEach((item) => {
			switch (item.getType()) {
				case 'slide':
					this.itemTemplate = item.template;
                break;

                case 'header':
                    this.headerTemplate = item.template;
                break;

                case 'footer':
                    this.footerTemplate = item.template;
                break;

				default:
					this.itemTemplate = item.template;
                break;
			}
		});
	}

	ngAfterContentChecked() {
		const isCircular = this.isCircular();
		let totalShiftedItems = this.totalShiftedItems;
		
		if (this.value && this.itemsContainer && (this.prevState.numScroll !== this._numScroll || this.prevState.numVisible !== this._numVisible || this.prevState.value.length !== this.value.length)) {
			if (this.autoplayInterval) {
				this.stopAutoplay();
			}
			
			this.remainingItems = (this.value.length - this._numVisible) % this._numScroll;

			let page = this._page;
			if (this.totalDots() !== 0 && page >= this.totalDots()) {
                page = this.totalDots() - 1;
				this._page = page;
				this.onPage.emit({
					page: this.page
				});
			}
			
			totalShiftedItems = (page * this._numScroll) * -1;
            if (isCircular) {
                totalShiftedItems -= this._numVisible;
            }

			if (page === (this.totalDots() - 1) && this.remainingItems > 0) {
				totalShiftedItems += (-1 * this.remainingItems) + this._numScroll;
				this.isRemainingItemsAdded = true;
			}
			else {
				this.isRemainingItemsAdded = false;
			}

			if (totalShiftedItems !== this.totalShiftedItems) {
                this.totalShiftedItems = totalShiftedItems;
            }

			this._oldNumScroll = this._numScroll;
			this.prevState.numScroll = this._numScroll;
			this.prevState.numVisible = this._numVisible;
			this.prevState.value = this._value;

			if (this.totalDots() > 0  && this.itemsContainer.nativeElement) {
				this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100/ this._numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100/ this._numVisible)}%, 0, 0)`;
			}
			
			this.isCreated = true;

			if (this.autoplayInterval && this.isAutoplay()) {
				this.startAutoplay();
			}
		}

		if (isCircular) {
            if (this.page === 0) {
                totalShiftedItems = -1 * this._numVisible;
            }
            else if (totalShiftedItems === 0) {
                totalShiftedItems = -1 * this.value.length;
                if (this.remainingItems > 0) {
                    this.isRemainingItemsAdded = true;
                }
            }

            if (totalShiftedItems !== this.totalShiftedItems) {
				this.totalShiftedItems = totalShiftedItems;
            }
		}
	}

	createStyle() {
		
			if (!this.carouselStyle) {
				this.carouselStyle = document.createElement('style');
				this.carouselStyle.type = 'text/css';
				document.body.appendChild(this.carouselStyle);
			}

			let innerHTML = `
            #${this.id} .carousel-item {
				flex: 1 0 ${ (100/ this.numVisible) }%
			}
        `;

			if (this.responsiveOptions) {
				this.responsiveOptions.sort((data1, data2) => {
					const value1 = data1.breakpoint;
					const value2 = data2.breakpoint;
					let result = null;

					if (value1 == null && value2 != null)
						result = -1;
					else if (value1 != null && value2 == null)
						result = 1;
					else if (value1 == null && value2 == null)
						result = 0;
					else if (typeof value1 === 'string' && typeof value2 === 'string')
						result = value1.localeCompare(value2, undefined, { numeric: true });
					else
						result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

					return -1 * result;
				});

				for (let i = 0; i < this.responsiveOptions.length; i++) {
					let res = this.responsiveOptions[i];

					innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.id} .carousel-item {
                            flex: 1 0 ${ (100/ res.numVisible) }%
                        }
                    }
                `
				}
			}

			this.carouselStyle.innerHTML = innerHTML;
		}

	calculatePosition() {
		if (this.responsiveOptions) {
			let windowWidth = window.innerWidth;
			let matchedResponsiveData = {
				numVisible: this.defaultNumVisible,
				numScroll: this.defaultNumScroll
			};

			for (let i = 0; i < this.responsiveOptions.length; i++) {
				let res = this.responsiveOptions[i];

				if (parseInt(res.breakpoint, 10) >= windowWidth) {
					matchedResponsiveData = res;
				}
			}

			if (this._numScroll !== matchedResponsiveData.numScroll) {
				let page = this._page;
				page = Math.floor((page * this._numScroll) / matchedResponsiveData.numScroll);

				let totalShiftedItems = (matchedResponsiveData.numScroll * this.page) * -1;

				if (this.isCircular()) {
					totalShiftedItems -= matchedResponsiveData.numVisible;
				}

				this.totalShiftedItems = totalShiftedItems;
				this._numScroll = matchedResponsiveData.numScroll;

				this._page = page;
				this.onPage.emit({
					page: this.page
				});
			}

			if (this._numVisible !== matchedResponsiveData.numVisible) {
				this._numVisible = matchedResponsiveData.numVisible;
				this.setCloneItems();
			}

			this.cd.markForCheck();
		}
	}
	
	setCloneItems() {
		this.clonedItemsForStarting = [];
		this.clonedItemsForFinishing = [];
		if (this.isCircular()) {
			this.clonedItemsForStarting.push(...this.value.slice(-1 * this._numVisible));
			this.clonedItemsForFinishing.push(...this.value.slice(0, this._numVisible));
		}
	}

	firstIndex() {
		return this.isCircular() ? (-1 * (this.totalShiftedItems + this.numVisible)) : (this.totalShiftedItems * -1);
	}

	lastIndex() {
		return this.firstIndex() + this.numVisible - 1;
	}

	totalDots() {
		return this.value ? Math.ceil((this.value.length - this._numVisible) / this._numScroll) + 1 : 0;
	}

	totalDotsArray() {
		const totalDots = this.totalDots();
		return totalDots <= 0 ? [] : Array(totalDots).fill(0);
	}

	isVertical() {
		return this.orientation === 'vertical';
	}

	isCircular() {
		return this.circular && this.value && this.value.length >= this.numVisible;
	}

	isAutoplay() {
		return this.autoplayInterval && this.allowAutoplay;
	}

	isForwardNavDisabled() {
		return this.isEmpty() || (this._page >= (this.totalDots() - 1) && !this.isCircular());
	}

	isBackwardNavDisabled() {
		return this.isEmpty() || (this._page <= 0  && !this.isCircular());
	}

	isEmpty() {
		return !this.value || this.value.length === 0;
	}

	navForward(e,index?) {
		if (this.isCircular() || this._page < (this.totalDots() - 1)) {
			this.step(-1, index);
		}

		if (this.autoplayInterval) {
			this.stopAutoplay();
			this.allowAutoplay = false;
		}

		if (e && e.cancelable) {
			e.preventDefault();
		}
	}

	navBackward(e,index?) {
		if (this.isCircular() || this._page !== 0) {
			this.step(1, index);
		}

		if (this.autoplayInterval) {
			this.stopAutoplay();
			this.allowAutoplay = false;
		}
		
		if (e && e.cancelable) {
			e.preventDefault();
		}
	}

	onDotClick(e, index) {
		let page = this._page;

		if (this.autoplayInterval) {
			this.stopAutoplay();
			this.allowAutoplay = false;
		}
		
		if (index > page) {
			this.navForward(e, index);
		}
		else if (index < page) {
			this.navBackward(e, index);
		}
	}

	step(dir, page) {
		let totalShiftedItems = this.totalShiftedItems;
		const isCircular = this.isCircular();

		if (page != null) {
			totalShiftedItems = (this._numScroll * page) * -1;

			if (isCircular) {
				totalShiftedItems -= this._numVisible;
			}

			this.isRemainingItemsAdded = false;
		}
		else {
			totalShiftedItems += (this._numScroll * dir);
			if (this.isRemainingItemsAdded) {
				totalShiftedItems += this.remainingItems - (this._numScroll * dir);
				this.isRemainingItemsAdded = false;
			}

			let originalShiftedItems = isCircular ? (totalShiftedItems + this._numVisible) : totalShiftedItems;
			page = Math.abs(Math.floor((originalShiftedItems / this._numScroll)));
		}

		if (isCircular && this.page === (this.totalDots() - 1) && dir === -1) {
			totalShiftedItems = -1 * (this.value.length + this._numVisible);
			page = 0;
		}
		else if (isCircular && this.page === 0 && dir === 1) {
			totalShiftedItems = 0;
			page = (this.totalDots() - 1);
		}
		else if (page === (this.totalDots() - 1) && this.remainingItems > 0) {
			totalShiftedItems += ((this.remainingItems * -1) - (this._numScroll * dir));
			this.isRemainingItemsAdded = true;
		}

		if (this.itemsContainer) {
			this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100/ this._numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100/ this._numVisible)}%, 0, 0)`;
			this.itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
		}

		this.totalShiftedItems = totalShiftedItems;
		this._page = page;
		this.onPage.emit({
			page: this.page
		});
	}

	startAutoplay() {
		this.interval = setInterval(() => {
			if (this.totalDots() > 0) {
				if (this.page === (this.totalDots() - 1)) {
					this.step(-1, 0);
				}
				else {
					this.step(-1, this.page + 1);
				}
			}
		}, 
		this.autoplayInterval);
	}

	stopAutoplay() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	onTransitionEnd() {
		if (this.itemsContainer) {
			this.itemsContainer.nativeElement.style.transition = '';

			if ((this.page === 0 || this.page === (this.totalDots() - 1)) && this.isCircular()) {
				this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${this.totalShiftedItems * (100/ this._numVisible)}%, 0)` : `translate3d(${this.totalShiftedItems * (100/ this._numVisible)}%, 0, 0)`;
			}
		}
	}

	onTouchStart(e) {
		let touchobj = e.changedTouches[0];

		this.startPos = {
			x: touchobj.pageX,
			y: touchobj.pageY
		};
	}

	onTouchMove(e) {
		if (e.cancelable) {
			e.preventDefault();
		}
	}
	onTouchEnd(e) {
		let touchobj = e.changedTouches[0];

		if (this.isVertical()) {
			this.changePageOnTouch(e, (touchobj.pageY - this.startPos.y));
		}
		else {
			this.changePageOnTouch(e, (touchobj.pageX - this.startPos.x));
		}
	}

	changePageOnTouch(e, diff) {
		if (Math.abs(diff) > this.swipeThreshold) {
			if (diff < 0) {
				this.navForward(e);
			}
			else {
				this.navBackward(e);

			}
		}
	}

	bindDocumentListeners() {
		if (!this.documentResizeListener) {
			this.documentResizeListener = (e) => {
				this.calculatePosition();
			};

			window.addEventListener('resize', this.documentResizeListener);
		}
	}

	unbindDocumentListeners() {
		if (this.documentResizeListener) {
			window.removeEventListener('resize', this.documentResizeListener);
			this.documentResizeListener = null;
		}
	}

	ngOnDestroy() {
		if (this.responsiveOptions) {
			this.unbindDocumentListeners();
		}
		if (this.autoplayInterval) {
			this.stopAutoplay();
		}
    }

}
