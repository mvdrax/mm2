import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  
  ],
  declarations: [
    
 ],
 providers: [provideHttpClient()] ,
 bootstrap: [  ]
})

export class AppModule { }
