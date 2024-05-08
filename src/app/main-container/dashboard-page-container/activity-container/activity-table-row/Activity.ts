export interface Activity{
    studenteActivity?: StudenteActivity,
    docenteActivity?: DocenteActivity,
    adminActivity?: AdminActivity
}

export interface StudenteActivity{
    tipo: String,
    corso: String,
    data: String,
    dettaglio: String
}

export interface DocenteActivity{
    corso: String,
    sessione: String,
    data: String,
    correzione: String
}

export interface AdminActivity{
    
}