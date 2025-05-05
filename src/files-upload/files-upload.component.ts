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
      this.filterFilesByTab();

      this.generateMonthYearOptions();


      // Met à jour les blobUrls
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
    this.filterFilesByTab();

    this.generateMonthYearOptions();

    this.selectedMonthYear = '';
  }

  filterFilesByTab() {
    if (this.tab === 1) {
      this.newFilteredList = this.filesListByAgency.filter(item => item.fileType === 'Fact');
    } else if (this.tab === 2) {
      this.newFilteredList = this.filesListByAgency.filter(item => item.fileType === 'Paie');
    }
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


 /* openPdf(docFile: string, filename: string): void {
    const urlBlob = this.getBlobUrl(docFile);
    const newWin = window.open(urlBlob, '_blank');
    newWin.document.title = filename;
    newWin.document.body.innerHTML = `
      <iframe width="100%" height="100%" src="${urlBlob}" frameborder="0"></iframe>
    `;
  }*/

  filteredSearch(fileType: string) {

    const filteredListByType = this.filesListByAgency.filter(item => item.fileType === fileType);
    console.log('recherche', filteredListByType)

    if (fileType === 'Fact') {
      this.newFilteredList = !this.searchQueryFactures
        ? filteredListByType
        : filteredListByType.filter(item =>
            item.tiersName.toLowerCase().includes(this.searchQueryFactures.toLowerCase())
          );

          console.log('results sear', this.newFilteredList)
    } else if (fileType === 'Paie') {
      this.newFilteredList = !this.searchQueryFiches
        ? filteredListByType
        : filteredListByType.filter(item =>
            item.tiersName.toLowerCase().includes(this.searchQueryFiches.toLowerCase())
          );
    }

    this.cdr.detectChanges();
  }

  applyDateFilter(fileType: string) {
    if (fileType === 'Fact') {
      if (this.startDateFactures && this.endDateFactures) {
        if (this.startDateFactures > this.endDateFactures) {
          alert("Dates non conformes");
          return;
        }

        this.newFilteredList = this.filesListByAgency.filter(item => {
          const itemDate = new Date(item.dateFile);
          return (
            item.fileType === 'Fact' &&
            itemDate >= this.startDateFactures! &&
            itemDate <= this.endDateFactures!
          );
        });
      } else {
        alert("Champ vide");
      }
    } else if (fileType === 'Fiche') {
      if (this.startDateFiches && this.endDateFiches) {
        if (this.startDateFiches > this.endDateFiches) {
          alert("Dates non conformes");
          return;
        }

        this.newFilteredList = this.filesListByAgency.filter(item => {
          const itemDate = new Date(item.dateFile);
          return (
            item.fileType === 'Fiche' &&
            itemDate >= this.startDateFiches! &&
            itemDate <= this.endDateFiches!
          );
        });
      } else {
        alert('Veuillez sélectionner les deux dates pour les fiches de paie !');
      }
    }
  }

  resetDatesFact() {
    this.startDateFactures = null;
    this.endDateFactures = null;
    this.filterFilesByTab();
  }

  resetDatesFiches() {
    this.startDateFiches = null;
    this.endDateFiches = null;
    this.filterFilesByTab();
  }

  toggleAgences() {
    this.showAgences = !this.showAgences;

    if (this.showAgences && this.listAgences.length === 0) {
      this.pdfFilesService.getAgencies().subscribe(data => {
        this.listAgences = data;
      });
    }
  }
// Pour la sélection du mois/année


selectedMonthYear: string = '';
monthYearOptions: string[] = [];

generateMonthYearOptions(): void {
 // const factures = this.filesListByAgency.filter(item => item.fileType === 'Fact');

  const uniqueMonthYears = new Set<string>();
  this.newFilteredList.forEach(fact => {
    const date = new Date(fact.dateFile);
    const monthYear = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    uniqueMonthYears.add(monthYear);
  });

  this.monthYearOptions = Array.from(uniqueMonthYears).sort((a, b) => {
    const [monthA, yearA] = a.split('/').map(Number);
    const [monthB, yearB] = b.split('/').map(Number);
    return yearB - yearA || monthB - monthA;
  });
}

onMonthYearChange(): void {
  if (!this.selectedMonthYear) {
    this.filterFilesByTab(); 
    return;
  }

  const [selectedMonth, selectedYear] = this.selectedMonthYear.split('/').map(Number);

  const currentTabFileType = this.tab === 1 ? 'Fact' : 'Paie';

  this.newFilteredList = this.filesListByAgency.filter(item => {
    const itemDate = new Date(item.dateFile);
    return (
      item.fileType === currentTabFileType  &&
      itemDate.getMonth() + 1 === selectedMonth &&
      itemDate.getFullYear() === selectedYear

        

    );
  });
}



}