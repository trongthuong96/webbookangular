import { TestBed } from '@angular/core/testing';

import { SitemapGeneratorService } from './sitemap.generator.service';

describe('SitemapGeneratorService', () => {
  let service: SitemapGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SitemapGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
