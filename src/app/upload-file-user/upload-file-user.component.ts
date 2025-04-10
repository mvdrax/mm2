import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileService } from '../../services/files-service/files.service';
import { CommonModule, NgIf } from '@angular/common';


@Component({
  selector: 'app-upload-file-user',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './upload-file-user.component.html',
  styleUrl: './upload-file-user.component.scss',
  standalone: true
})
export class UploadFileUserComponent {

  @Output() closePopupEvent = new EventEmitter<void>();
  @Output() fileUploaded = new EventEmitter<any>();


  uploadFileForm: FormGroup;
  fileToUpload: File | null = null;
  uploadedFiles: any[] = [];

constructor(private fb: FormBuilder, private fileService : FileService) {

console.log("jkfjjjkfkjfjd")

this.uploadFileForm = this.fb.group({
  fileType: ['', Validators.required],
  agenceCode: ['', Validators.required],
  dateFile: ['', [Validators.required]],
  tiersName: ['', Validators.required],
  file: [null, Validators.required] 

});

}


onFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.fileToUpload = file;
    this.uploadFileForm.patchValue({ file: file });
    console.log('Fichier sélectionné :', file);
  }
}

onSubmit(): void {
  console.log('Formulaire valide ?', this.uploadFileForm.valid);
  console.log('Fichier sélectionné ?', this.fileToUpload);
  if (this.uploadFileForm.valid && this.fileToUpload) {
    const formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    console.log('file')
    formData.append('fileType', this.uploadFileForm.get('fileType')?.value);
    formData.append('agenceCode', this.uploadFileForm.get('agenceCode')?.value);
      formData.append('dateFile', this.uploadFileForm.get('dateFile')?.value);
      formData.append('tiersName', this.uploadFileForm.get('tiersName')?.value);


      this.fileService.uploadFile(formData).subscribe(
        response => {
          console.log('Fichier téléchargé', response);
          window.alert("Fichier téléchargé avec succés");

          const newFile = {
            name: this.fileToUpload?.name,
            fileType: this.uploadFileForm.get('fileType')?.value,
            agenceCode: this.uploadFileForm.get('agenceCode')?.value,
            dateFile: this.uploadFileForm.get('dateFile')?.value,
            tiersName: this.uploadFileForm.get('tiersName')?.value
          };

          this.fileUploaded.emit(newFile); 
          this.fileToUpload = null;
          this.uploadFileForm.reset();

        },
        error => {
          console.error('Erreur de téléchargement', error)
        }
      );
  }
}


closeAddForm() {
  const popContent = document.querySelector('.upload-container') as HTMLElement;
  if (popContent) {
    popContent.classList.add('closing');

  setTimeout(() =>  {
  this.closePopupEvent.emit();
  }, 500
);

  }

  
}



}
