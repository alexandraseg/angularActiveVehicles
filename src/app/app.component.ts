import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  isExpanded = false;
  showSubmenu = false;
  isShowing = false;
  showSubSubMenu = false;

  title = 'AngularProjectVehicles';
  displayedColumns: string[] = ['serialNumber', 'fullName', 'issueDate', 'isApproved', 'tierAmount', 'registrationAmount', 'consumptionAmount', 'rewardAmount'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {} // Inject HttpClient

  ngOnInit() {
    this.http.get<any[]>('assets/records.json').subscribe(records => {
      this.dataSource = new MatTableDataSource(records);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  parseDate(dateString: string): Date {
    // Assuming dateString is in the format YYYYMMDD
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // Months are zero-based
    const day = parseInt(dateString.substring(6, 8), 10);
    return new Date(year, month, day);
  }
}
