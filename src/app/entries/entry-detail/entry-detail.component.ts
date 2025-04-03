import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryService } from '../entry.service';
import { CommentService } from '../comments/comment.service';
import { CharacterService } from '../../characters/character.service';
import { Entry } from '../entry.model';
import { Comment } from '../comments/comment.model';
import { Character } from '../../characters/character.model';

@Component({
  selector: 'app-entry-detail',
  standalone: false,
  templateUrl: './entry-detail.component.html',
  styleUrl: './entry-detail.component.css'
})
export class EntryDetailComponent implements OnInit {
  entry: Entry | null = null;
  comments: Comment[] = [];
  commentToEdit: Comment | null = null;
  isLoading: boolean = true;
  isLoadingComments: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entryService: EntryService,
    private commentService: CommentService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadEntry(id);
        this.loadComments(id);
      }
    });
  }

  loadEntry(id: string): void {
    this.isLoading = true;
    this.entryService.getEntry(id).subscribe({
      next: (entry) => {
        this.entry = entry;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading entry', error);
        this.isLoading = false;
        this.router.navigate(['/entries']);
      }
    });
  }

  loadComments(entryId: string): void {
    this.isLoadingComments = true;
    this.commentService.getCommentsByEntry(entryId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoadingComments = false;
      },
      error: (error) => {
        console.error('Error loading comments', error);
        this.isLoadingComments = false;
        this.comments = [];
      }
    });
  }

  onCommentAdded(comment: Comment): void {
    this.comments = [comment, ...this.comments];
  }

  onCommentUpdated(updatedComment: Comment): void {
    this.comments = this.comments.map(comment => 
      comment._id === updatedComment._id ? updatedComment : comment
    );
    this.commentToEdit = null;
  }

  onEditComment(comment: Comment): void {
    this.commentToEdit = comment;
  }

  onEditCancelled(): void {
    this.commentToEdit = null;
  }

  deleteComment(commentId: string): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c._id !== commentId);
          
          if (this.commentToEdit && this.commentToEdit._id === commentId) {
            this.commentToEdit = null;
          }
        },
        error: (error) => {
          console.error('Error deleting comment', error);
        }
      });
    }
  }

  deleteEntry(): void {
    if (!this.entry) return;

    if (confirm('Are you sure you want to delete this entry?')) {
      this.entryService.deleteEntry(this.entry._id!).subscribe({
        next: () => {
          this.router.navigate(['/entries']);
        },
        error: (error) => {
          console.error('Error deleting entry', error);
        }
      });
    }
  }
}