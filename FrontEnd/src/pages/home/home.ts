import { Component } from '@angular/core';
import { DetailsLocationPage } from '../detailsLocation/detailsLocation'
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BackEnd } from '../../providers/sails';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [BackEnd]
})
export class HomePage {
  // Array of the différent locations and the lives datas on each locations
  private locations: any = [];

  public detailsLocationPage: any = DetailsLocationPage;

  constructor(public navCtrl: NavController, private http: Http, public alertController: AlertController, public backEnd: BackEnd, public loadingController: LoadingController) {
    // Print a loader
    let loader = this.loadingController.create({ content: "Chargement des données..." });
    loader.present();
    // Fetch all locations and live datas about the location
    this.backEnd.fetchLocations().subscribe(answer => {
      // Transfer the locations to the locations var
      answer.json().forEach(res => {
        this.locations.push(res);
      })
      // hide the loader
      loader.dismiss();
    }, error => {
      //If there is a connexion error we dismiss the loader an print an alert 
      loader.dismiss();
      let alert = this.alertController.create({
        title: 'Erreur de réseau!',
        subTitle: 'Erreur : ' + error,
        buttons: ['OK']
      });
      alert.present();
    })
  }

  // @Todo : Add a new location on the application. Must do a login feature to know what user wants to see what queues
  addLocation() {
    let alert = this.alertController.create({
      title: 'Feature is coming!',
      subTitle: 'We are still in early beta and the addition of new places will come in a next version!',
      buttons: ['OK']
    });
    alert.present();
  }

  // Tap on a location to see more infos about it
  goTo(location) {
    this.navCtrl.push(this.detailsLocationPage, {
      location: location
    });
  }

}
