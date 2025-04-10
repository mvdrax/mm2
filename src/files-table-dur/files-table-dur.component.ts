/* import { Component, ViewEncapsulation } from '@angular/core';
import { DataService } from '../services/data-dur-service/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-files-table-dur',
  imports: [CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  standalone: true,
  templateUrl: './files-table-dur.component.html',
  styleUrl: './files-table-dur.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FilesTableDurComponent {
tab: number =1;
RecordsInvoicesList: any[] = [];
newFilteredList: any[] = [];
searchQueryFactures: string = ''; 
searchQueryFiches: string = '';
invoices: any[] = [];
paySlips: any[] = [];
startDateFactures: Date | null = null; 
endDateFactures: Date | null = null;   

startDateFiches: Date | null = null;   
endDateFiches: Date | null = null;   
  

constructor(private dataService: DataService) {}

//récupérer mes données à l'initialisation 

ngOnInit() {
  this.RecordsInvoicesList = this.dataService.getData();
  this.newFilteredList = this.RecordsInvoicesList.filter(
    item => item.docType === 'Facture'
  );

}

 
// filtrer les pdf selon leur type (facture ou fiche de paie)

getBlobUrl(base64: string): string {
const b64chain = atob(base64.split(',')[1]); //décodage de la châine en b64 en une chaîne de caractères ascii 

const byteArrays = new Uint8Array(b64chain.length); //création tableau d'octets
for (let i = 0; i <  b64chain.length; i++) {
  byteArrays[i] = b64chain.charCodeAt(i); //charCodeAt(i) renvoie le code de caractère Unicode (un nombre entier entre 0 et 65535) du caractère situé à l'index i de la chaîne b64chain
}

const blob = new Blob([byteArrays], { type: 'application/pdf'}); //créatopn d'une url blob
return URL.createObjectURL(blob);
}

//gérer l'alternance des ongletet les données affichées

onTabChange(tab: number) {
  this.tab = tab;

  if (tab === 1) {
    this.newFilteredList = this.invoices;
  } else if (tab === 2) {
    this.newFilteredList = this.paySlips;
  }

  
  this.filteredSearch(tab === 1 ? 'Facture' : 'Fiche');
}


//filtrer les résultats par rapport à la recherche textuelle

filteredSearch(docType: string) {


const filteredListByType = this.RecordsInvoicesList.filter( item => item.docType === docType);

if (docType === 'Facture') {
  this.newFilteredList  = !this.searchQueryFactures ? filteredListByType : filteredListByType.filter
  (item => item.companyName.toLowerCase().includes(this.searchQueryFactures.toLowerCase())
);
} else if (docType === 'Fiche') {
  this.newFilteredList = !this.searchQueryFiches ? filteredListByType : filteredListByType.filter
  (item => item.companyName.toLowerCase().includes(this.searchQueryFiches.toLowerCase())
);
}
}




applyDateFilter(docType: string) {

  if (docType === 'Facture') {
  if (this.startDateFactures && this.endDateFactures) {
    if (this.startDateFactures > this.endDateFactures) {
      alert ("Dates non conformes");
      return;
    }

    this.newFilteredList = this.RecordsInvoicesList.filter(item => {
      const itemDate = new Date(item.period);
      return  (
        item.docType === 'Facture' &&
        itemDate >= this.startDateFactures! && 
        itemDate <= this.endDateFactures!
      );
    });
  
  } else {
    alert("Champ vide");
  }
  } else if (docType === 'Fiche') {
    if (this.startDateFiches && this.endDateFiches) {
      if (this.startDateFiches > this.endDateFiches) {
        alert ("Dates non conformes");
      return;
      }
      this.newFilteredList = this.RecordsInvoicesList.filter(item => {
        const itemDate = new Date(item.period);
        return (
          item.docType === 'Fiche' && 
          itemDate >= this.startDateFiches! &&
          itemDate <= this.endDateFiches! 
        );
      });
    } else {
      alert('Veuillez sélectionner les deux dates pour les fiches de paie !');
    }
  }

}


}
  */
