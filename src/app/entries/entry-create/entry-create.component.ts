import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryService } from '../entry.service';
import { ImageUploadService } from '../../shared/image-upload.service';
import { Entry } from '../entry.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-entry-create',
  standalone: false,
  templateUrl: './entry-create.component.html',
  styleUrl: './entry-create.component.css'
})
export class EntryCreateComponent implements OnInit, OnDestroy {
  entryForm: FormGroup;
  isEditMode = false;
  entryId: string | null = null;
  submitted = false;

  categories = [
    'Location', 'Character', 'Event', 'Item', 
    'Creature', 'Culture', 'History', 'Other'
  ];

  private initialImageUrl: string = '';
  private formSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private entryService: EntryService,
    private imageUploadService: ImageUploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.entryForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      content: ['', Validators.required],
      imageUrl: ['https://placehold.co/300x200']
    });
    
    this.formSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.entryId = id;
        this.loadEntry(id);
      }
    });
    
    this.initialImageUrl = this.entryForm.get('imageUrl')?.value;
    this.formSubscription = this.entryForm.get('imageUrl')?.valueChanges.subscribe(
      newValue => {
        if (newValue && newValue !== this.initialImageUrl) {
          this.initialImageUrl = newValue;
        }
      }
    );
  }
  
  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
    
    const currentImageUrl = this.entryForm.get('imageUrl')?.value;
    if (!this.submitted && 
        currentImageUrl && 
        currentImageUrl.includes('uploads/') &&
        (!this.isEditMode || this.initialImageUrl !== currentImageUrl)) {
      this.imageUploadService.deleteImage(currentImageUrl).subscribe({
        error: (err) => console.error('Error cleaning up image on destroy', err)
      });
    }
  }

  loadEntry(id: string): void {
    this.entryService.getEntry(id).subscribe({
      next: (entry) => {
        this.entryForm.patchValue({
          title: entry.title,
          category: entry.category,
          content: entry.content,
          imageUrl: entry.imageUrl
        });
      },
      error: (error) => {
        console.error('Error loading entry', error);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.entryForm.valid) {
      const entryData: Entry = this.entryForm.value;

      if (this.isEditMode && this.entryId) {
        this.entryService.updateEntry(this.entryId, entryData).subscribe({
          next: () => {
            this.router.navigate(['/entries', this.entryId]);
          },
          error: (error) => {
            console.error('Error updating entry', error);
            this.submitted = false;
          }
        });
      } else {
        this.entryService.createEntry(entryData).subscribe({
          next: (newEntry) => {
            this.router.navigate(['/entries', newEntry._id]);
          },
          error: (error) => {
            console.error('Error creating entry', error);
            this.submitted = false;
          }
        });
      }
    } else {
      this.submitted = false;
    }
  }

  get f() { return this.entryForm.controls; }
}