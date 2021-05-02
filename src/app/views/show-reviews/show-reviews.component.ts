import { Attribute, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AppProxyService } from 'src/app/services/app-proxy.service';
import { AppServiceService } from 'src/app/services/app-service.service';
import { FormControl } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { DateParsePipe } from 'src/app/pipes/date-parse.pipe';
import { EndReviewComponent } from '../end-review/end-review.component';

@Component({
  selector: 'app-show-reviews',
  templateUrl: './show-reviews.component.html',
  styleUrls: ['./show-reviews.component.css']
})
export class ShowReviewsComponent implements OnInit {
  getNvUserName = window.sessionStorage.getItem("nvUserName");
  getIUserId = +window.sessionStorage.getItem("iUserId");
  dynamicForm: FormGroup;
  projectReview: any = null;
  reasonList: any;
  statusList: any;
  projectTypeList: any;
  allProjectReview: any;
  percentsSum: any;
  ansInputTypes = [];
  questionTypes: any;
  grade: 0;
  constructor(private datePipe: DatePipe, private dateParse: DateParsePipe, private formBuilder: FormBuilder, private route: ActivatedRoute, private proxy: AppProxyService, private service: AppServiceService, private router: Router, public dialog: MatDialog) {
    this.dateParse = dateParse;
    this.proxy = proxy;
    this.service = service;
    this.dialog = dialog;
    this.datePipe = datePipe;
  }

