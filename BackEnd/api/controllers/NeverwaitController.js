/**
 * NeverwaitController
 *
 * @description :: Server-side logic for managing neverwaits
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    // Création d'une nouvelle location
    create: function (req, res) {
        // On vérifie qu'il y ait les bons arguments
        if (!req.body.name) return res.badRequest("Pas de name")
        if (!req.body.urlImg) return res.badRequest("Pas de urlImg")
        if (!req.body.tempsAttMax) return res.badRequest("Pas de tempsAttMax")
        // On crée la nouvelle location
        creation({
            "nom": req.body.name,
            "urlImg": req.body.urlImg,
            "taux_occupation": 0,
            "tempsAtt": 0,
            "tempsAttMax": req.body.tempsAttMax,
            "sensors": [0, 0, 0, 0]
        });
        //@Todo : Renvoyer l'objet créé et pas juste ok
        return res.ok();
    },

    // Reset sert à créer le model initial
    reset: function (req, res) {
        Histo.destroy({}).exec(function (err) {
            if (err) {
                return res.negotiate(err);
            }
            Report.destroy({}).exec(function (err) {
                if (err) {
                    return res.negotiate(err);
                }
                Neverwait.destroy({}).exec(function (err) {
                    if (err) {
                        return res.negotiate(err);
                    }
                    creation({
                        "nom": "RU INSA Toulouse",
                        "urlImg": "https://www.etud.insa-toulouse.fr/~contact/logos/logos_taille_orig/orig_logo_insatoulouse-quadri.jpg",
                        "taux_occupation": 75,
                        "tempsAtt": 15,
                        "tempsAttMax": 30,
                        "sensors": [2, 2, 1, 0]
                    });
                    creation({
                        "nom": "Cafeteria Laas",
                        "urlImg": "https://www.laas.fr/public/sites/www.laas.fr.public/files/logos/Logo_Laas_Carnot.png",
                        "taux_occupation": 80,
                        "tempsAtt": 12,
                        "tempsAttMax": 30,
                        "sensors": [2, 2, 1, 2, 0, 0, 0]
                    })
                    return res.ok();
                });
            });
        });
    }
};

var creation = function (obj) {
    Neverwait.create(obj, function (err, created) {
        if (!err) {
            Histo.create({
                id: created.id,
                dates: {}
            }, function (errHisto, createdHisto) {
                if (!err) {
                    return created;
                } else {
                    return err
                }
            })
        } else {
            return err
        }
    })
}

// Exemple d'histo 

/*"2017/1/20": {
                        global: {
                            nbVal: 2,
                            tempsAttMoy: Math.floor((Math.random() * 8) + 10)
                        },
                        heures: {
                            "10h30-11h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 3) + 2)
                            },
                            "11h00-11h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h30-12h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "12h00-12h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 10) + 19)
                            },
                            "12h30-13h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 6) + 15)
                            },
                            "13h00-13h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "13h30-14h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            }
                        }
                    },
                    "2017/1/21": {
                        global: {
                            nbVal: 2,
                            tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                        },
                        heures: {
                            "10h30-11h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h00-11h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h30-12h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "12h00-12h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 10) + 7)
                            },
                            "12h30-13h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 6) + 15)
                            },
                            "13h00-13h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "13h30-14h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            }
                        }
                    },
                    "2017/1/22": {
                        global: {
                            nbVal: 2,
                            tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                        },
                        heures: {
                            "10h30-11h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h00-11h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h30-12h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "12h00-12h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 10) + 7)
                            },
                            "12h30-13h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 6) + 15)
                            },
                            "13h00-13h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "13h30-14h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            }
                        }
                    },
                    "2017/1/23": {
                        global: {
                            nbVal: 2,
                            tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                        },
                        heures: {
                            "10h30-11h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h00-11h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h30-12h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "12h00-12h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 10) + 7)
                            },
                            "12h30-13h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 6) + 15)
                            },
                            "13h00-13h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "13h30-14h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            }
                        }
                    },
                    "2017/1/24": {
                        global: {
                            nbVal: 2,
                            tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                        },
                        heures: {
                            "10h30-11h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h00-11h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h30-12h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "12h00-12h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 10) + 7)
                            },
                            "12h30-13h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 6) + 15)
                            },
                            "13h00-13h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "13h30-14h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            }
                        }
                    },
                    "2017/1/25": {
                        global: {
                            nbVal: 2,
                            tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                        },
                        heures: {
                            "10h30-11h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h00-11h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h30-12h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "12h00-12h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 10) + 7)
                            },
                            "12h30-13h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 6) + 15)
                            },
                            "13h00-13h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "13h30-14h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            }
                        }
                    },
                    "2017/1/26": {
                        global: {
                            nbVal: 2,
                            tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                        },
                        heures: {
                            "10h30-11h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h00-11h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "11h30-12h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "12h00-12h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 10) + 7)
                            },
                            "12h30-13h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 6) + 15)
                            },
                            "13h00-13h30": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            },
                            "13h30-14h00": {
                                nbVal: 1,
                                tempsAttMoy: Math.floor((Math.random() * 4) + 7)
                            }
                        }
                    }*/