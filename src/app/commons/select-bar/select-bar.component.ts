import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: '.app-select-bar',
  templateUrl: './select-bar.component.html',
  styleUrls: ['./select-bar.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({'max-height': '300px'})),
      state('close', style({'max-height': '0'})),
      transition('open => closed' , [animate('0.1s')]),
      transition('closed => open' , [animate('0.1s')]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: SelectBarComponent
    }
  ]
})
export class SelectBarComponent implements ControlValueAccessor {
  
  isOpen: boolean = false
  optionSelected? : any
  touched: boolean = false
  @Input() options: any[] = [];
  @Output() onOptionSelected = new EventEmitter<any>()
  onChange?: (option: any) => {}
  onTouched?: () => {}

  constructor(private changeDetetor: ChangeDetectorRef){}

  ngOnInit(): void {
    if(!this.options || this.options.length <= 0) return 
    this.optionSelected = this.options.at(0)
  }

  toggle() {
    this.isOpen = !this.isOpen
  }

  onCategoryClick(option : any) {
    if(option == this.optionSelected) return
    this.markAsTouched()
    this.optionSelected = option
    this.onOptionSelected.emit(this.optionSelected)
    this.changeDetetor.markForCheck()
    if(this.onChange) this.onChange(this.optionSelected)
  }

  writeValue(option: any): void {
    this.optionSelected = option
    this.changeDetetor.markForCheck()
  }

  registerOnChange(onChange: any): void {
   this.onChange = onChange
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isOpen = isDisabled
  }

  private markAsTouched() {
    if (!this.touched) {
      if(this.onTouched) this.onTouched();
      this.touched = true;
    }
  }

}
