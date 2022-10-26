import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlagiarismRemoverService {

  constructor(private http: HttpClient) { }

  paraphrase(text: string) {
    return this.http.post(environment.paraphrasingUrl, JSON.stringify({ "input": text }), {
      "headers": {
        "content-type": "application/json",
        "X-RapidAPI-Host": environment.paraphrasingHost,
        "X-RapidAPI-Key": environment.paraphrasingKey,
        "useQueryString": "true"
      }
    })
  }
}
