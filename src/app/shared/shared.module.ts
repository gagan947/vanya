import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HeaderComponent } from './header/header.component'
import { DialogModule } from 'primeng/dialog'
import { ImageCropperModule } from 'ngx-image-cropper'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { StepsModule } from 'primeng/steps'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { GalleriaModule } from 'primeng/galleria'
import { CarouselModule } from 'primeng/carousel'
import { LoaderComponent } from './loader/loader.component'
import { MultiSelectModule } from 'primeng/multiselect'
import { SidebarModule } from 'primeng/sidebar'
import { CartComponent } from './cart/cart.component'
import { NgxEditorModule } from 'ngx-editor'
import { PaginatorModule } from 'primeng/paginator'
import { ImagePreviewComponent } from './image-preview/image-preview.component'
import { DynamicDialogModule } from 'primeng/dynamicdialog'
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input'
import { ProjectCartComponent } from './project-cart/project-cart.component'
import { DropdownModule } from 'primeng/dropdown';
import { NumberToWordsPipe } from './number-to-words.pipe'

@NgModule({
  declarations: [
    HeaderComponent,
    LoaderComponent,
    CartComponent,
    ImagePreviewComponent,
    ProjectCartComponent,
    NumberToWordsPipe
  ],
  imports: [
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ImageCropperModule,
    StepsModule,
    OverlayPanelModule,
    GalleriaModule,
    CarouselModule,
    MultiSelectModule,
    SidebarModule,
    NgxEditorModule,
    PaginatorModule,
    DynamicDialogModule,
    NgxIntlTelInputModule,
    DropdownModule,
  ],
  exports: [
    CommonModule,
    HeaderComponent,
    LoaderComponent,
    DialogModule,
    ConfirmDialogModule,
    ImageCropperModule,
    StepsModule,
    OverlayPanelModule,
    GalleriaModule,
    CarouselModule,
    MultiSelectModule,
    SidebarModule,
    NgxEditorModule,
    PaginatorModule,
    DynamicDialogModule,
    CartComponent,
    NgxIntlTelInputModule,
    DropdownModule,
    NumberToWordsPipe
  ]
})
export class SharedModule { }
