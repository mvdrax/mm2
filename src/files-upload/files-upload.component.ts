import { Component, ViewEncapsulation, ChangeDetectorRef  } from '@angular/core';
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

  tab: number =1;

  filesListByAgencyFiche: any[] = [];
  filesListByAgencyFact: any[] = [];

  newFilteredList: any[] = [];

  uploadedFiles: any[] = []; 

  get mergedList(): any[] {
    return [...this.uploadedFiles, ...this.newFilteredList];
  }

  searchQueryFactures: string = ''; 
  searchQueryFiches: string = '';
  invoices: any[] = [];
  paySlips: any[] = [];
  startDateFactures: Date | null = null; 
  endDateFactures: Date | null = null;   
  
  startDateFiches: Date | null = null;   
  endDateFiches: Date | null = null; 

 pdfFiles: any[] = [];

 listAgences: any[] = [];
 showAgences = false;

 filesListByAgency:  any[] = [];
 selectedAgence: string = ''
 agence: string ='';

 blobUrls: { [key: string]: string } = {}; //dernier ajout 

  constructor(private pdfFilesService: FileService, private cdr: ChangeDetectorRef) {}
    
  
  ngOnInit(): void {

    



    this.pdfFilesService.getAgencies().subscribe(data => {
      console.log('Réponse brute de l API:', data);
      this.listAgences = data.sort((a,b) => a.localeCompare(b));

      this.selectedAgence = this.listAgences[0];

      this.loadingFilesByAgency(this.selectedAgence);
       console.log(this.selectedAgence)



    });


    this.mergedList.forEach(item => {  //dernier ajout 

      if (item.docFile) {
        this.blobUrls[item.docFile] = this.getBlobUrl(item.docFile);
      }
    });
  

  }


  agenceChanging(agence: string) {
    console.log('fct agencechanging appelée')
    this.loadingFilesByAgency(agence)
  }


 loadingFilesByAgency(agence: string) {
  console.log('fct loading appelée')
  this.pdfFilesService.getPdfFilesByAgency(agence).subscribe(data => {
    this.filesListByAgency = data;
    console.log(data)
  })

 }


   
  openAddForm() {
    this.isFormOpen = true;
  }

  closeAddForm() {
    this.isFormOpen = false;
  }
  


  onFileUploaded(newFile: any) {
    console.log("Nouveau fichier  :", newFile);
    this.uploadedFiles.push(newFile); 
    this. filterFilesByTab();
  }


  





  //gérer l'alternance des ongletet les données affichées
  
  onTabChange(tab: number) {
    this.tab = tab;
    this.filterFilesByTab(); 
  }
  
  filterFilesByTab() {

  
    if (this.tab === 1) {
      this.filesListByAgencyFact = this.filesListByAgency.filter(item => item.fileType === 'Fact');
    } else if (this.tab === 2) {
      this.filesListByAgencyFiche = this.filesListByAgency.filter(item => item.fileType === 'Fiche');
    }
    console.log('Fichiers après filtrage:', this.filesListByAgency);
  
    }
  
  



  // filtrer les pdf selon leur type (facture ou fiche de paie)
  
  getBlobUrl(docFile: string): string {
  const b64chain = docFile; 
  console.log('chaine vld');
const newb4chain = b64chain.replace(/['"]/g, '');
  if (!newb4chain) {
    throw new Error('La chaîne Base64 est invalide.');
    console.error('chaine invalide');
  }

  try {
    console.log('Début du décodage...');
    const db64chain = atob(newb4chain); // Tentative de décodage Base64
    console.log('Chaîne décodée avec succès');

  const byteArrays = new Uint8Array(db64chain.length); //création tableau d'octets
  for (let i = 0; i <  db64chain.length; i++) {
    byteArrays[i] = db64chain.charCodeAt(i); //charCodeAt(i) renvoie le code de caractère Unicode (un nombre entier entre 0 et 65535) du caractère situé à l'index i de la chaîne b64chain
  }
  console.log('Tableau d\'octets:', byteArrays);


  
  


  const blob = new Blob([byteArrays], { type: 'application/pdf'}); //création d'une url blob
  console.log('Blob créé:', blob);
  const url = URL.createObjectURL(blob);

console.log('URL générée:', url);



return url;

  } catch (error) {
    console.error('Erreur lors du décodage Base64:', error);
    throw new Error('Erreur de décodage Base64');
  }

  }
  
  
  
  
  //filtrer les résultats par rapport à la recherche textuelle
  
  filteredSearch(fileType: string) {
  
  
    const filteredListByType = this.pdfFiles.filter( item => item.fileType === fileType);
  
  if (fileType === 'Fact') {
    this.newFilteredList  = !this.searchQueryFactures ? filteredListByType : filteredListByType.filter
    (item => item.tiersName.toLowerCase().includes(this.searchQueryFactures.toLowerCase())
  );
  } else if (fileType === 'Fiche') {
    this.newFilteredList = !this.searchQueryFiches ? filteredListByType : filteredListByType.filter
    (item => item.tiersName.toLowerCase().includes(this.searchQueryFiches.toLowerCase())
  );
  }
  }
  
  



// fusion des listes filtrées et des valeurs juste ajoutées



  
  
  applyDateFilter(fileType: string) {
  
    if (fileType === 'Fact') {
    if (this.startDateFactures && this.endDateFactures) {
      if (this.startDateFactures > this.endDateFactures) {
        alert ("Dates non conformes");
        return;
      }
  
      this.newFilteredList = this.pdfFiles.filter(item => {
        const itemDate = new Date(item.dateFile);
        return  (
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
          alert ("Dates non conformes");
        return;
        }
        this.newFilteredList = this.pdfFiles.filter(item => {
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





// Déclencher menu déroulant pour choisir une agence


toggleAgences() {

 
  
this.showAgences = !this.showAgences

if (this.showAgences && this.listAgences.length === 0 ) {

  this.pdfFilesService.getAgencies().subscribe(data => {
    console.log('Réponse  AGENCES brute de l API:', data);
    this.listAgences = data;

});

/*
  const optionDft = document.createElement("option");
  optionDft.text = "-- Sélectionnez une agence --";
  optionDft.disabled = true;
  optionDft.selected = true;
  select?.appendChild(optionDft);



  
  this.pdfFilesService.getAgencies().subscribe(data => {
    console.log('Réponse  AGENCES brute de l API:', data);
    this.listAgences = data;
    data.forEach(agence => {
      const option = document.createElement('option');
      option.value = agence;
      option.text = agence;
      select?.appendChild(option);
      
    }); 
  
  });   */ 
   
  }



}













}
