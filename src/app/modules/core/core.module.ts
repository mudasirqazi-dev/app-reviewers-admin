import { NgModule } from '@angular/core';
import { ApiService } from './services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';

const appModules = [
  FormsModule,
  ReactiveFormsModule,
  MatChipsModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatIconModule,
  MatTabsModule,
];

const materialModules = [MatDialogModule];

const plugins = [];
@NgModule({
  imports: [materialModules, plugins, appModules],
  exports: [materialModules, plugins, appModules],
  providers: [ApiService],
})
export class CoreModule {}
