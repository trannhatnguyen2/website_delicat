import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemWishlistComponent } from './product-item-wishlist.component';

describe('ProductItemWishlistComponent', () => {
  let component: ProductItemWishlistComponent;
  let fixture: ComponentFixture<ProductItemWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductItemWishlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductItemWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
