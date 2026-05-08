import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documents-upload',
  standalone: true,
  templateUrl: './documents-upload.component.html',
  styleUrl: './documents-upload.component.scss',
})
export class DocumentsUploadComponent {
  constructor(private readonly router: Router) {}

  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  goBack(): void {
    void this.router.navigate(['/documents']);
  }

  openFilePicker(): void {
    this.fileInput?.nativeElement.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    // If no file payload is present, fallback to opening picker.
    if (!event.dataTransfer?.files?.length) {
      this.openFilePicker();
    }
  }

  onFileSelected(): void {
    // Placeholder for upload flow wiring.
  }
}
