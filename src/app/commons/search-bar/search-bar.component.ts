import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: SearchBarComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements ControlValueAccessor{
  

  @Input() placeholder:string = "Cerca"; 
  like: String = ""
  touched: boolean = false
  onChange?: (option: any) => {}
  onTouched?: () => {}

  onInsertText() {
    this.markAsTouched()
    if(this.onChange) this.onChange(this.like)
  }

  writeValue(like: String): void {
   this.like = like
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched
  }

  setDisabledState?(isDisabled: boolean): void {
    
  }

  private markAsTouched() {
    if (!this.touched) {
      if(this.onTouched) this.onTouched();
      this.touched = true;
    }
  }

}
