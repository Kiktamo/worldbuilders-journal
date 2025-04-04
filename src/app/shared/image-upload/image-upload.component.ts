import { Component, Input, OnInit, forwardRef} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImageUploadService } from '../image-upload.service';

@Component({
  selector: 'app-image-upload',
  standalone: false,
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ]
})
export class ImageUploadComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = 'Image';
  @Input() placeholder: string = '';
  
  imageUrlControl = new FormControl('');
  currentImageUrl: string = '';
  isUploading: boolean = false;
  isDragging: boolean = false;
  error: string = '';
  inputId: string = `image-upload-${Math.random().toString(36).substring(2, 9)}`;
  
  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private imageUploadService: ImageUploadService) {}

  ngOnInit(): void {
    this.imageUrlControl.valueChanges.subscribe(value => {
      if (this.lastUploadedUrl && 
          value !== this.lastUploadedUrl &&
          this.lastUploadedUrl.includes('uploads/')) {
        this.imageUploadService.deleteImage(this.lastUploadedUrl).subscribe({
          error: (err) => console.error('Error cleaning up previous upload', err)
        });
        this.lastUploadedUrl = null;
      }
      
      this.currentImageUrl = value;
      this.onChange(value);
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer?.files.length) {
      this.handleFileUpload(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files.length) {
      this.handleFileUpload(event.target.files[0]);
    }
  }

  lastUploadedUrl: string | null = null;

  handleFileUpload(file: File): void {
    if (!file.type.includes('image/')) {
      this.error = 'Please select an image file.';
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      this.error = 'File size must be under 5MB.';
      return;
    }

    this.error = '';
    this.isUploading = true;

    this.imageUploadService.uploadImage(file).subscribe({
      next: (response) => {
        if (this.lastUploadedUrl && 
            this.lastUploadedUrl !== response.imageUrl && 
            this.lastUploadedUrl.includes('uploads/')) {
          this.imageUploadService.deleteImage(this.lastUploadedUrl).subscribe({
            error: (err) => console.error('Error cleaning up previous upload', err)
          });
        }
        
        this.lastUploadedUrl = response.imageUrl;
        
        this.imageUrlControl.setValue(response.imageUrl);
        this.isUploading = false;
      },
      error: (error) => {
        console.error('Error uploading image', error);
        this.error = 'Failed to upload image. Please try again.';
        this.isUploading = false;
      }
    });
  }

  writeValue(value: string): void {
    this.currentImageUrl = value || '';
    this.imageUrlControl.setValue(this.currentImageUrl, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.imageUrlControl.disable();
    } else {
      this.imageUrlControl.enable();
    }
  }
}