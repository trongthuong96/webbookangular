import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddableWebsiteComponent } from './embeddable.website.component';

describe('EmbeddableWebsiteComponent', () => {
  let component: EmbeddableWebsiteComponent;
  let fixture: ComponentFixture<EmbeddableWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmbeddableWebsiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmbeddableWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
