import { Component, OnInit } from '@angular/core';
import { CharacterService } from './characters/character.service';
import { EntryService } from './entries/entry.service';
import { CommentService } from './entries/comments/comment.service';
import { Character } from './characters/character.model';
import { Entry } from './entries/entry.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  characters: Character[] = [];
  entries: Entry[] = [];
  recentEntries: Entry[] = [];
  currentCharacter: Character | null = null;
  currentCharacterId: string | null = null;
  commentCount: number = 0;
  categoryCount: number = 0;
  isLoading: boolean = true;

  constructor(
    private characterService: CharacterService,
    private entryService: EntryService,
    private commentService: CommentService
  ) { }

  ngOnInit(): void {
    this.loadData();

    this.characterService.currentCharacterChanged.subscribe(() => {
      this.loadCurrentCharacter();
    });
  }

  loadData(): void {
    this.isLoading = true;

    forkJoin({
      characters: this.characterService.getCharacters(),
      entries: this.entryService.getEntries(),

    }).subscribe({
      next: (results) => {
        this.characters = results.characters;
        this.entries = results.entries;
        
        // Process recent entries (limit to 5)
        this.recentEntries = [...this.entries]
          .sort((a, b) => new Date(b.updatedAt as Date).getTime() - new Date(a.updatedAt as Date).getTime())
          .slice(0, 5);
        
        const categories = new Set(this.entries.map(entry => entry.category));
        this.categoryCount = categories.size;
        
        this.getCommentCount();
        
        this.loadCurrentCharacter();
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data', error);
        this.isLoading = false;
        // Consider if anything needed to handle error state
      }
    });
  }

  getCommentCount(): void {
    this.commentService.getCommentCount().subscribe({
      next: (result) => {
        this.commentCount = result.count;
      },
      error: (error) => {
        console.error('Error getting comment count', error);
        this.commentCount = 0;
      }
    });
  }

  loadCurrentCharacter(): void {
    this.currentCharacterId = this.characterService.getCurrentCharacterId();
    
    if (this.currentCharacterId) {
      this.characterService.getCharacter(this.currentCharacterId).subscribe({
        next: (character) => {
          this.currentCharacter = character;
        },
        error: (error) => {
          console.error('Error loading current character', error);
          this.currentCharacter = null;
          this.characterService.clearCurrentCharacter();
        }
      });
    } else {
      this.currentCharacter = null;
    }
  }

  setCurrentCharacter(characterId: string): void {
    this.characterService.setCurrentCharacter(characterId);
  }

  clearCurrentCharacter(): void {
    this.characterService.clearCurrentCharacter();
  }
}