import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FilesUploadComponent } from '../files-upload/files-upload.component';

import { CommonModule } from '@angular/common';
import { UploadFileUserComponent } from './upload-file-user/upload-file-user.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    FilesUploadComponent,
    UploadFileUserComponent,
    CommonModule,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'test1MM';
}
