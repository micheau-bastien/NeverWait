/**
 * ReportController
 *
 * @description :: Server-side logic for managing reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    findReportById: function (req, res) {
        console.log(req.params.id)
        Report.find({ idLocation: req.params.id }).exec(function (err, found) {
            if (!err) {
                return res.json(found)
            } else {
                return res.serverError(err);
            }
        })
    },
    findReportByIdAndByTime: function (req, res) {
        console.log(req.params.id)
        console.log(req.params.time)
    },
    getNbReportForIdAndTime: function (req, res) {
        if (!req.query.date) return res.badRequest("Pas de date")
        Report.count({ idLocation: req.params.id , date : req.query.date}).exec(function(err, nb){
            return res.json({nb : nb})
        })
    }
};

