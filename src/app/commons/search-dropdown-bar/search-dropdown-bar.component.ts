import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DropdownOption } from './dropdown-option';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-search-dropdown-bar',
  templateUrl: './search-dropdown-bar.component.html',
  styleUrls: ['./search-dropdown-bar.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({'max-height': '300px'})),
      state('close', style({'max-height': '0'})),
      transition('open => closed' , [animate('0.2s')]),
      transition('closed => open' , [animate('0.2s')]),
    ])
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: SearchDropdownBarComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchDropdownBarComponent implements OnInit, ControlValueAccessor {
 
  isOpen: boolean = false;
  categoriaSelezionata : String = ""
  like: String = ""
  @Input() list: DropdownOption[] = []
  inputPlaceholder: String = ""
  touched: boolean = false
  onChange?: (option: any) => {}
  onTouched?: () => {}

  constructor(private changeDetector: ChangeDetectorRef){}

  ngOnInit(): void {
    if(!this.list || this.list.length <= 0) return 
    this.categoriaSelezionata = this.list.at(0)!.value
    this.inputPlaceholder = "Cerca in " + this.categoriaSelezionata.toLocaleLowerCase()
  }

  toggle() {
    this.isOpen = !this.isOpen
  }
    
  onCategoryClick(categoria : String) {
    if(categoria == this.categoriaSelezionata) return
   
    this.markAsTouched()
    this.categoriaSelezionata = categoria
    this.inputPlaceholder = "Cerca in " + this.categoriaSelezionata.toLocaleLowerCase()
    this.changeDetector.markForCheck()
    if(this.onChange) this.onChange({option: categoria, like: this.like})
  }

  onInsertText(){
    this.markAsTouched()
    if(this.onChange) this.onChange({option: this.categoriaSelezionata, like: this.like})
  }

  writeValue(input: {option: String, like: String}): void {
    this.categoriaSelezionata = input.option
    this.like = input.like
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
