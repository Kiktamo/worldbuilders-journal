import { Component, OnInit } from '@angular/core';
import { Character } from './characters/character.model';
import { CharacterService } from './characters/character.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentCharacter: Character | null = null;

  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {
    // Load current character if one is set
    this.loadCurrentCharacter();

    // Subscribe to character service changes
    this.characterService.currentCharacterChanged.subscribe(() => {
      this.loadCurrentCharacter();
    });
  }

  loadCurrentCharacter(): void {
    const currentCharacterId = this.characterService.getCurrentCharacterId();
    
    if (currentCharacterId) {
      this.characterService.getCharacter(currentCharacterId).subscribe({
        next: (character) => {
          this.currentCharacter = character;
        },
        error: (error) => {
          console.error('Error loading current character', error);
          // Handle error - reset current character
          this.clearCurrentCharacter();
        }
      });
    } else {
      this.currentCharacter = null;
    }
  }

  clearCurrentCharacter(): void {
    this.characterService.clearCurrentCharacter();
    this.currentCharacter = null;
  }
}