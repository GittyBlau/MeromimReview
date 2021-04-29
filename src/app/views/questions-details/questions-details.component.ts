import { JsonPipe } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer } from 'src/app/models/answer.model';
import { ProjectReview } from 'src/app/models/projectReview.model';
import { ProjectType } from 'src/app/models/projectType.model';
import { Question } from 'src/app/models/question.model';
import { AppProxyService } from 'src/app/services/app-proxy.service';
import { AppServiceService } from 'src/app/services/app-service.service';

@Component({
  selector: 'app-questions-details',
  templateUrl: './questions-details.component.html',
  styleUrls: ['./questions-details.component.css']
})
//עמוד עריכת ביקורת ותבניות אופי- שינויים בקבצי השאלונים ועוד
export class QuestionsDetailsComponent implements OnInit {
  getNvUserName = window.sessionStorage.getItem("nvUserName");
  getIUserId = +window.sessionStorage.getItem("iUserId");
  dynamicForm: FormGroup;
  submitted = false;
  id: number;
  currentType;
  questionTypes = [];
  projectsList = [];
  ansInputTypes = [];
  sub: any;
  arr = [];
  lAnswer = [];
  addClickedButton: boolean = false;
  disabledSave: boolean = false;
  lShareChecked = [];

  //review
  isReview: boolean;
  percentsSum: number = 0;
  iRev = 0;
  lTouchedPercentInput = [];
  percentPrevValue = -1;
  percentCurrentValue = 0;
  allProject:Array<Object>=[];
  revListFilter = [];
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private service: AppServiceService, private proxy: AppProxyService) {
  }
  updatePercent(event) {
    if (this.percentPrevValue == -1)
      this.percentPrevValue = event.target.value - 0;
  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      this.isReview = params['isReview'] == 'true' ? true : false;
      //תבנית אופי היא =FALSE          וביקורת =TRUE
      this.GetProjectType();

    });
    if (!this.isReview) {
      //במקרה שהיינו צריכים להגדיר רק שאלות קבועות אז צריך רק את השאלות בלי שם הפרויקט
      if (this.id == 0 || !this.id) {
        this.dynamicForm = this.formBuilder.group({
          questions: new FormArray([])
        });
      }
      else {
        this.dynamicForm = this.formBuilder.group({
          projectTypeName: ['', Validators.required],
          questions: new FormArray([])
        });
      }
    }
    else {
      this.dynamicForm = this.formBuilder.group({
        questions: new FormArray([])
      });
    }
  }

  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.questions as FormArray; }

  iRevQuestionId: number = -1;

  //פונק' אתחול לנתונים בפורם גרופ
  initForms(e, num) {
    let Qlength;
    if (e)
      Qlength = e.target.value || 0;
    else
      Qlength = num;
    if (this.t.length < Qlength) {
      for (let i = this.t.length; i < Qlength; i++) {
        this.t.push(this.formBuilder.group({
          questionContent: ['', Validators.required],
          typeOfQuestion: ['', Validators.required],
          bRequired: [false]
        }));

        //איתחול...
        this.t.controls[i]["controls"].questionContent.setValue(this.currentType.lQuestion[i].nvQuestionsContent);
        var type = this.questionTypes.find(x => x.Key == this.currentType.lQuestion[i].iQuestionsType).Value;
        this.t.controls[i]["controls"].typeOfQuestion.setValue(type);
        this.ansInputTypes.push(type);
        this.t.controls[i]["controls"].bRequired.setValue(this.currentType.lQuestion[i].bRequired);
        //מעדכן במערך האם לכלול אחוזים בציון בשאלה הספציפית
        this.lShareChecked.push(this.currentType.lQuestion[i].bIncludeGrade);
        //שאלות מסוג אמריקאי או כן לא צריכות מערך שבודק אם ישתנו הערכים באחוזים שרק הם מקבלים 
        if (this.currentType.lQuestion[i].iQuestionsType == 1163 || this.currentType.lQuestion[i].iQuestionsType == 1180) {
          this.lTouchedPercentInput.push(false);
          //וכן אתחול האחוזים קשורים רק סוג השאלות הנל
          this.percentsSum += this.currentType.lQuestion[i].iNumPercent;

        }
        console.log("answers " + (this.t.controls[i]["controls"].lAnswer));
      }
    } else {
      for (let i = this.t.length; i >= Qlength; i--) {
        this.t.removeAt(i);
      }
    }
  }

  //כשלחצו על החלק הראשון בפורם הפוקוס עובר אליו מהשאלות בפורם
  firstDivClick() {
    var currentDiv = document.getElementById("headFormGroup");
    currentDiv.className = 'position-relative on-div-wrap focusDiv';
    for (let index = 0; index < this.t.length; index++) {
      var currentDiv = document.getElementById("question" + index);
      currentDiv.className = 'position-relative on-div-wrap NotFocus';
      this.arr[index] = false;

    }
  }
  //פוקציה שתפקידה להעביר פוקוס לחלק המבוקש-במקרה שלחצו על שאלה 
  // הוסיפו שאלה חדשה-צריך להתמקד בה+הוספת כפתור ייחודי
  divClicked(i) {
    //מגיע לפונקציה כשלחצו על אחד השאלות לכן צריך להוריד הפוקוס מהשורה הראשונה...
    var headDiv = document.getElementById("headFormGroup");
    headDiv.className = 'position-relative on-div-wrap NotFocus';
    // ולהוריד מיקוד מהאחרים i אם לא הוסיפו שאלה חדשה צריך להתמקד בשאלה מספר 
    if (!this.addClickedButton) {
      for (let index = 0; index < this.t.length; index++) {
        var currentDiv = document.getElementById("question" + index);
        if (i == index) {
          //מתעדכן בכדי שידע להוסיף את הכפתור שאמור להיצמד לשאלה ממוקדת
          this.arr[index] = true;
          currentDiv.className = 'position-relative on-div-wrap focusDiv';
        }
        //מוריד פוקוס לאחרים כנ"ל
        else {
          this.arr[index] = false;
          currentDiv.className = 'position-relative on-div-wrap NotFocus';
        }
      }
    }
    //אם לחצו על הוספת שאלה
    else {
      this.arr[i] = false;
      // מתכוון לשאלה החדשה שמתווספת אחרי השאלה הנוכחית ומעדכן את מה שצריך בה
      this.arr[i + 1] = true;
      var currentDiv = document.getElementById("question" + i);
      currentDiv.className = 'position-relative on-div-wrap NotFocus';
      var a: number = i + 1;
      var nextDiv = document.getElementById("question" + a);
      nextDiv.className = 'position-relative on-div-wrap focusDiv';
      this.addClickedButton = false;

    }
  }
  //כשמשנים תשובה נכונה בשאלה אמריקאית
  radioClick(iRevQuestionId, answerIndex, answerLen) {
    for (let index = 0; index < answerLen; index++) {
      if (index == answerIndex) {
        document.getElementById('labelAns' + iRevQuestionId + '_' + answerIndex).className =
          "btn  form-check-label waves-effect waves-light active divActiv";
      }
      else {
        document.getElementById('labelAns' + iRevQuestionId + '_' + index).className =
          "btn  form-check-label waves-effect waves-light";
      }

    }
  }
  //הוספת שאלה-פורם גרופ נסף
  async addQuestion(i) {
    //יצטרך להתמקד בשאלה החדשה לכן מעדכן משתנה זה
    this.addClickedButton = true;
    this.ansInputTypes.splice(i + 1, 0, 'טקסט חופשי קצר');
    this.currentType.lQuestion.splice(i + 1, 0, new Question(false, false, false,
      null, 0, null,
      1165, this.id, this.iRevQuestionId--,
      i + 1, new Array(), [], '',
    ));
    //הוספת האיבר בפורם השאלות
    await (this.t as FormArray).insert(i + 1, this.formBuilder.group({
      questionContent: ['', Validators.required],
      typeOfQuestion: ['טקסט חופשי קצר', Validators.required],
      bRequired: [false]
    }));
  }
  //שמירת השינויים בביקורת או הפרויקט
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dynamicForm.invalid) {
      return;
    }

    var answersContentArray = document.getElementsByName('answersContent');
    var answersIndex = 0;
    var x = 0;
    let lIncludeGrade = document.getElementsByName('shareInPercentage');
    let lInumPercent = document.getElementsByName('iNumPercent');
    if (!this.isReview && this.id != 0 && this.id != null)
      this.currentType.nvRevProjectType = this.f.projectTypeName.value;
    for (let i = 0; i < this.t.controls.length; i++) {
      //העתקת תוכן השאלה
      this.currentType.lQuestion[i].nvQuestionsContent = this.t.controls[i]["controls"].questionContent.value;
      //העתקת סוג השאלה
      this.currentType.lQuestion[i].iQuestionsType = this.questionTypes.
        find(x => x.Value == this.t.controls[i]["controls"].typeOfQuestion.value).Key;
      //העתקת הצ'ק בוקס: האם שאלת חובה
      this.currentType.lQuestion[i].bRequired = this.t.controls[i]["controls"].bRequired.value;
      /// 'אם זה לא אמריקאי ולא 'כן ולא
      if (!(this.currentType.lQuestion[i].iQuestionsType == 1180) && !(this.currentType.lQuestion[i].iQuestionsType == 1163)) {
        this.currentType.lQuestion[i].iCorrectAnswer = null;
      }
      //להעתיק את התשובה הנכונה בסוג-כן לא ואמריקאי
      else {
        var nameAnswerRadio = 'question' + this.currentType.lQuestion[i].iRevQuestionId;
        var iCorrectAnswer = document.getElementsByName(nameAnswerRadio);
        var checked = Array.from(iCorrectAnswer as NodeListOf<HTMLInputElement>).find(x => x.checked);
        this.currentType.lQuestion[i].iCorrectAnswer = checked.value;
      }

      // העתקת התשובות באמריקאי או בחירה מרובה
      if (this.currentType.lQuestion[i].iQuestionsType == 1163 || this.currentType.lQuestion[i].iQuestionsType == 1164) {
        for (let index = 0; index < this.currentType.lQuestion[i].lAnswer.length; index++) {
          this.currentType.lQuestion[i].lAnswer[index].nvAnswersContent = (answersContentArray[answersIndex++] as HTMLFormElement).value;
        }
      }
      // העתקת האחוזים לביקורת
      if (this.isReview) {
        if (lIncludeGrade[x] != undefined && lInumPercent[x] != undefined) {
          this.currentType.lQuestion[i].bIncludeGrade = (lIncludeGrade[x] as HTMLFormElement).checked;
          this.currentType.lQuestion[i].iNumPercent = (lInumPercent[x++] as HTMLFormElement).value - 0;
        }
      }
    }
    if (this.isReview) {
      let selectedProject;
      if (this.id != 0 && this.id != null)
      {selectedProject = (document.getElementById("selectedProject") as HTMLFormElement).options[(document.getElementById("selectedProject") as HTMLFormElement).selectedIndex].value;
     this.currentType.iProjectId=(this.allProject.find(x=>x['Value']==selectedProject) as ProjectReview)['Key'];
     }  this.proxy.post("ProjectReviewUpdate", { oProjectReview: this.currentType, iUserId: this.getIUserId })
        .then(res => {
          if (!res) {
            this.proxy.openDialog("בעיה בשמירה");
          }
          else {
            this.proxy.openDialog("נשמר בהצלחה!!");
            this.currentType = res;
          }

        })
    }
    else {
      this.proxy.post("ProjectTypeInsertUpdate", { oProjectType: this.currentType, iUserId: this.getIUserId })
        .then(res => {
          if (!res) {
            this.proxy.openDialog("בעיה בשמירה");

          }
          else {
            this.currentType = res;
            this.proxy.openDialog("נשמר בהצלחה!!");
            if (this.id == -1) {
              this.router.navigate(['Navigate/ProjectType']);
            }
          }

        })
    }

  }
  //כמשנים את סוג השאלה  -עידכונים
  changeSelect(event, i) {
    this.currentType.lQuestion[i].iQuestionsType = this.questionTypes.find(x => x.Value == event.target.value).Key;
    this.ansInputTypes[i] = event.target.value;//selected;
    //לסוגים הבאים צריך להוסיף 2 תשובות אפשריות לעריכה
    if ((this.ansInputTypes[i] == 'אמריקאי' || this.ansInputTypes[i] == 'בחירה מרובה') && this.currentType.lQuestion[i].lAnswer.length == 0) {
      this.currentType.lQuestion[i].lAnswer.push(new Answer(-1 * (this.currentType.lQuestion[i].lAnswer.length + 1), this.currentType.lQuestion[i].iRevQuestionId, '', -1));
      this.currentType.lQuestion[i].lAnswer.push(new Answer(-1 * (this.currentType.lQuestion[i].lAnswer.length + 1), this.currentType.lQuestion[i].iRevQuestionId, '', -1));
      this.currentType.lQuestion[i].iCorrectAnswer = -1;
      //כי עדיין לא מילאו את השדות -תשובות לבחירה
      this.disabledSave = true;
    }
    //אם כן ולא או אמריקאי צריך לעדכן את האחוזים
    if (this.currentType.lQuestion[i].iQuestionsType == 1163 || this.currentType.lQuestion[i].iQuestionsType == 1180) {
      let x = 0;
      for (let index = 0; index < i && index < this.currentType.lQuestion.length; index++) {
        if (this.currentType.lQuestion[index].iQuestionsType == 1163 || this.currentType.lQuestion[index].iQuestionsType == 1180) {
          x++;
        }
      }
      this.lTouchedPercentInput.splice(x, 0, false);
    }
  }
  // מחיקת שאלה-מחיקת הפורם של השאלה מהפורם-גרופ הכולל
  deleteQuestion(i) {
    this.t.removeAt(i);
    this.currentType.lQuestion.splice(i, 1);
    this.arr[i] = false;
    this.ansInputTypes.splice(i, 1);
    this.checkValidation(i);

  }
  //מחיקת תשובה מהאפשרויות בשאלות מסוג אמריקאי או כן לא
  deleteAnswer(iRevAnswerId, answerIndex, i) {
    if (this.currentType.lQuestion[i].lAnswer.length > 2)
      this.currentType.lQuestion[i].lAnswer.splice(answerIndex, 1);
    if (this.currentType.lQuestion[i].iCorrectAnswer == iRevAnswerId) {
      this.currentType.lQuestion[i].iCorrectAnswer = null;
    }
  }
  updateCorrectAnswer(iRevAnswerId, i) {
    this.currentType.lQuestion[i].iCorrectAnswer = iRevAnswerId;

  }
  //הוספת תשובה לשאלות אמריקאיות ובחירה מרובה
  addAnswer(i) {
    var len = this.currentType.lQuestion[i].lAnswer.length;
    //-1 ...שידע להוסיף את התשובה המזהה יהיה
    this.currentType.lQuestion[i].lAnswer.push(new Answer(-1 * (this.currentType.lQuestion[i].lAnswer.length + 1), this.currentType.lQuestion[i].iRevQuestionId, '', -1));
  }
  //בודק אם לאפשר שמירת נתונים -אם אין שורות ריקות מתוכן וכו
  checkValidation(deletedI) {
    //אם היתה קריאה לפונקציה בעת מחיקת שאלה יקבל את מזהה השאלה
    //בבדיקה אחרת יקבל NULL
    let currentSaveDisabled: boolean = false;
    var lAnswersContent = document.getElementsByName('answersContent');
    for (let j = 0; j < lAnswersContent.length; j++) {
      if ((lAnswersContent[j] as HTMLFormElement).value.length == 0 &&
        (lAnswersContent[j] as HTMLFormElement).id != deletedI) {
        this.disabledSave = true;
        currentSaveDisabled = true;
      }
    }
    if (!currentSaveDisabled) {
      this.disabledSave = false;
    }
  }
  //פונקציות לביקורת-לא תבנית אופי
  iNumPercentList = document.getElementsByName('iNumPercent');
  //כשמשנים את ערך האחוז לשאלה מסוימת צריך לעדכן בשביל חישוב האחוזים לאחר מכן
  touchedPercent(event, i) {
    this.currentType.lQuestion[i].iNumPercent = event.target.value - 0;
    this.percentCurrentValue = event.target.value - 0;
    this.percentsSum += (this.percentCurrentValue - this.percentPrevValue) - 0;
    this.percentPrevValue = -1;
    let x = 0;
    for (let index = 0; index < i && index < this.currentType.lQuestion.length; index++) {
      if (this.currentType.lQuestion[index].iQuestionsType == 1163 || this.currentType.lQuestion[index].iQuestionsType == 1180) {
        x++;
      }
    }
    this.lTouchedPercentInput[x] = true;
    console.log("the iPercentGrade :" + this.currentType.iPercentGrade)
  }
  //אם לא רוצה לשתף באחוזים שאלה מסוימת ישנה בתצוגה את הערך ל 0
  ChangedSharing(i) {
    let ShareInPercentage = document.getElementById('shareInPercentage' + i);
    this.lShareChecked[i] = (ShareInPercentage as HTMLFormElement).checked;
    if ((ShareInPercentage as HTMLFormElement).checked) {
      this.percentsSum += this.currentType.lQuestion[i].iNumPercent - 0;
    }
    else {
      var temp: number = (document.getElementById('iNumPercent' + i) as HTMLFormElement).value;
      this.percentsSum -= temp;
      this.currentType.lQuestion[i].iNumPercent = 0;
    }

  }
  //חישוב האחוזים-עד ל- 100
  //!!!!!!!!!!יכול ליהיות שהבעיה היא שלא נכנס הערך 
  //האלמנט מכיוון שמאותחל בו הערך המקורי של המערך כל הזמן
  //הVALUE את HTML הזה ולכן או לעדכן פה אתת הערך במקור-במערך או לא לעשות ב 
  updatePercentAvg() {
    var sumPercentTouched = 0;
    var lQuestionPercentTouched = [], lQuestionPercentNoTouched = [];
    var lOuestionPercent = document.getElementsByName('iNumPercent');
    var lShareInPercentage = document.getElementsByName('shareInPercentage');
    //עובר על השאלות שיש להם אחוזים ובודק אם צריך לשתף את האחוזים בשאלון
    //אם כן מחלק אותם ל2 מערכים -אלו ששינו את ערך האחוז ואלו שלא נגעו בהם
    for (let i = 0; i < lShareInPercentage.length; i++) {
      if ((lShareInPercentage[i] as HTMLFormElement).checked) {
        if (this.lTouchedPercentInput[i]) {
          lQuestionPercentTouched.push(lOuestionPercent[i]);
          sumPercentTouched += lOuestionPercent[i]["value"] - 0;
        }
        else {
          lQuestionPercentNoTouched.push(lOuestionPercent[i]);
        }
      }
    }
    if (sumPercentTouched < 100) {
      //בודק כמה אחוזים נותרו לחלק בין אלה שלא שינו אותם בכדי להשלים ל100%
      var percentForDivide = lQuestionPercentNoTouched.length > 0 ? Math.floor((100 - sumPercentTouched) / lQuestionPercentNoTouched.length) : 0;
      //מחלק את התוצאה בשווה לשאלות
      lQuestionPercentNoTouched.forEach(element => {
        element.value = percentForDivide;
      });
      // //   כאשר סך האחוזים אינו מגיע ל 100 מחלק אחוזים נוספים כפי מה שחסר
      var surplus = 100 - (sumPercentTouched + (percentForDivide * lQuestionPercentNoTouched.length));
      if (surplus > 0) {
        lQuestionPercentNoTouched.forEach(element => {
          if (surplus > 0) {
            element.value++;
            surplus--;
          }
        });
      }
      //אם שינו את כל הערכים ולא היה למי לחלק את הנותר א"א להשלים ל100 רק ידנית
      this.percentsSum = 100 - surplus;
    }
    //במקרה שסכום האחוזים שנגעו בהם גדול ממאה
    else {
      lQuestionPercentNoTouched.forEach(element => {
        element.value = 0;
      });
      this.percentsSum = sumPercentTouched;
    }

    let x = 0;

    //לעדכן את המערך בערך האחוזים החדש 
    // for (let index = 0; index < this.currentType.lQuestion.length; index++) {
    //   if (this.currentType.lQuestion[index].iQuestionsType == 1163 || this.currentType.lQuestion[index].iQuestionsType == 1180) {
    //     this.currentType.lQuestion[index].iNumPercent = (lOuestionPercent[x++] as HTMLFormElement).value;
    //   }
    // }
  }
  //מקבל את רשימת התבניות אופי מהשרת או רשימת הביקורות  לפי הצורך
  async GetProjectType() {

    if (!this.isReview) {
      //  לשאלות קבועות בלי מזהה אמיתי
      this.id = this.id == 0 ? null : this.id;
      await this.proxy.post("GetProjectTypeById", { iRevProjectTypeId: this.id }).then(
        res => {
          if (!res || res == -1 || res == undefined) {
            console.log("error, not exist");
          }
          else {
            // האופי פרויקט הנוכחי
            this.currentType = res;
            this.arr = new Array(this.currentType.lQuestion.length);
            if (!this.id)
              console.log("this.currentType: " + JSON.stringify(this.currentType, null, 4));
            else
              this.f.projectTypeName.setValue(this.currentType.nvRevProjectType);
          }
        });
    }
    //אם זה ביקורת ולא רק אופי פריקט
    else {
      await this.proxy.post("GetProjectReviewById", { "iProjectReviewId": this.id }
      )
        .then(res => {
          if (!res || res == -1) {
            this.proxy.openDialog("GetProjectReviewById לא עבד");
          }
          else {
            this.currentType = res;
            this.arr = new Array(this.currentType.lQuestion.length);
            if (!this.isReview && this.id != 0 && this.id != null)
              this.f.projectTypeName.setValue(this.currentType.nvRevProjectType);
            console.log("GetProjectReviewById: " + JSON.stringify(this.currentType, null, 4));
            this.proxy.post("GetProjectList", { "bAllProject": true }
            ).then(
              res => {
                if (!res || res == -1 || res == undefined) {
                  console.log("error, not exist");
                }
                else {
                  this.allProject = res;
                  this.allProject.splice(0,0,{"Key":this.currentType.iProjectId,"Value":this.currentType.nvProjectName}) ;
                }
              });
          }
        });
    }
    this.proxy.post("SysTableContentGet", { iSysTableId: 25 }).then(
      result => {
        if (!result || result == -1 || result == undefined) {
          console.log("error, not exist");
        }
        else {
          this.questionTypes = result;
          if (this.id == -1) {
            this.currentType.iRevProjectTypeId = -1;
            this.currentType.lQuestion.push(new Question(false, false, false,
              null, 0, null,
              1165, this.id, this.iRevQuestionId--, -1, new Array(), [], '',
            ));

            this.initForms(null, 1);

          }
          else
            this.initForms(null, this.currentType.lQuestion.length);
          for (let index = 0; index < this.currentType.lQuestion.length; index++) {
            this.arr[index] = false;
          }
        }
      });
  }

}
