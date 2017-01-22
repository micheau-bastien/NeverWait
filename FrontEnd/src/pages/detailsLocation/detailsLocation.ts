import { Component } from '@angular/core';
import { NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { BackEnd } from '../../providers/sails';

@Component({
  selector: 'details-location-home',
  templateUrl: 'detailsLocation.html',
  providers: [BackEnd]
})
export class DetailsLocationPage {
  private histoDay: any = [];
  private maxAtt: number = 0;
  private histos: any = [];
  private nbReport: number = 0;
  private location: any;
  private liveRealoadId: any;
  private hasSignaledError: boolean = false;

  constructor(public navParams: NavParams, public http: Http, public backEnd: BackEnd, public alertController: AlertController, public loadingController: LoadingController) {
    this.location = this.navParams.get('location');
    this.loadHistos();
    this.loadNbReports();
    this.liveReloadQueueStatus();
  }

  private liveReloadQueueStatus() {
    this.liveRealoadId = setInterval(_ => {
      this.backEnd.refreshLocation(this.navParams.get('location').id).subscribe(answer => {
        this.location = answer.json();
        //Update the last view !
        this.navParams.get('location').tempsAtt = answer.json().tempsAtt;
        this.navParams.get('location').taux_occupation = answer.json().taux_occupation;
        this.navParams.get('location').sensors = answer.json().sensors;

      })
    }, 500);
  }

  private loadNbReports() {
    let formatedDate = this.getDate() + "@" + this.getFormatedHour(new Date());
    this.backEnd.getNbReportsFor(this.navParams.get('location').id, formatedDate).subscribe(answer => {
      console.log(answer.json().nb)
      this.nbReport = answer.json().nb;
    })
  }

  private loadHistos() {
    this.backEnd.fetchHistoById(this.navParams.get('location').id).subscribe(histo => {
      this.histos = Object.keys(histo.json().dates).map(date => {
        return {
          date: date,
          global: histo.json().dates[date].global,
          heures: Object.keys(histo.json().dates[date].heures).map(hour => {
            if (histo.json().dates[date].heures[hour].tempsAttMoy > this.maxAtt) this.maxAtt = histo.json().dates[date].heures[hour].tempsAttMoy;
            return { name: hour, value: histo.json().dates[date].heures[hour].tempsAttMoy };
          })
        }
      })
      this.histos.reverse();
    }, err => {
      console.log(err)
    })
  }

  private orderHistos() {
    console.log(this.histos)
    var newHistos = []
  }

  private getDate(): string {
    let a = new Date();
    return a.getFullYear() + '/' + (a.getMonth() + 1) + '/' + a.getDate()
  }

  private getFormatedHour(date: Date): string {
    if (date.getMinutes() < 30) {
      return date.getHours() + 'h00-' + date.getHours() + "h30";
    } else {
      return date.getHours() + 'h30-' + (date.getHours() + 1) + "h00";
    }
  }

  private reportError(): void {
    let prompt = this.alertController.create({
      title: "Temps d'attente inexact ?",
      message: "Le temps d'attente estimé par l'application vous semble inexact ?",
      buttons: [
        {
          text: 'Non',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Oui',
          handler: data => {
            let loader = this.loadingController.create({ content: "Envoi de l'erreur d'estimation..." });
            loader.present();
            let formatedDate = this.getDate() + "@" + this.getFormatedHour(new Date());
            this.backEnd.reportError(this.navParams.get('location').id, formatedDate, true).subscribe(answer => {
              loader.dismiss();
              this.alertController.create({
                title: "Signalé !",
                subTitle: "Vous avez bien transmis que le temps d'attente indiqué par l'application était inexact. Merci de votre retour!",
                buttons: ['OK']
              }).present();
              this.hasSignaledError = true;
            })
          }
        }
      ]
    });
    prompt.present();
  }

  private ionViewWillLeave(): void{
    clearInterval(this.liveRealoadId);
  }

}
