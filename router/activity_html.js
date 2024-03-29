const express = require("express");
const router = express.Router();
const activity = require('../model/activity');
const valid = require('../validator/data_valid');
const { isLoggedIn } = require('./middleware');
require('express-session');


// 전체 & 부분
router.get('/list', (req, res) => {
    let keys = Object.keys(req.query);
    let values = Object.values(req.query);
    let verified = Object.assign({}, req.session.passport);

    let compare = Boolean;
    if (keys.length === 2)
        compare = ([ keys[0], keys[1] ].toString() === [ 'year', 'semester' ].toString())
    else if(keys.length === 1)
        compare = ([ keys[0] ].toString() === [ 'idx' ].toString())
    if (Object.values(verified).toString() === 'admin') {
        if (keys.length === 2 && compare) {
            //console.log(verified);
            // ex) ttp://localhost:8080/activity/list?year=22&semester=2
            activity.getActivityByPeriod(values, (err, data) => {
                try {
                    if(data !== null)
                        res.render('activity/list', { activityList : data, isLoggedIn : 1 });
                    else if(err !== null)
                        res.json(err);
                }
                catch (err) {
                    console.log("activity list by period router error " + err);
                    res.status(503).json({ message : "internal server error" });
                }
            })
        }
        else if (keys.length === 1 && compare) {
            // http://localhost:8080/activity/list?idx=
            activity.getActivityById(values, (err, data) => {
                try {
                    if (data !== null)  {
                        if(data.length === 0)  
                            res.status(404).json({ message: "Not Found" });
                        else
                            res.render('activity/detail', { activityDetail : data[0], isLoggedIn : 1 });
                    }
                    else if(err !== null)
                        res.json(data);
                }
                catch (err) {
                    console.log("specific activity router error " + err);
                }
            })
        }
        else if (keys.length === 0)  {
            // http://localhost:8080/activity/list
            activity.getAll((err, data) => {
                try {
                    if (data !== null)  {
                        if(data.length === 0)
                            res.status(404).json({ message: "Not Found" });
                        else
                            res.render('activity/list', { activityList : data, isLoggedIn : 1 });
                    }
                    else if(err !== null)
                        res.json(data);
                }
                catch (err) {
                    console.log("specific activity router error " + err);
                }
            })
        }
        else
            res.status(400).json({ message: "Forbidden" });
    }
    else    {
        if (keys.length === 2 && compare) {
            // ex) ttp://localhost:8080/activity/list?year=22&semester=2
            activity.getActivityByPeriod(values, (err, data) => {
                try {
                    if(data !== null)
                        res.render('activity/list', { activityList : data, isLoggedIn : 0 });
                    else if(err !== null)
                        res.json(err);
                }
                catch (err) {
                    console.log("activity list by period router error " + err);
                    res.status(503).json({ message : "internal server error" });
                }
            })
        }
        else if (keys.length === 1 && compare) {
            // http://localhost:8080/activity/list?idx=
            activity.getActivityById(values, (err, data) => {
                try {
                    if (data !== null)  {
                        if(data.length === 0)  
                            res.status(404).json({ message: "Not Found" });
                        else
                            res.render('activity/detail', { activityDetail : data[0], isLoggedIn : 0 });
                    }
                    else if(err !== null)
                        res.json(data);
                }
                catch (err) {
                    console.log("specific activity router error " + err);
                }
            })
        }
        else if (keys.length === 0)  {
            // http://localhost:8080/activity/list
            activity.getAll((err, data) => {
                try {
                    if (data !== null)  {
                        if(data.length === 0)
                            res.status(404).json({ message: "Not Found" });
                        else
                            res.render('activity/list', { activityList : data, isLoggedIn : 0 });
                    }
                    else if(err !== null)
                        res.json(data);
                }
                catch (err) {
                    console.log("specific activity router error " + err);
                }
            })
        }
    }
})

router.get('/post', isLoggedIn, (req, res) => {
    let key = Object.keys(req.query);
    let value = Object.values(req.query);
    let compare = Boolean;

    if(key.length === 1)
        compare = ([ key ].toString() === [ 'idx' ].toString())

    if(key.length === 1 && compare) {
        // http://localhost:8080/activity/post?idx=
        activity.getActivityById(value, (err, data) => {
            try {
                if(data !== null)    {
                    console.log(data);
                    res.render('activity/post', { idx : true, data : data[0], isLoggin : 1});
                }
                else if(err !== null)
                    res.json(err);
            }
            catch(err)  {
                console.log("activity post router error " + err);
            }
        })
    }
    else if(key.length === 0)
        res.render('activity/post', { idx : false, data : '' });
    else
        res.redirect('/activity/list');
})

router.post('/post', valid.CheckActivityInfo, valid.errorCallback,(req, res) => {
    let key = Object.keys(req.query);
    let value = Object.values(req.query);
    let compare = Boolean;

    if(key.length === 1)
        compare = ([ key ].toString() === [ 'idx' ].toString())
    else if(key.length === 0) // ???????????
        compare = true;

    if(key.length === 1 && compare) {
        // http://localhost:8080/activity/post?idx=

        let updateData = {
            year : req.body.year,
            semester : req.body.semester, 
            details : req.body.details,
            title : req.body.title,
            complete : req.body.complete
        }

        activity.modify(value, updateData, (err, data) => {
            try {
                if(data !== null)    {
                    res.redirect(`/activity/list?idx=${value}`);
                }
                else if(err !== null)
                    res.json(err);
            }
            catch(err)  {
                console.log("activity post router error " + err);
            }
        })
    }
    else if(key.length === 0 && compare)    {
        // http://localhost:8080/activity/post

        let inputData = {
            year : req.body.year,
            semester : req.body.semester, 
            details : req.body.details,
            title : req.body.title,
            complete : req.body.complete
        }
        
        activity.create(inputData, (err, data) => {
            try {
                if(data !==  null)    {
                    res.redirect(`/activity/list?year=${activityInfo.year}&semester=${activityInfo.semester}`);
                }
                else if(err !== null)
                    res.json(err);
            }
            catch(err)  {
                console.log("activity post router error " + err);
            }
        })
    }
    else
        res.status(404).json({ message : "Not found" });
})

// http://localhost:8080/activity/list?idx=
router.delete('/list', isLoggedIn, (req, res) => {
    let id = req.query.idx;

    activity.destroy(id, (err, data) => {
        try {
            if(data !== null) {
                res.redirect('/activity/list');
            }
            else if(err !== null)
                res.json(err);
        }
        catch (err) {
            console.log("activity delete router error " + err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    })
})


module.exports = router;