import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: DatepickerComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: DatepickerComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerComponent implements ControlValueAccessor, Validator{


  dateSelected?: string
  date: string | null = null
  touched: boolean = false
  onChange?: (date: any) => {}
  onTouched?: () => {}
  @Input() placeholder: String = ""
  @ViewChild('datepicker') private datepicker?: ElementRef

  constructor(private changeDetector: ChangeDetectorRef){}

  onDateSelected() {
    if(!this.dateSelected) return
      this.date = new Date(this.dateSelected).toLocaleDateString('it-IT')
      this.markAsTouched()
      if(this.onChange) this.onChange(this.date)
  }

  openDatepicker() {
    let input : HTMLInputElement = this.datepicker?.nativeElement as HTMLInputElement
    input.showPicker()
  }

  writeValue(data: Date): void {
    if(data == undefined || data == null) this.date = null
    else if (data && !isNaN(data.getTime())) this.date = data.toLocaleDateString('it-IT')
    this.changeDetector.markForCheck()
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched
  }

  setDisabledState?(isDisabled: boolean): void {
   
  }

  validate(control: AbstractControl): ValidationErrors | null {
    let dateObj : Date = new Date(control.value)
    if (!isNaN(dateObj.getTime())) return null
    return {invalidData: control.value}
  }

  registerOnValidatorChange?(fn: () => void): void {
    
  }

  onDateModify() {
    this.markAsTouched() 

    if (this.onChange) {
      if(this.date == null || this.date == undefined || this.date?.length == 0) this.onChange(null)
      else this.onChange( this.checkData(this.date) ? this.date : 'Invalid Date')
      //console.log({isCorrect: this.checkData(this.date), localDate: new Date(this.date!).toLocaleDateString('it-IT')})
    }
  }

  private markAsTouched() {
    if (!this.touched) {
      if(this.onTouched) this.onTouched();
      this.touched = true;
    }
  }

  private checkData(str?: string | null): boolean{
    if(str == null || str == undefined) return false
    
    let isFormatted : boolean = str.match(/(^0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4}$)/) == null ? false : true
    if(!isFormatted) return false

    // DD/MM/YYYY
    let day = str.slice(0,2)
    let month = str.slice(3,5)
    let year = str.slice(6)
    return this.isValid(+day, +month-1, +year)
  }

  private daysInMonth(m: number, y: number) { // m is 0 indexed: 0-11
    switch (m) {
        case 1 :
            return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
        case 8 : case 3 : case 5 : case 10 :
            return 30;
        default :
            return 31
    }
  }

  private isValid(d: number, m: number, y: number) : boolean {
      return m >= 0 && m < 12 && d > 0 && d <= this.daysInMonth(m, y);
  }

}
