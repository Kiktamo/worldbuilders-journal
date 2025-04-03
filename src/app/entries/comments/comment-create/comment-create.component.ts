import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../comment.service';
import { CharacterService } from '../../../characters/character.service';
import { Comment } from '../comment.model';
import { Character } from '../../../characters/character.model';

@Component({
  selector: 'app-comment-create',
  standalone: false,
  templateUrl: './comment-create.component.html',
  styleUrl: './comment-create.component.css'
})
export class CommentCreateComponent implements OnInit, OnChanges {
  @Input() entryId: string;
  @Input() commentToEdit: Comment | null = null;
  @Output() commentAdded = new EventEmitter<Comment>();
  @Output() commentUpdated = new EventEmitter<Comment>();
  @Output() editCancelled = new EventEmitter<void>();

  commentForm: FormGroup;
  currentCharacter: Character | null = null;
  isEditMode = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private characterService: CharacterService
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const currentCharacterId = this.characterService.getCurrentCharacterId();
    if (currentCharacterId) {
      this.characterService.getCharacter(currentCharacterId).subscribe({
        next: (character) => {
          this.currentCharacter = character;
        },
        error: (error) => {
          console.error('Error loading current character', error);
        }
      });
    }

    this.characterService.currentCharacterChanged.subscribe(() => {
      this.loadCurrentCharacter();
    });
  }

  ngOnChanges(): void {
    if (this.commentToEdit) {
      this.isEditMode = true;
      this.commentForm.patchValue({
        content: this.commentToEdit.content
      });
    } else {
      this.isEditMode = false;
      this.commentForm.reset();
    }
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
        }
      });
    } else {
      this.currentCharacter = null;
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.commentForm.valid && this.currentCharacter) {
      const commentData: Comment = {
        characterId: this.currentCharacter._id!,
        entryId: this.entryId,
        content: this.commentForm.value.content
      };

      if (this.isEditMode && this.commentToEdit) {
        this.commentService.updateComment(this.commentToEdit._id!, commentData).subscribe({
          next: (updatedComment) => {
            this.commentUpdated.emit(updatedComment);
            this.resetForm();
          },
          error: (error) => {
            console.error('Error updating comment', error);
          }
        });
      } else {
        this.commentService.createComment(commentData).subscribe({
          next: (newComment) => {
            this.commentAdded.emit(newComment);
            this.resetForm();
          },
          error: (error) => {
            console.error('Error creating comment', error);
          }
        });
      }
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.editCancelled.emit();
  }

  resetForm(): void {
    this.commentForm.reset();
    this.isEditMode = false;
    this.commentToEdit = null;
    this.submitted = false;
  }
}