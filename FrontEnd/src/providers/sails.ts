import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class BackEnd {
    private backendUrl = "https://neverwait-95157.app.xervo.io/"
    //private backendUrl = "http://localhost:1337/"


    constructor(private http: Http) { }

    fetchLocations(): Observable<Response> {
        return this.http.get(this.backendUrl + 'neverwait', { responseType: 1 })
    }

    fetchHistoById(id : number): Observable<Response> {
        return this.http.get(this.backendUrl + 'histo/' + id, { responseType: 1 })
    }

    reportError(idLocation: number, date : string, timeIsUnder: boolean): Observable<Response> {
        return this.http.post(this.backendUrl + 'report', {
            idLocation : idLocation,
            date : date,
            timeIsUnder : timeIsUnder
        }, { responseType: 1 })
    }

    getNbReportsFor(idLocation: number, date : string): Observable<Response> {
        let params : URLSearchParams = new URLSearchParams();
        params.set("date", date);
        return this.http.get(this.backendUrl + 'report/_action/getNbReportForTime/' + idLocation, {
            responseType: 1,
            search: params
        })
    }

    refreshLocation(id : number): Observable<Response> {
        return this.http.get(this.backendUrl + 'neverwait/' + id,  { responseType: 1 });
    }

}