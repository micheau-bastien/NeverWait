import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class BackEnd {
    /* Sails Provier that links to the BackEnd */

    // Server URL
    private backendUrl = "https://neverwait-95157.app.xervo.io/"

    //Local test URL
    //private backendUrl = "http://localhost:1337/"


    constructor(private http: Http) { }

    //Get the différent locations created and the realtime infos on them
    fetchLocations(): Observable<Response> {
        return this.http.get(this.backendUrl + 'neverwait', { responseType: 1 })
    }

    //Fetch a one week history for a location
    fetchHistoById(id : number): Observable<Response> {
        return this.http.get(this.backendUrl + 'histo/' + id, { responseType: 1 })
    }

    // Signal that one queue has the wrong estimated time
    reportError(idLocation: number, date : string, timeIsUnder: boolean): Observable<Response> {
        return this.http.post(this.backendUrl + 'report', {
            idLocation : idLocation,
            date : date,
            timeIsUnder : timeIsUnder
        }, { responseType: 1 })
    }

    // Get how many users said that the waiting time was inexact for a location and a given time
    getNbReportsFor(idLocation: number, date : string): Observable<Response> {
        let params : URLSearchParams = new URLSearchParams();
        params.set("date", date);
        return this.http.get(this.backendUrl + 'report/_action/getNbReportForTime/' + idLocation, {
            responseType: 1,
            search: params
        })
    }

    // Get the live informations on a location
    refreshLocation(id : number): Observable<Response> {
        return this.http.get(this.backendUrl + 'neverwait/' + id,  { responseType: 1 });
    }

}