  id: number;
  private sub: any;
  isResult: boolean;
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      this.isResult = params['isResult'] == 'true' ? true : false;
    });
    this.initializing();
    if (!this.isResult)
      this.dynamicForm = this.formBuilder.group({
        dRevDate: [new Date(), Validators.required],
        reviewTime: [new Date().toLocaleTimeString(), Validators.required],
        questions: new FormArray([])
      });
    else
      this.dynamicForm = this.formBuilder.group({
        dRevDate: ['', Validators.required],
        reviewTime: ['', Validators.required],
        questions: new FormArray([])
      });
  }
  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.questions as FormArray; }

  onChangequestions(Qlength) {
    this.grade = this.projectReview.iPercentGrade;
    if (this.isResult) {
      if (this.projectReview.dRevDate) {
        let date = this.dateParse.transform(this.projectReview.dRevDate);
        this.f.dRevDate.setValue(date);
        this.f.reviewTime.setValue(date.toLocaleTimeString());
      }
    }
    else
    {
      var d=new Date();
      this.f.reviewTime.setValue(d.toLocaleTimeString());
    }
    if (this.t.length < Qlength) {
      for (let i = this.t.length; i < Qlength; i++) {
        this.t.push(this.formBuilder.group({
          questionContent: ['', Validators.required]
        }));
        if (this.projectReview.lQuestion[i].iQuestionsType == 1164) {
          for (let j = 0; j < this.projectReview.lQuestion[i].lAnswer.length; j++) {
            let selected: boolean = this.projectReview.lQuestion[i].lProjectAnswer.
              find(x => x.iRevAnswerId == this.projectReview.lQuestion[i].lAnswer[j].iRevAnswerId)
              ? true : false;
            this.projectReview.lQuestion[i].lAnswer[j] =
              Object.assign(this.projectReview.lQuestion[i].lAnswer[j],
                {
                  isSelected: selected
                });
          }
          if (this.projectReview.lQuestion[i].iNumPercent != null) {
            this.percentsSum += this.projectReview.lQuestion[i].iNumPercent;
          }
        }

        // בבחירה מרובה או כן ולא אין תשובה בודדת
        if (this.projectReview.lQuestion[i].iQuestionsType == 1164 || this.projectReview.lQuestion[i].iQuestionsType == 1180)
          this.t.controls[i]["controls"].questionContent.setValue(this.projectReview.lQuestion[i].iQuestionsType);
        else
          this.t.controls[i]["controls"].questionContent.setValue(this.projectReview.lQuestion[i].lProjectAnswer[0].nvAnswerContent);
        //בשביל הידע איזה סוג קונטרול ליצור
        var type = this.questionTypes.find(x => x.Key == this.projectReview.lQuestion[i].iQuestionsType).Value;
        this.ansInputTypes.push(type);
      }
      if (this.isResult || this.projectReview.iRevStatus == 1176 || this.projectReview.iRevStatus == 1177) {
        this.dynamicForm.disable();
      }
    } else {
      for (let i = this.t.length; i >= Qlength; i--) {
        this.t.removeAt(i);
      }
    }
  }

  onSubmit(onlySave) {
    var lProjectAnswer = [];
    // stop here if form is invalid
    if (this.dynamicForm.invalid) {
      return;
    }
    for (let i = 0; i < this.t.controls.length; i++) {
      //לסוג שאלה בחירה מרובה
      if (this.t.controls[i]["controls"].questionContent.value == "1164") {
        var lanswerSelect = document.getElementsByName('answerSelect' + i);
        this.projectReview.lQuestion[i].lProjectAnswer = [];

        lanswerSelect.forEach(element => {
          if ((element as HTMLFormElement).checked) {
            let answer = this.projectReview.lQuestion[i].lAnswer.find(x => x.nvAnswersContent == (element as HTMLFormElement).value);
            this.projectReview.lQuestion[i].lProjectAnswer.push({ "iProjectReviewId": this.projectReview.iProjectReviewId, "iRevAnswerId": answer.iRevAnswerId, "iRevProjectAnswerId": null, "iRevQuestionId": answer.iRevQuestionId, "nvAnswerContent": (element as HTMLFormElement).value, "nvFilePath": null });
          }
        });
      }
      else {
        //סוג שאלה כן ולא
        if (this.t.controls[i]["controls"].questionContent.value == "1180") {
          this.projectReview.lQuestion[i].lProjectAnswer = [];
          var lSelectedAnswer = document.getElementsByName('question' + this.projectReview.lQuestion[i].iRevQuestionId);
          var selectedAnswer = (lSelectedAnswer[0] as HTMLFormElement).checked ? lSelectedAnswer[0] : lSelectedAnswer[1];
          //{"iProjectReviewId":502,"iRevAnswerId":null,"iRevProjectAnswerId":958,"iRevQuestionId":3835,"nvAnswerContent":"1","nvFilePath":null}
          this.projectReview.lQuestion[i].lProjectAnswer.push({
            "iProjectReviewId": this.projectReview.iProjectReviewId, "iRevAnswerId": null, "iRevProjectAnswerId": null,
            "iRevQuestionId": this.projectReview.lQuestion[i].iRevQuestionId, "nvAnswerContent": (selectedAnswer as HTMLFormElement).value, "nvFilePath": null
          });
        }
        else {
          this.projectReview.lQuestion[i].lProjectAnswer[0].nvAnswerContent = this.t.controls[i]["controls"].questionContent.value;
          //dRevDate":"/Date(1575064800000+0200)/
          var date = (new Date(this.f.dRevDate.value));
          this.projectReview.dRevDate = '/Date(' + date.getTime() + (date + '').substring((date + '').indexOf('+'), (date + '').indexOf('+') + 5) + ")/";
        }
      }
      lProjectAnswer = lProjectAnswer.concat(this.projectReview.lQuestion[i].lProjectAnswer);
    }
    console.log("projectRev after edit" + JSON.stringify(this.projectReview));
    let oReview = {
      iProjectReviewId: this.projectReview.iProjectReviewId,
      iRevStatus: 1170, nvComment: this.projectReview.nvComment,
      nvFeedback: this.projectReview.nvFeedback, dNextRevDate: null,
      dRevDate: this.projectReview.dRevDate, lProjectAnswer: lProjectAnswer, "iUserId": this.getIUserId
    };
    if (onlySave) {
      this.proxy.post("ProjectAnswerInsertUpdate", oReview)
        .then(res => {
          if (!res || res == -1) {
            this.proxy.openDialog("בעיה בקליטת נתונים");
          }
          else {
            this.proxy.openDialog("הנתונים נשמרו בהצלחה!");
          }
        });
    }
    else {
      const dialogRef = this.dialog.open(EndReviewComponent, {
        height: '400px',
        width: '400px',
        data: { oReview: oReview }
      });
    }
  }
  //מקבל את כל רשימות הנתונים שצריך מהשרת
  initializing() {
    this.proxy.post("GetProjectReviewById", { "iProjectReviewId": this.id })
      .then(res => {
        if (!res || res == -1) {
          this.proxy.openDialog("בעיה בקליטת נתונים");
        }
        else {
          this.projectReview = res;
          console.log("PR: " + JSON.stringify(res));
          this.proxy.post("SysTableContentGet", { "iSysTableId": 27 }).then(
            res => {
              if (!res || res == -1 || res == undefined) {
                console.log("error, not exist");
              }
              else {
                this.statusList = res;
                this.proxy.post("SysTableContentGet", { "iSysTableId": 29 }
                ).then(
                  res => {
                    if (!res || res == -1 || res == undefined) {
                      console.log("error, not exist");
                    }
                    else {
                      this.reasonList = res;
                      this.proxy.post("GetProjectType", {}
                      ).then(
                        res => {
                          if (!res || res == -1 || res == undefined) {
                            console.log("error, not exist");
                          }
                          else {
                            this.projectTypeList = res;
                            this.proxy.post("GetProjectList", { "bAllProject": true }
                            ).then(
                              res => {
                                if (!res || res == -1 || res == undefined) {
                                  console.log("error, not exist");
                                }
                                else {
                                  console.log("GetProjectList " + JSON.stringify(res));
                                  this.proxy.post("GetProjectReview", { "bFinished": true, "dFromDate": null, "dToDate": null, "iUserId": this.getIUserId }
                                  ).then(
                                    res => {
                                      if (!res || res == -1 || res == undefined) {
                                        console.log("error, not exist");
                                      }
                                      else {
                                        this.allProjectReview = res;
                                        //מקבל את הפרויקט המתאים
                                        var iRevNum = this.allProjectReview.find(x => x.iProjectReviewId == this.id);
                                        //שולף את המספר שלו
                                        iRevNum = iRevNum != null ? iRevNum.iRevNumber : iRevNum;
                                        this.proxy.post("GetProjectLastResult", { "iProjectId": this.id, "iRevNumber": iRevNum }
                                        ).then(
                                          res => {
                                            if (!res || res == -1 || res == undefined) {
                                              console.log("error, not exist");
                                            }
                                            else {
                                              this.proxy.post("SysTableContentGet", { "iSysTableId": 25 }
                                              ).then(
                                                res => {
                                                  if (!res || res == -1 || res == undefined) {
                                                    console.log("error, not exist");
                                                  }
                                                  else {
                                                    this.questionTypes = res;
                                                    this.onChangequestions(this.projectReview.lQuestion.length);
                                                  }
                                                });


                                            }
                                          });
                                      }
                                    });
                                }
                              });
                          }
                        });

                    }

                  });
              }
            });
        }
      });




  }
}