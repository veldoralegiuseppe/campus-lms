export interface Activity{
    studenteActivity?: StudenteActivity,
    docenteActivity?: DocenteActivity,
    adminActivity?: AdminActivity
}

export interface StudenteActivity{
    tipo: String,
    corso: String,
    data: String,
    dettaglio: String,
    idSessione?: number
}

export interface DocenteActivity{
    corso: String,
    sessione: String,
    data: String,
    daCorreggere: String,
    idSessione: number
}

export interface AdminActivity{
    
}