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
export class AppComponent implements OnInit {
  @ViewChild('input') input: any;

  vehicles: any[];
  selectedVehiclePlate: string | null = null;
  records: any[];
  drivers: any[];

  serialNumber: string | null = null;
  selectedDriver: string | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedStatus: string = 'all'; // Default to 'all'

  isExpanded = false;
  showSubmenu = false;
  isShowing = false;
  showSubSubMenu = false;

  title = 'AngularProjectVehicles';
  displayedColumns: string[] = ['serialNumber', 'fullName', 'issueDate', 'isApproved', 'tierAmount', 'registrationAmount', 'consumptionAmount', 'rewardAmount'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {
    this.vehicles = [];
    // Fetch data from the vehicles.json file
    this.http.get<any[]>('assets/vehicles.json').subscribe(data => {
      this.vehicles = data;
    });

    this.records = [];
    // Fetch data from the records.json file
    this.http.get<any[]>('assets/records.json').subscribe(records => {
      this.records = records;
      this.dataSource = new MatTableDataSource(records);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.drivers = [];
    // Fetch data from the drivers.json file
    this.http.get<any[]>('assets/drivers.json').subscribe(drivers => {
      this.drivers = drivers;
    });
  } 

  ngOnInit() {}

  onDriverSelectionChange(event: any) {
    this.selectedDriver = event.value;
  }

  
  onStatusSelectionChange(event: any) {
    this.selectedStatus = event.value;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterDriver(driverName: string) {
    this.dataSource.filter = driverName.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  applyFilterStatus(status: string) {
    this.dataSource.filter = status.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  search() {
    // console.log('Search method called');
    // Get selected filter values
    const serialNumber = this.serialNumber;
    const selectedDriver = this.selectedDriver;
    const startDate = this.startDate;
    const endDate = this.endDate;
    const status = this.selectedStatus;
    // console.log('Filters:', serialNumber, selectedDriver, status, startDate, endDate);

    // Filter records based on selected criteria
    let filteredRecords = this.records;

    if (serialNumber) {
      filteredRecords = filteredRecords.filter(record => record.serialNumber === serialNumber);
    }
  
    if (selectedDriver) {
      filteredRecords = filteredRecords.filter(record => record.fullName === selectedDriver);
    }

    if (startDate && endDate) {
      filteredRecords = filteredRecords.filter(record => {
        const issueDate = this.parseDate(record.issueDate);
        // console.log('issueDate:', issueDate)
        // console.log('startDate:', startDate)
        // console.log('endDate:', endDate)
        return issueDate >= startDate && issueDate <= endDate;
      });
    }
  
    if (status !== 'all') {
      const statusValue = status === 'true'; 
      filteredRecords = filteredRecords.filter(record => record.isApproved === statusValue);
    }
  
    // Update data source with filtered records
    this.dataSource.data = filteredRecords;
  }

  parseDate(dateString: string): Date {
    // format YYYYMMDD
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // Months are zero-based
    const day = parseInt(dateString.substring(6, 8), 10);
    return new Date(year, month, day);
  }

  selectVehicle(plate: string) {
    this.selectedVehiclePlate = plate;

    const filteredRecords = this.records.filter(record => record.plate === plate);

    filteredRecords.forEach(record => {
      const driver = this.drivers.find(driver => driver.id === record.driverId);
      if (driver) {
        record.fullName = driver.fullName;
      }
    });

    // // Assign the filtered records to the data source
    this.dataSource.data = filteredRecords;
  }
}
