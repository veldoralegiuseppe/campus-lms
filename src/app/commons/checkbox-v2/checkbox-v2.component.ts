import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox-v2',
  templateUrl: './checkbox-v2.component.html',
  styleUrls: ['./checkbox-v2.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: CheckboxV2Component
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxV2Component implements ControlValueAccessor {
  
  checked: boolean = false
  touched: boolean = false
  @Output() checkedEventEmitter = new EventEmitter<Boolean>()
  @Input() label: String = ""
  onChange?: (option: any) => {}
  onTouched?: () => {}

  constructor( private changeDetector : ChangeDetectorRef){}
  
  toggle(){
    this.checked = !this.checked
    if(this.onChange) this.onChange(this.checked)
    this.checkedEventEmitter.emit(this.checked)
    this.markAsTouched()
    this.changeDetector.markForCheck()
  }

  writeValue(checked: boolean): void {
    this.checked = checked
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

  private markAsTouched() {
    if (!this.touched) {
      if(this.onTouched) this.onTouched();
      this.touched = true;
    }
  }

}
