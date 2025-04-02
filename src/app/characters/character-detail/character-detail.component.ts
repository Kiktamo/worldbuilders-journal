import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../character.service';
import { Character } from '../character.model';

@Component({
  selector: 'app-character-detail',
  standalone: false,
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.css'
})
export class CharacterDetailComponent implements OnInit {
  character: Character | null = null;
  isCurrentCharacter: boolean = false;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCharacter(id);
      }
    });

    this.characterService.currentCharacterChanged.subscribe(() => {
      this.checkIfCurrentCharacter();
    });
  }

  loadCharacter(id: string): void {
    this.isLoading = true;
    this.characterService.getCharacter(id).subscribe({
      next: (character) => {
        this.character = character;
        this.checkIfCurrentCharacter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading character', error);
        this.isLoading = false;
        this.router.navigate(['/characters']);
      }
    });
  }

  checkIfCurrentCharacter(): void {
    const currentCharacterId = this.characterService.getCurrentCharacterId();
    this.isCurrentCharacter = !!this.character && currentCharacterId === this.character._id;
  }

  setAsCurrentCharacter(characterId: string): void {
    this.characterService.setCurrentCharacter(characterId);
    this.isCurrentCharacter = true;
  }

  deleteCharacter(): void {
    if (!this.character) return;

    if (confirm('Are you sure you want to delete this character? This will also delete all comments made by this character.')) {
      this.characterService.deleteCharacter(this.character._id!).subscribe({
        next: () => {
          if (this.isCurrentCharacter) {
            this.characterService.clearCurrentCharacter();
          }
          
          this.router.navigate(['/characters']);
        },
        error: (error) => {
          console.error('Error deleting character', error);
        }
      });
    }
  }
}