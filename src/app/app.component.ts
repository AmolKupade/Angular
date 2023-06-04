import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableDataService } from './services/table-data.service';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular-crud-project';
  displayedColumns: string[] = [
    'id',
    'title',
    'price',
    'description',
    'category',
    'image',
    'rating',
    'options'
  ];
  dataSource!: MatTableDataSource<any>;
  items: any[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private service: TableDataService,

  ) { }

  ngOnInit(): void {
    this.service.getItems().subscribe((items: any) => {
      console.log(items)
      this.storeData = items
      this.dataSource = new MatTableDataSource(items);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  storeData: any[] = []

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteItem(id: number): void {
    const index = this.storeData.findIndex((obj: any) => obj.id === id);
    if (index !== -1) {
      this.storeData.splice(index, 1);
    }
    this.dataSource = new MatTableDataSource(this.storeData);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  }

  openHotelForm(data: any) {
    const dialogRef = this.dialog.open(FormComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.service.getItems().subscribe((items: any) => {
            this.dataSource = new MatTableDataSource(items);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          });
        }
      }
    })
  }

}
