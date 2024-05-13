export interface Course {
    studenteCourse?: StudenteCourse,
    docenteCourse?: DocenteCourse,
    adminCourse?: AdminCourse
}

export interface StudenteCourse{
    corso: String,
    sessioni: String,
    moduli: String
}

export interface DocenteCourse{
    corso: String,
    sessioni: String,
    studenti: String
}

export interface AdminCourse{
    corso: String,
    sessioni: String,
    studenti: String
}