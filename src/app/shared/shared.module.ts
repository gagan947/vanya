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

@NgModule({
  declarations: [
    HeaderComponent,
    LoaderComponent,
    CartComponent,
    ImagePreviewComponent
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
    DynamicDialogModule
  ],
  exports: [
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
    DynamicDialogModule
  ]
})
export class SharedModule {}
