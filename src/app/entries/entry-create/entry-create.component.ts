import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryService } from '../entry.service';
import { Entry } from '../entry.model';

@Component({
  selector: 'app-entry-create',
  standalone: false,
  templateUrl: './entry-create.component.html',
  styleUrl: './entry-create.component.css'
})
export class EntryCreateComponent implements OnInit {
  entryForm: FormGroup;
  isEditMode = false;
  entryId: string | null = null;
  submitted = false;

  // Predefined categories (could also be fetched from a service) 
  // I'll consider a few more and potentially using a database during enhancement.
  categories = [
    'Location', 'Character', 'Event', 'Item', 
    'Creature', 'Culture', 'History', 'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.entryForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      content: ['', Validators.required],
      imageUrl: ['https://placehold.co/300x200']
    });
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
          }
        });
      } else {
        this.entryService.createEntry(entryData).subscribe({
          next: (newEntry) => {
            this.router.navigate(['/entries', newEntry._id]);
          },
          error: (error) => {
            console.error('Error creating entry', error);
          }
        });
      }
    }
  }

  get f() { return this.entryForm.controls; }
}