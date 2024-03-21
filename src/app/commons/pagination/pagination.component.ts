import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent{

  @Input() pageSize!: number
  @Input() pageSizeOptions!: number[]
  @Output() onPageChange = new EventEmitter<{page: number, size: number}>()
  private _pages: number = 1;
  currentPage: number = 1
  
  constructor(private changeDetector: ChangeDetectorRef){}

  prevPage() {
    this.currentPage - 1 < 1 ? this.currentPage = 1 : --this.currentPage
    this.onPageChange.emit({page: this.currentPage, size: this.pageSize})
  }

  nextPage() {
    this.currentPage + 1 > this.pages ? this.currentPage = this.pages : ++this.currentPage
    this.onPageChange.emit({page: this.currentPage, size: this.pageSize})
  }

  handlePageSizeChange(pageSize: any) {
    this.pageSize = pageSize
    this.currentPage = 1
    this.onPageChange.emit({page: this.currentPage, size: this.pageSize})
  }

  public get pages(): number {
    return this._pages;
  }

  public set pages(value: number) {
    this._pages = value;
    this.changeDetector.markForCheck()
  }
}
