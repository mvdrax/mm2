import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //pour faire rqt http à l'api
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:3000/api/files'; // URL de l'API 

  constructor(private http: HttpClient) {}

 // méthode pour télécherger un fichier sur le site
  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData); //envoie la rqt
    
  }

  /* // Méthode pour récupérer un fichier depuis la bdd 
  getFile(fileId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${fileId}`, { responseType: 'blob' })  // on attend un obejt en binaire
       .pipe(
        catchError(this.handleError)  
      );
  }

*/ 
  //Méthode pour récupérer tous les pdfs dans un tableau 
  getPdfFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
    console.log('getPDf marche')
  }
  
  private handleError(error: any): Observable<never> {
    
    console.error('Une erreur est survenue', error);
    throw error;  
  }

// Méthode p our récupérer les factures selon l'agence 

getPdfFilesByAgency(agence: string): Observable<any[]> {
  console.log('getPDf marche', agence)
  return this.http.get<any[]>(`${this.apiUrl}/${agence}`);
  
}
  
//Méthode pour récupérer les agnces 

getAgencies(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/agences`);
  console.log('getAg marche')
}


}

