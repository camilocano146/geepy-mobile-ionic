import {AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, Input, Output} from '@angular/core';

@Directive({
  selector: '[appDetectLazyLoad]'
})
export class LazyLoadDirective implements AfterViewInit {
  // @Input('appLazyLoad') method: () => any;
  @Output() appDetectLazyLoad: EventEmitter<any> = new EventEmitter();
  // @HostBinding('attr.src') srcAttr = null;
  // @Input() src: string;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.canLazyLoad()) {
      this.lazyLoadImage();
    }
  }

  private canLazyLoad() {
    return window && 'IntersectionObserver' in window;
  }

  private lazyLoadImage() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          // console.log('aaaaa', this.method);
          // this.method();
          this.lazyLoadImage();
          this.appDetectLazyLoad.emit();
          obs.unobserve(this.el.nativeElement);
        }
      });
    });
    obs.observe(this.el.nativeElement);
  }

  // private loadImage() {
  //   this.srcAttr = this.src;
  // }
}
