export class Column {
    headerColumn! : String;
    value! : any; 
    style? : { [klass: string]: any; }|null|undefined;
    isHeader? : boolean = false;
    isHTML? : boolean = false;
    id? : any;
    isComponent? : boolean;

    constructor(headerColumn: String, value: any, style?:{ [klass: string]: any; }|null|undefined, isHeader?: boolean, isHTML?: boolean, id? : any, isComponent?:boolean){
        this.headerColumn = headerColumn;
        this.value = value;
        this.style = style;
        this.isHeader = isHeader;
        this.isHTML = isHTML;
        this.id = id;
        this.isComponent = isComponent;
    }
}