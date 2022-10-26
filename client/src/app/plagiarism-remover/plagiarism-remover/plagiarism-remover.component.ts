import { Component, OnInit } from '@angular/core';
import roundToNearestMinutesWithOptions from 'date-fns/esm/fp/roundToNearestMinutesWithOptions/index.js';
import { SnackBarService } from 'src/app/utility/snackbar/snackbar.component';
import { PlagiarismRemoverService } from '../plagiarism-remover.service';

@Component({
  selector: 'app-plagiarism-remover',
  templateUrl: './plagiarism-remover.component.html',
  styleUrls: ['./plagiarism-remover.component.css']
})
export class PlagiarismRemoverComponent implements OnInit {
  inputStr = "";
  outputStr = "";
  slider_val = 80;

  to_be_changed_available = {
    "a": "\u0430",
    "c": "\u0441",
    "d": "\u0501",
    "e": "\u0435",
    "g": "\u0121",
    "h": "\u04bb",
    "i": "\u0456",
    "j": "\u0458",
    "k": "\u03ba",
    "l": "\u04cf",
    "n": "\u0578",
    "o": "\u043e",
    "p": "\u0440",
    "q": "\u0566",
    "s": "\u0282",
    "u": "\u03c5",
    "v": "\u03bd",
    "x": "\u0445",
    "y": "\u0443",
    "z": "\u0290",
  };

  to_be_changed = {};

  enabled_chars = ['a', 'c', 'e', 'i', 'j', 'o', 'p', 'x', 'y']

  constructor(private _snackBar: SnackBarService, private plagiarismRemoverService: PlagiarismRemoverService) {
    this.fill_to_be_changed(this.enabled_chars);
  }

  ngOnInit(): void {
  }

  fill_to_be_changed(enabled_chars_) {
    this.to_be_changed = {};
    let keys = Object.keys(this.to_be_changed_available);
    for (let i = 0; i < keys.length; i++) {
      let c = keys[i];
      if (enabled_chars_.includes(c)) {
        this.to_be_changed[c] = this.to_be_changed_available[c];
      }
    }
  }

  is_changable_word(word) {
    if (word.length == 0) return false;
    if (word[0] == "\\") return false;
    return true;
  }

  change_word(word) {
    if (word.length < 1) return "";

    if (word[0] == "\\") return word;

    let res = "";
    for (let i = 0; i < word.length; i++) {
      let c = word[i];
      if (this.to_be_changed[c] != undefined) {
        c = this.to_be_changed[c];
      }
      res += c;
    }

    return res;
  }

  changeText() {
    let ip_str = this.inputStr;
    let op_str = "";

    if (ip_str.length < 2) {
      this._snackBar.openSnackBar('Please enter/paste some text first', 'X')
      return;
    }


    let words = ip_str.split(" ")

    let percentage = this.slider_val / 100;

    for (let w_id = 0; w_id < words.length; w_id++) {

      let new_word = words[w_id];

      if (this.is_changable_word(new_word) && Math.random() <= percentage) {
        new_word = this.change_word(new_word);
      }

      op_str += new_word + " "

    }

    this.outputStr = op_str.trim();

  }

  clearText() {
    this.inputStr = "";
    this.outputStr = "";
  }

  copyOutput() {
    if (this.outputStr == "") {
      this._snackBar.openSnackBar('Nothing to Copy', 'X')

      return;
    }
    navigator.clipboard.writeText(this.outputStr);
  }

  paraphrase() {
    this.plagiarismRemoverService.paraphrase(this.inputStr).subscribe((res: any) => {
      this.outputStr = res.output;
    }, (err) => {
      this._snackBar.openSnackBar('Error while paraphrasing', 'X')
    })
  }

}
