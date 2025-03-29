import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CharacterListComponent } from './characters/character-list/character-list.component';
import { EntryListComponent } from './entries/entry-list/entry-list.component';
import { EntryCreateComponent } from './entries/entry-create/entry-create.component';
import { CharacterCreateComponent } from './characters/character-create/character-create.component';
import { CharacterDetailComponent } from './characters/character-detail/character-detail.component';
import { EntryDetailComponent } from './entries/entry-detail/entry-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'characters', component: CharacterListComponent },
  { path: 'characters/create', component: CharacterCreateComponent },
  { path: 'characters/edit/:id', component: CharacterCreateComponent }, // Reuse create component for editing
  { path: 'characters/:id', component: CharacterDetailComponent},
  { path: 'entries', component: EntryListComponent },
  { path: 'entries/create', component: EntryCreateComponent },
  { path: 'entries/edit/:id', component: EntryCreateComponent }, // Reuse create component for editing
  { path: 'entries/:id', component: EntryDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
