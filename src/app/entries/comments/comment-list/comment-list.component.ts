import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../comment.model';
import { CharacterService } from '../../../characters/character.service';
import { Character } from '../../../characters/character.model';

@Component({
  selector: 'app-comment-list',
  standalone: false,
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
})
export class CommentListComponent implements OnInit, OnChanges {
  @Input() comments: Comment[] = [];
  @Output() editComment = new EventEmitter<Comment>();
  @Output() deleteComment = new EventEmitter<string>();
  
  currentCharacterId: string | null = null;
  characterCache: {[key: string]: Character} = {};

  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {
    this.currentCharacterId = this.characterService.getCurrentCharacterId();
    
    this.characterService.currentCharacterChanged.subscribe(id => {
      this.currentCharacterId = id;
    });

    this.loadCharacterInfo();
  }

  ngOnChanges(): void {
    this.loadCharacterInfo();
  }

  loadCharacterInfo(): void {
    const characterIds = new Set(this.comments.map(comment => comment.characterId));
    
    characterIds.forEach(id => {
      if (!this.characterCache[id]) {
        this.characterService.getCharacter(id).subscribe({
          next: (character) => {
            this.characterCache[id] = character;
          },
          error: (error) => {
            console.error(`Error loading character ${id}`, error);
          }
        });
      }
    });
  }

  getCharacterImage(characterId: string): string {
    return this.characterCache[characterId]?.imageUrl || 'https://placehold.co/50';
  }

  getCharacterName(characterId: string): string {
    return this.characterCache[characterId]?.name || 'Unknown Character';
  }

  onEditComment(comment: Comment): void {
    this.editComment.emit(comment);
  }

  onDeleteComment(commentId: string): void {
    this.deleteComment.emit(commentId);
  }
}