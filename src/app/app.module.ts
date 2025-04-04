import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { HomeComponent } from './home.component';
import { CharacterListComponent } from './characters/character-list/character-list.component';
import { CharacterDetailComponent } from './characters/character-detail/character-detail.component';
import { CharacterCreateComponent } from './characters/character-create/character-create.component';
import { EntryListComponent } from './entries/entry-list/entry-list.component';
import { EntryDetailComponent } from './entries/entry-detail/entry-detail.component';
import { EntryCreateComponent } from './entries/entry-create/entry-create.component';
import { CommentListComponent } from './entries/comments/comment-list/comment-list.component';
import { CommentCreateComponent } from './entries/comments/comment-create/comment-create.component';
import { CharacterService } from './characters/character.service';
import { EntryService } from './entries/entry.service';
import { CommentService } from './entries/comments/comment.service';
import { ImageUploadComponent } from './shared/image-upload/image-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CharacterListComponent,
    CharacterDetailComponent,
    CharacterCreateComponent,
    EntryListComponent,
    EntryDetailComponent,
    EntryCreateComponent,
    CommentListComponent,
    CommentCreateComponent,
    HomeComponent,
    ImageUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [CharacterService, EntryService, CommentService, provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
