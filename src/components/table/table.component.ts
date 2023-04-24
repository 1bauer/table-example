import { Component, Input } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Product } from 'src/services/fakestoreapi/models/product';

@Component({
  selector: 'lib-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  //sorting
  private _sortedBy: BehaviorSubject<{ column: string; direction: "asc" | "desc"; } | undefined> = new BehaviorSubject<{ column: string; direction: "asc" | "desc"; } | undefined>(undefined);
  $sortedBy = this._sortedBy.asObservable();

  //sorting
  private _searchValue: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  $searchValue = this._searchValue.asObservable();


  //raw data input
  private _data: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private $data: Observable<any> = this._data.asObservable();

  private $filteredData = combineLatest([this.$data, this.$searchValue]).pipe(map(([data, searchValue]) => {
    if (!!searchValue) {
      let newdata: any[] = [];

      for (const entity of data) {
        const columns = this.columns ?? Object.getOwnPropertyNames(entity);
        for (const column of columns) {
          if ((entity[column] + "").toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) && newdata.indexOf(entity) < 0) {
            newdata.push(entity);
          }
        }
      }
      return newdata;
    } else {
      return data;
    }
  }))

  //pagination
  private _itemsPerPage: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  public $itemsPerPage: Observable<number | undefined> = this._itemsPerPage.asObservable();

  //current pagination page
  private _paginationPage: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public $paginationPage: Observable<number> = this._paginationPage.asObservable();

  //count of paginationpages
  public $maxPaginationCount: Observable<number | undefined> = combineLatest([this.$filteredData, this.$itemsPerPage]).pipe(map(([data, itemsPerPage]) => {
    if (!!data && !!itemsPerPage) {
      if (data.length < itemsPerPage) {
        return 1;
      }

      return Math.ceil((data.length / itemsPerPage))
    }
    else {
      return undefined;
    }
  }))

  public $paginationDisplayValue: Observable<{ name: string, value: number }[] | undefined> = this.$maxPaginationCount.pipe(map((maxCountPages) => {
    if (!maxCountPages) {
      return undefined;
    }

    const displayvalue: { name: string, value: number }[] = [];

    for (let i = 0; i < maxCountPages; i++) {
      displayvalue.push({ value: i, name: i.toLocaleString() })
    }
    return displayvalue;
  }))




  //data which get displayed in component
  $displayData: Observable<any> = combineLatest([this.$filteredData, this.$itemsPerPage, this.$paginationPage, this.$sortedBy, this.$searchValue]).pipe(map(([data, itemsPerPage, currentpage, sorting]) => {
    if (!data) {
      return undefined;
    }

    let diplaydata = [...data];



    if (sorting?.direction === 'asc') {
      diplaydata?.sort((a: any, b: any) => (a[sorting.column] > b[sorting.column]) ? 1 : ((b[sorting.column] > a[sorting.column]) ? -1 : 0))
    }
    else if (sorting?.direction === 'desc') {
      diplaydata?.sort((a: any, b: any) => (a[sorting.column] < b[sorting.column]) ? 1 : ((b[sorting.column] < a[sorting.column]) ? -1 : 0))
    }
    if (typeof itemsPerPage === "number" && typeof currentpage === "number") {

      const start = itemsPerPage * currentpage;
      const end = start + itemsPerPage;
      diplaydata = data.slice(start, end)
    }


    return diplaydata;

  }))

  //Inputs
  @Input() set itemsPerPage(value: number | undefined) {
    this._itemsPerPage.next(value);
    this._paginationPage.next(0);
  }




  @Input() set data(value: any) {
    this._data.next(value);
    this._sortedBy.next(undefined);
    if (this.columns.length === 0) {
      this.columns = Object.getOwnPropertyNames(value[0]);
    }
  }

  get data(): any {
    return this._data;
  }






  @Input()
  columns: string[] = [];


  sortBy(column: string): void {
    let value: { column: string; direction: "asc" | "desc"; } | undefined = undefined;

    const currentvalue = this._sortedBy.value;


    if (currentvalue?.column === column && currentvalue.direction === 'asc') {
      value = { direction: 'desc', column: column }
    }
    else if (currentvalue?.column !== column || !currentvalue) {
      value = { direction: 'asc', column: column }
    }

    this._sortedBy.next(value);
  }


  paginationChange(value: number) {
    this._paginationPage.next(value);
  }

  onContentChange(entity: any, column: string, data: any) {

    const newdata = [...this._data.value]
    const index = newdata.indexOf(entity);
    if (newdata[index][column] !== data.target.outerText) {
      newdata[index][column] = data.target.outerText
    }

    this._data.next(newdata);
  }

  searchValueChange(value: any) {
    const searchValue = value.target?.value;
    this._searchValue.next(searchValue);

    this._paginationPage.next(0);
  }
}
