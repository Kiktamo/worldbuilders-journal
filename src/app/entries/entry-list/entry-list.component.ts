import { Component, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { Entry } from '../entry.model';

@Component({
  selector: 'app-entry-list',
  standalone: false,
  templateUrl: './entry-list.component.html',
  styleUrl: './entry-list.component.css'
})
export class EntryListComponent implements OnInit {
  entries: Entry[] = [];
  filteredEntries: Entry[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  isLoading: boolean = true;

  constructor(private entryService: EntryService) { }

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
    this.isLoading = true;
    this.entryService.getEntries().subscribe({
      next: (entries) => {
        this.entries = entries;
        this.filteredEntries = [...entries];
        
        this.categories = [...new Set(entries.map(entry => entry.category))];
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading entries', error);
        this.isLoading = false;
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    
    if (category === 'all') {
      this.filteredEntries = [...this.entries];
    } else {
      this.filteredEntries = this.entries.filter(entry => entry.category === category);
    }
  }

  deleteEntry(id: string): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.entryService.deleteEntry(id).subscribe({
        next: () => {
          this.loadEntries();
        },
        error: (error) => {
          console.error('Error deleting entry', error);
        }
      });
    }
  }
}