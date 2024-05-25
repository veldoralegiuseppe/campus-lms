export interface Course {
    studenteCourse?: StudenteCourse,
    docenteCourse?: DocenteCourse,
    adminCourse?: AdminCourse
}

export interface StudenteCourse{
    id: number,
    corso: String,
    sessioni: String,
    moduli: String
}

export interface DocenteCourse{
    id: number,
    corso: String,
    sessioni: String,
    studenti: String
}

export interface AdminCourse{
    id:number,
    corso: String,
    sessioni: String,
    studenti: String
}