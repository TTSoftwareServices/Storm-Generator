const { DBLicenseEntry, DBLicenseEntry2 } = require("./helpers");
const { DBPool } = require("./var_dump");

const DBSeed = (message, DBPool) => {
    if (message.channel.id == 948149056016875531) {
        if (message.author.bot) return;
        if (message.author.id !== "926427801488338944") return;
        let entry = parseInt(message.content.split(" ")[1])

        DBPool.getConnection(function (err, conn) {
            if (err) { conn.release(); console.log('MySQL: Pool connection error: ' + err); }
            console.log('MySQL: Connected to Database');

            isNaN(entry) ? conn.query(DBLicenseEntry(1)) : conn.query(DBLicenseEntry(entry, message))
            console.log(entry)
        });
    }
}

const DBSeed1 = (message, DBPool) => {
    if (message.channel.id == 948149056016875531) {
        if (message.author.bot) return;
        if (message.author.id !== "926427801488338944") return;
        let entry = parseInt(message.content.split(" ")[1])

        DBPool.getConnection(function (err, conn) {
            if (err) { conn.release(); console.log('MySQL: Pool connection error: ' + err); }
            console.log('MySQL: Connected to Database');

            isNaN(entry) ? conn.query(DBLicenseEntry2(1)) : conn.query(DBLicenseEntry2(entry, message))
            console.log(entry)
        });
    }
}

Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

const ActivateUser = (message, DBPool) => {
    if (message.channel.id == 948149056016875531) {
        let key = message.content.split(" ")[1]
        DBPool.getConnection(function (err, conn) {
            if (err) { conn.release(); console.log('MySQL: Pool connection error: ' + err); }
            console.log('MySQL: Connected to Database');

            conn.query("SELECT * FROM `keys` WHERE `licensekeys` = ?", [message.content.split(" ")[1]], (err, results, fields) => {
                let keyinfo = results;
                if (!results || results.length <= 0) {
                    return message.reply('Key not found, try !!redeem <yourkey>')
                }
                if (err) return console.log(err)
                if (!results || results.length <= 0) {
                    return message.channel.send('Key not found, try !!redeem <yourkey>')
                } else {
                    if (keyinfo[0].timestamp == "week") {
                        let date1 = new Date();
                        let newdate = date1.addDays(7);
                        console.log(newdate)
                        conn.query("INSERT INTO `licenses`(`discordid`, `key`, `days`, `gens`) VALUES (?, ?, ?, ?)", [message.author.id, key, newdate, '6'], (err, results, fields) => {
                            if (err) console.log(err)
                        })
                        message.reply('Your key has been activated, have fun :)');
                        conn.query("DELETE FROM `keys` WHERE `licensekeys` = ?", [key])
                    }
                    if (keyinfo[0].timestamp == "month") {
                        let date1 = new Date();
                        let newdate = date1.addDays(30);
                        console.log(newdate)
                        conn.query("INSERT INTO `licenses`(`discordid`, `key`, `days`, `gens`) VALUES (?, ?, ?, ?)", [message.author.id, key, newdate, '6'], (err, results, fields) => {
                            if (err) console.log(err)
                        })
                        message.reply('Your key has been activated, have fun :)');
                        conn.query("DELETE FROM `keys` WHERE `licensekeys` = ?", [key])
                    }
                }
            })
        });
    }
}
const restock = (message, DBPool) => {
    if (message.author.id !== "926427801488338944") return;
    DBPool.getConnection(function (err, conn) {
        const fs = require('fs');
        fs.readFile('forgen.txt', function (err, data) {
            if (err) throw err;
            const arr = data.toString().replace(/\r\n/g, '\n').split('\n');
            for (let i of arr) {
                console.log("Imported: " + i);
                conn.query("INSERT INTO rockstar (acc) VALUES (?)", [i])
            }
        })
    });
}
function refill() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear()
    const datum = year + "-" + month + "-" + day;
    DBPool.getConnection(function (err, conn) {
        conn.query("SELECT * FROM `genrefill` WHERE `day` = ?", [datum], (err, results, fields) => {
            if (!results || results.length <= 0) {
                conn.query("SELECT * FROM `licenses`", (err, resultsssss, fields) => {
                    for (let ii of resultsssss) {
                        console.log(JSON.parse(JSON.stringify(ii)))
                        conn.query("UPDATE `licenses` SET `gens`=? WHERE discordid=?", [resultsssss.maxgens, resultsssss.discordid])
                    }
                })

            } else {
                console.log("already refilled")
            }

        })
    })
}

const stock = (message, DBPool) => {
    if (message.channel.id == 948149056016875531) {
        DBPool.getConnection(function (err, conn) {
            conn.query("SELECT count(*) as total FROM `rockstar`", (err, resultss, fields) => {
                message.channel.send("Rockstar: " + resultss[0].total)
            })
        });
    }
}

const MaxGens = (message, DBPool) => {
    let discordid = message.content.split(" ")[1]
    let maxgens = message.content.split(" ")[2]
    console.log(discordid)
    console.log(maxgens)
    if (message.author.id !== "926427801488338944") return;
    if (message.channel.id == 948149056016875531) {
        DBPool.getConnection(function (err, conn) {
            conn.query("UPDATE `licenses` SET `max_gens`=? WHERE `discordid`=?", [maxgens, discordid])
            message.channel.send(`Changed <@${discordid}>'s gens to ${maxgens} a day.`)
        });
    }
}

const Genstuff = (message, DBPool) => {
    if (message.channel.id == 947134079797710848) {
        if (message.content.split(" ")[1] == "rockstar") {
            DBPool.getConnection(function (err, conn) {
                console.log('MySQL: Connected to Database');
                refill()

                conn.query("SELECT * FROM `licenses` WHERE `discordid` = ?", [message.author.id], (err, results, fields) => {
                    if (!results || results.length <= 0) {
                        return message.reply("You have no active license.")
                    }
                    else {
                        var d1 = new Date();
                        var d2 = new Date(results[0].days);
                        console.log(d1)
                        console.log(d2)
                        if (d1 > d2) {
                            conn.query("DELETE FROM `licenses` WHERE `discordid`=?", [message.author.id])
                            return message.reply("You have no active license.")
                        } else {
                            console.log("going")
                        }

                        let info = results;
                        console.log(info[0].gens)
                        if (info[0].gens !== "0") {
                            let gensleft = info[0].gens - 1;

                            conn.query("SELECT `acc` FROM `rockstar` ORDER BY RAND() LIMIT 1", (err, result, fields) => {
                                let account = result[0].acc;
                                message.reply("Check ur private messages!")
                                message.author.send("Here is you're rockstar account:")
                                message.author.send("```\nStorm Generator\n\nRockstar Account: " + account + "\nGens Left: " + gensleft + "\n\nMade by St0rm#9999```")
                                conn.query("UPDATE `licenses` SET `gens`=? WHERE `discordid`=?", [gensleft, message.author.id])
                                conn.query("DELETE FROM `rockstar` WHERE `acc`=?", [account])
                            })
                        } else {
                            return message.reply("You have no gens left for today.")
                        }
                    }
                })
            })
        }
        else {
            message.reply("Service not found.")
        }
    }
}

module.exports = { DBSeed, ActivateUser, DBSeed1, Genstuff, restock, stock, MaxGens };