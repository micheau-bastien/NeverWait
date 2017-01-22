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
  private locations: any = [];

  public detailsLocationPage: any = DetailsLocationPage;

  constructor(public navCtrl: NavController, private http: Http, public alertController: AlertController, public backEnd: BackEnd, public loadingController: LoadingController) {
    let loader = this.loadingController.create({ content: "Chargement des données..." });
    loader.present();
   
/*    //Test Http
    this.http.get("https://httpbin.org/ip")
        .subscribe(data => {
            var alert = alertController.create({
                title: "Your IP Address",
                subTitle: data.json().origin,
                buttons: ["close"]
            }).present();
        }, error => {
            console.log(JSON.stringify(error.json()));
        });
*/
   this.backEnd.fetchLocations().subscribe(answer => {
      answer.json().forEach(res => {
        this.locations.push(res);
      })
      loader.dismiss();
    }, error => {
      console.log(error);
      loader.dismiss();
      let alert = this.alertController.create({
        title: 'Erreur de réseau!',
        subTitle: 'Erreur : ' + error,
        buttons: ['OK']
      });
      alert.present();
    })
  }

  addLocation() {
    let alert = this.alertController.create({
      title: 'Feature is coming!',
      subTitle: 'We are still in early beta and the addition of new places will come in a next version!',
      buttons: ['OK']
    });
    alert.present();
  }

  goTo(location) {
    this.navCtrl.push(this.detailsLocationPage, {
      location: location
    });
  }

}
