import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../character.service';
import { Character } from '../character.model';

@Component({
  selector: 'app-character-list',
  standalone: false,
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  currentCharacterId: string | null = null;
  isLoading: boolean = true;

  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {
    this.loadCharacters();
    this.currentCharacterId = this.characterService.getCurrentCharacterId();
    
    this.characterService.currentCharacterChanged.subscribe(id => {
      this.currentCharacterId = id;
    });
  }

  loadCharacters(): void {
    this.isLoading = true;
    this.characterService.getCharacters().subscribe({
      next: (characters) => {
        this.characters = characters;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading characters', error);
        this.isLoading = false;
      }
    });
  }

  setAsCurrentCharacter(characterId: string): void {
    this.characterService.setCurrentCharacter(characterId);
    this.currentCharacterId = characterId;
  }

  deleteCharacter(id: string): void {
    if (confirm('Are you sure you want to delete this character? This will also delete all comments made by this character.')) {
      this.characterService.deleteCharacter(id).subscribe({
        next: () => {

          if (id === this.currentCharacterId) {
            this.characterService.clearCurrentCharacter();
          }
          
          this.loadCharacters();
        },
        error: (error) => {
          console.error('Error deleting character', error);
        }
      });
    }
  }
}