const mysql = require("mysql")
const PREFIX = "!!";
const { Client, MessageEmbed } = require('discord.js');
const client = new Client({
    partials:['MESSAGE', 'REACTION']
});

const DBConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "rockstar"
};  
   
const DBPool = mysql.createPool(DBConfig);

module.exports = { DBPool, DBConfig, PREFIX, client, MessageEmbed };