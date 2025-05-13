import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FileService } from '../services/files-service/files.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UploadFileUserComponent } from '../app/upload-file-user/upload-file-user.component';

@Component({
  selector: 'app-files-upload',
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    UploadFileUserComponent
  ],
  standalone: true,
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FilesUploadComponent {

  isFormOpen = false;
  tab: number = 1;

  filesListByAgencyFiche: any[] = [];
  filesListByAgencyFact: any[] = [];
  newFilteredList: any[] = [];

  searchQueryFactures: string = '';
  searchQueryFiches: string = '';
  invoices: any[] = [];
  paySlips: any[] = [];

  startDateFactures: Date | null = null;
  endDateFactures: Date | null = null;

  startDateFiches: Date | null = null;
  endDateFiches: Date | null = null;

  listAgences: any[] = [];
  showAgences = false;

  filesListByAgency: any[] = [];
  selectedAgence: string = '';
  agence: string = '';

  blobUrls: { [key: string]: string } = {};

  selectedMonthYear: string = '';
  monthYearOptions: string[] = [];

  constructor(private pdfFilesService: FileService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.pdfFilesService.getAgencies().subscribe(data => {
      this.listAgences = data.sort((a, b) => a.localeCompare(b));
      this.selectedAgence = this.listAgences[0];
      this.loadingFilesByAgency(this.selectedAgence);
    });
  }

  agenceChanging(agence: string) {
    this.loadingFilesByAgency(agence);
  }

  loadingFilesByAgency(agence: string) {
    this.pdfFilesService.getPdfFilesByAgency(agence).subscribe(data => {
      this.filesListByAgency = data;
      this.applyAllFilters();
      this.generateMonthYearOptions();

      this.blobUrls = {};
      this.filesListByAgency.forEach(item => {
        if (item.docFile) {
          this.blobUrls[item.docFile] = this.getBlobUrl(item.docFile);
        }
      });
    });
  }

  openAddForm() {
    this.isFormOpen = true;
  }

  closeAddForm() {
    this.isFormOpen = false;
  }

  onTabChange(tab: number) {
    this.tab = tab;
    this.selectedMonthYear = '';
    this.applyAllFilters();
    this.generateMonthYearOptions();
  }

  getBlobUrl(docFile: string): string {
    const b64chain = docFile.replace(/['"]/g, '');
    if (!b64chain) {
      throw new Error('La chaîne Base64 est invalide.');
    }

    try {
      const db64chain = atob(b64chain);
      const byteArrays = new Uint8Array(db64chain.length);
      for (let i = 0; i < db64chain.length; i++) {
        byteArrays[i] = db64chain.charCodeAt(i);
      }

      const blob = new Blob([byteArrays], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Erreur lors du décodage Base64:', error);
      throw new Error('Erreur de décodage Base64');
    }
  }

  filteredSearch(fileType: string) {
    this.applyAllFilters();
  }

  applyDateFilter(fileType: string) {
    if (fileType === 'Fact' && this.startDateFactures && this.endDateFactures) {
      if (this.startDateFactures > this.endDateFactures) {
        alert("Dates non conformes");
        return;
      }
    } else if (fileType === 'Fiche' && this.startDateFiches && this.endDateFiches) {
      if (this.startDateFiches > this.endDateFiches) {
        alert("Dates non conformes");
        return;
      }
    } else {
      alert("Champ vide");
      return;
    }

    this.applyAllFilters();
  }

  resetDatesFact() {
    this.startDateFactures = null;
    this.endDateFactures = null;
    this.applyAllFilters();
  }

  resetDatesFiches() {
    this.startDateFiches = null;
    this.endDateFiches = null;
    this.applyAllFilters();
  }

  toggleAgences() {
    this.showAgences = !this.showAgences;

    if (this.showAgences && this.listAgences.length === 0) {
      this.pdfFilesService.getAgencies().subscribe(data => {
        this.listAgences = data;
      });
    }
  }

  generateMonthYearOptions(): void {
    const uniqueMonthYears = new Set<string>();
    this.filesListByAgency.forEach(file => {
      if (file.fileType === (this.tab === 1 ? 'Fact' : 'Paie')) {
        const date = new Date(file.dateFile);
        const monthYear = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        uniqueMonthYears.add(monthYear);
      }
    });

    this.monthYearOptions = Array.from(uniqueMonthYears).sort((a, b) => {
      const [monthA, yearA] = a.split('/').map(Number);
      const [monthB, yearB] = b.split('/').map(Number);
      return yearB - yearA || monthB - monthA;
    });
  }

  onMonthYearChange(): void {
    this.applyAllFilters();
  }

  applyAllFilters() {
    const currentFileType = this.tab === 1 ? 'Fact' : 'Paie';
    const query = currentFileType === 'Fact' ? this.searchQueryFactures : this.searchQueryFiches;
    const startDate = currentFileType === 'Fact' ? this.startDateFactures : this.startDateFiches;
    const endDate = currentFileType === 'Fact' ? this.endDateFactures : this.endDateFiches;

    this.newFilteredList = this.filesListByAgency.filter(item => {
      if (item.fileType !== currentFileType) return false;

      if (query && !item.tiersName.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }

      if (startDate && endDate) {
        const itemDate = new Date(item.dateFile);
        if (itemDate < startDate || itemDate > endDate) {
          return false;
        }
      }

      if (this.selectedMonthYear) {
        const [month, year] = this.selectedMonthYear.split('/').map(Number);
        const itemDate = new Date(item.dateFile);
        if (itemDate.getMonth() + 1 !== month || itemDate.getFullYear() !== year) {
          return false;
        }
      }

      return true;
    });

    this.cdr.detectChanges();
  }

}
