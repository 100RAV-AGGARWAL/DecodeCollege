import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient, private router: Router) { }

  fetchSearchResults(query: string, start) {
    if(start <= 10)
      return this.http.get(environment.customSearchUrl + '?cx=' + environment.programmableSearchEngineId + '&key=' + environment.customSearchAPIKey + '&q=' + query);
      
    return this.http.get(environment.customSearchUrl + '?cx=' + environment.programmableSearchEngineId + '&key=' + environment.customSearchAPIKey + '&q=' + query + '&start=' + start);

  }
}
