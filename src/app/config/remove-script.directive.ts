import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appRemoveScript]'
})
export class RemoveScriptDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Find the script element by its id
    const scriptElement = this.el.nativeElement.querySelector('#ng-state');

    // Check if the script element exists
    if (scriptElement) {
      // Remove the script element from its parent node
      this.renderer.removeChild(scriptElement.parentNode, scriptElement);
    }
  }
}
