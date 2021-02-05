import { Component, OnInit, Input } from '@angular/core';
import { Category } from 'src/app/models/category/category';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryAnimation } from 'ngx-gallery-9';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
})
export class CategoryCardComponent implements OnInit {

  /**
* Categoria
*/
  @Input() category: Category;

  /**
  * Imagenes
  */
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];


  constructor(
    private navController: NavController,
    private router: Router,
    private categoryService: CategoryService,
  ) {
    this.galleryOptions = [
      {
        width: '100%',
        height: '100px',
        thumbnailsColumns: 4,
        imageSize: NgxGalleryImageSize.Contain,
        imageAnimation: NgxGalleryAnimation.Slide,
        closeIcon: 'fa fa-times-circle',
        imageArrows: false,
        imageArrowsAutoHide: false,
        thumbnails: false,
        preview : false
      },
    ];
  }

  ngOnInit(): void {
    console.log(this.category);
    this.galleryImages = [];
    let image = {
      small: this.category.image,
      medium: this.category.image,
      big: this.category.image
    }
    this.galleryImages.push(image);
  }

  /**
   * Ir a prodducots
   */
  goProducts() {
    this.navController.navigateRoot(`/shop-home/category/c/${this.category.id}/products`);
  }
}
