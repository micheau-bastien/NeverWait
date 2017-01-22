/**
 * HistoController
 *
 * @description :: Server-side logic for managing histoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function (req, res) {
        return res.forbidden();
    },

    getHistoForId: function (req, res) {
        Histo.findOne({ id: req.params.id }).exec(function (err, found) {
            var newHisto = {
                id: found.id,
                dates: {}
            }
            var keys = Object.keys(found.dates).slice(Object.keys(found.dates).length - 7, Object.keys(found.dates).length)
            keys.forEach(key => {
                newHisto.dates[key] = found.dates[key];
            })
            return res.json(newHisto)
        })
    },

    addmesureByName: function (req, res) {
        //Vérification des arguments passés
        if (!req.body.name) return res.badRequest("Pas de name")
        if (!req.body.sensors) return res.badRequest("Pas de sensors")
        Neverwait.findOne({ nom: req.body.name }).exec(function (err, foundNeverWait) {
            if (!err) {
                // On vérifie que le nom donné dans la requete est bien le bon
                if (!foundNeverWait) {
                    return res.serverError('Name not found in database, asks an admin to create the location');
                }

                // Calcul du temps d'attente et du taux de remplissage                
                var tempsAtt = 0;
                var taux_occupation = 0;
                var tmps2 = foundNeverWait.tempsAttMax / req.body.sensors.length;
                var tmps1 = foundNeverWait.tempsAttMax / (2 * req.body.sensors.length);
                var nb0 = 0;

                for (i = 0; i < req.body.sensors.length; i++) {
                    if (req.body.sensors[i] == 0) {
                        nb0++;
                        if (nb0 == 2) {
                            break;
                        }
                    } else if (req.body.sensors[i] == 1) {
                        nb0 = 0;
                        tempsAtt += tmps1;
                        taux_occupation += 100 / (2 * req.body.sensors.length);
                    } else {
                        nb0 = 0;
                        tempsAtt += tmps2;
                        taux_occupation += 100 / req.body.sensors.length;
                    }
                }

                // On arrondi le temps d'attente final et le taux d'occupation
                tempsAtt = Math.round(tempsAtt);
                taux_occupation = Math.round(taux_occupation);

                //Update des informations en direct de la localisation
                Neverwait.update({ nom: req.body.name }, {
                    tempsAtt: tempsAtt,
                    taux_occupation: taux_occupation,
                    sensors: req.body.sensors
                }).exec(function afterwards(err, updated) {
                    if (err) return err;
                });

                // Ajout de la mesure dans l'historique
                Histo.findOne({ id: foundNeverWait.id }).exec(function (err, found) {
                    if (!err) {
                        editHisto(found, req.body, tempsAtt);
                        Histo.update({ id: foundNeverWait.id }, found).exec(function afterwards(err, updated) {
                            if (!err) {
                                return res.json(updated)
                            } else {
                                return err;
                            }
                        });
                    } else {
                        return res.serverError(err);
                    }
                });
            } else {
                return res.serverError(err);
            }
        });
    }
};

var editHisto = function (histo, body, tempsAtt) {
    var now = new Date();
    let formatedDate = formatDate(now);    
    if (!histo.dates[formatedDate]) {
        // Si il n'y a pas encore d'historique pour la date donnée on le crée
        histo.dates[formatedDate] = {
            "global": {
                "nbVal": 1,
                "tempsAttMoy": tempsAtt
            },
            "heures": {
            }
        }
        // Puis on le complète avec les heures
        histo.dates[formatedDate].heures[findHour(now.getHours(), now.getMinutes())] = {
            nbVal: 1,
            tempsAttMoy: tempsAtt
        }
    } else {
        // Si il y a déjà un historique
        editHistoAlreadyCreated(histo, body, tempsAtt);
    }
    return histo;
}

var editMoy = function (oldMoy, oldNbVal, toAddToMoy) {
    return Math.round((((oldMoy * oldNbVal) + toAddToMoy) / (oldNbVal + 1)));
}

var findHour = function (hour, min) {
    if (min < 30) {
        return hour + 'h00-' + hour + 'h30';
    } else {
        var a = parseInt(hour) + 1;
        return hour + 'h30-' + a + 'h00';
    }
}

var editHistoAlreadyCreated = function (histo, body, tempsAtt) {
    var now = new Date();
    let formatedDate = formatDate(now);
    histo.dates[formatedDate].global.tempsAttMoy = editMoy(histo.dates[formatedDate].global.tempsAttMoy, histo.dates[formatedDate].global.nbVal, tempsAtt)
    histo.dates[formatedDate].global.nbVal++;
    if (histo.dates[formatedDate].heures[findHour(now.getHours(), now.getMinutes())]) {
        histo.dates[formatedDate].heures[findHour(now.getHours(), now.getMinutes())].tempsAttMoy = editMoy(histo.dates[formatedDate].heures[findHour(now.getHours(), now.getMinutes())].tempsAttMoy, histo.dates[formatedDate].heures[findHour(now.getHours(), now.getMinutes())].nbVal, tempsAtt)
        histo.dates[formatedDate].heures[findHour(now.getHours(), now.getMinutes())].nbVal++
    } else {
        histo.dates[formatedDate].heures[findHour(now.getHours(), now.getMinutes())] = {
            nbVal: 1,
            tempsAttMoy: tempsAtt
        }
    }
    return histo;
}

var formatDate = function (date) {
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
}