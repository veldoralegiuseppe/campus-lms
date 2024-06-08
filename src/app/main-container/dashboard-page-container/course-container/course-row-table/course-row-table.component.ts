import { Component } from '@angular/core';
import { Row } from 'src/app/commons/table-v2/Row';
import { Course } from '../Course';
import { AuthenticationComponent } from 'src/app/commons/authentication/authentication.component';

@Component({
  selector: 'app-course-row-table',
  templateUrl: './course-row-table.component.html',
  styleUrls: ['./course-row-table.component.scss']
})
export class CourseRowTableComponent extends AuthenticationComponent implements Row{

  index!: number;
  loading: boolean = false
  course?: Course;


  generateRow: (data: any) => any = (data: {course: Course, loading: boolean}) => { 
    this.course = data.course
    this.loading = data.loading
    //console.log(`Loading: ${this.loading}, index: ${this.index}`)
  }
}
