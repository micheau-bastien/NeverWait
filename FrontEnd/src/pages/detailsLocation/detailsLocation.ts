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
  //Max waiting time on the lasts 7 days. Used to define the scale for history graphs
  private maxAtt: number = 0;
  // Arrays of histos of the lasts 7 days
  private histos: any = [];
  // Number of report of inexact estimated waiting time on this 30 mins
  private nbReport: number = 0;
  // Le global informations about the location
  private location: any;
  // ID of livereload, only used in order to shut the live reload down when exiting the page.
  private liveRealoadId: any;
  // True if the user has already signaled that the estimated waiting time was inexact
  private hasSignaledError: boolean = false;
  // Time before fetching new datas on the server
  private NB_SEC_BEFORE_RELOAD: number = 0.5;

  constructor(public navParams: NavParams, public http: Http, public backEnd: BackEnd, public alertController: AlertController, public loadingController: LoadingController) {
    this.location = this.navParams.get('location');
    this.loadHistos();
    this.loadNbReports();
    this.liveReloadQueueStatus();
  }

  // Launch the liveReaload feature (Live status of the queue)
  private liveReloadQueueStatus() {
    // Set the interval with defined time 
    this.liveRealoadId = setInterval(_ => {
      // API Call to refresh datas
      this.backEnd.refreshLocation(this.navParams.get('location').id).subscribe(answer => {
        this.location = answer.json();
        //Update the global view waiting time !
        this.navParams.get('location').tempsAtt = answer.json().tempsAtt;
        this.navParams.get('location').taux_occupation = answer.json().taux_occupation;
        this.navParams.get('location').sensors = answer.json().sensors;

      })
    }, this.NB_SEC_BEFORE_RELOAD * 100);
  }
  // Fetch the number of report of inexact waiting time from the API
  private loadNbReports() {
    //format the date in order to search for current reports : 2017/01/18@12h30-13h00
    let formatedDate = this.getDate() + "@" + this.getFormatedHour(new Date());
    // API call
    this.backEnd.getNbReportsFor(this.navParams.get('location').id, formatedDate).subscribe(answer => {
      this.nbReport = answer.json().nb;
    })
  }

  //Fetch the histos from the API 
  private loadHistos() {
    this.backEnd.fetchHistoById(this.navParams.get('location').id).subscribe(histo => {
      //Transfrom the object received in an array tha can be used properly in the view
      this.histos = Object.keys(histo.json().dates).map(date => {
        return {
          date: date,
          global: histo.json().dates[date].global,
          // Transform the object in array to be manipulated in a simpler way
          heures: Object.keys(histo.json().dates[date].heures).map(hour => {
            // Set a new maxAtt if new max is reached.
            if (histo.json().dates[date].heures[hour].tempsAttMoy > this.maxAtt) this.maxAtt = histo.json().dates[date].heures[hour].tempsAttMoy;
            return { name: hour, value: histo.json().dates[date].heures[hour].tempsAttMoy };
          })
        }
      })
      // Reverse the histo in order to put the most recent histo in first.
      this.histos.reverse();
    }, err => {
      console.log(err)
    })
  }

  // Get the current date with this format : YYYY/(M?)M/(D?)D
  private getDate(): string {
    let a = new Date();
    return a.getFullYear() + '/' + (a.getMonth() + 1) + '/' + a.getDate()
  }

  // Return the 30min format for the date : 19h30-20h00
  private getFormatedHour(date: Date): string {
    // if under 
    if (date.getMinutes() < 30) {
      return date.getHours() + 'h00-' + date.getHours() + "h30";
    } else {
      return date.getHours() + 'h30-' + (date.getHours() + 1) + "h00";
    }
  }

  // Click on report error to launch : Will show confirmation then send ton the API
  private reportError(): void {
    // Show the confirmation alert
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
            // Show loader while sending
            let loader = this.loadingController.create({ content: "Envoi de l'erreur d'estimation..." });
            loader.present();
            // Get formated date : 2017/01/18@12h30-13h00
            let formatedDate = this.getDate() + "@" + this.getFormatedHour(new Date());
            // API Call
            this.backEnd.reportError(this.navParams.get('location').id, formatedDate, true).subscribe(answer => {
              // Hide loader becaus send is finished
              loader.dismiss();
              // Show alert to indicate that the report has been sent
              this.alertController.create({
                title: "Signalé !",
                subTitle: "Vous avez bien transmis que le temps d'attente indiqué par l'application était inexact. Merci de votre retour!",
                buttons: ['OK']
              }).present();
              // hasSignaledError=true hides the signal error button
              this.hasSignaledError = true;
            })
          }
        }
      ]
    });
    prompt.present();
  }

  private ionViewWillLeave(): void {
    // When the detailed view is leaved, it stops the auto live-reload
    clearInterval(this.liveRealoadId);
  }

}
