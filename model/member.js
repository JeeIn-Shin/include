const db = require('../config/database');

const MEMBER = {
    getAll : function(result) {
        db.getConnection((err, connection) => {
            if(!err) {
                let sql = `SELECT * FROM member_board`;
                connection.query(sql, (err, res) => {
                    connection.release();

                    if(err) {
                        console.log("sql error " + err);
                        result(null, err);
                        return ;
                    }
                    result(null, res);
                    return ;
                })
            }
            else    {
                console.log("mysql connection error " + err);
                throw err;
            }
        })
    },
    // 멤버들에 대한 데이터가
    create : function(member, result) {

        let input = Object.values(member);
        console.log(input);

        db.getConnection((err, connection) => {
            if(!err) {
                let sql = `INSERT INTO member_board  VALUES (?)`;
                connection.query(sql, [input], (err, res) => {
                    connection.release();

                    if(err) {
                        console.log("sql error " + err);
                        result(null, err);
                        return ;
                    }
                    result(null, res);
                    return ;
                })
            }
            else    {
                console.log("mysql connection error " + err);
                throw err;
            }
        })
    },

    modify : function(idx, data, result) {

        let updateData = Object.values(data);

        db.getConnection((err, connection) => {
            if(!err) {
                let sql = `UPDATE member_board set name = ? , first_track = ?, second_track = ?, 
                           git_hub = ? , phone_number = ? , 
                           email = ?,  graduation =  ?
                           WHERE idx = ${idx}`;
                connection.query(sql, updateData, (err, res) => {
                    connection.release();

                    if(err) {
                        console.log("sql error " + err);
                        result(null, err);
                        return ;
                    }
                    result(null, res);
                    return ;
                })
            }
            else    {
                console.log("mysql connection error " + err);
                throw err;
            }
        })
    },
    
    destroy : function(idx, result) {
        db.getConnection((err, connection) => {
            if(!err) {
                let sql = `DELETE FROM member_board WHERE idx = ${idx}`;
                connection.query(sql, (err, res) => {
                    connection.release();

                    if(err) {
                        console.log("sql error " + err);
                        result(null, err);
                        return ;
                    }
                    result(null, res);
                    return ;
                })
            }
            else    {
                console.log("mysql connection error " + err);
                throw err;
            }
        })
    }
}

module.exports = MEMBER;