require('dotenv').config();
const { PREFIX, DBPool, client, MessageEmbed } = require("./var_dump.js")
const { DBSeed, ActivateUser, DBSeed1, Genstuff, restock, stock, MaxGens} = require("./commands.js");

// CLIENT READY AND BOT ACTIVITY
client.on('ready', () => {
    console.log("Connected as " + client.user.tag);

    client.user.setActivity("FiveM", {type: "PLAYING"});
});

client.on('message', async message => {
    if (message.author.bot) return; 
    if (message.content.startsWith(PREFIX)) { 
            const [CMD_NAME, ...args] = message.content 
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
    
        // DB Query functions (Need the message and a DBPool passed)
        if (CMD_NAME === 'redeem') ActivateUser(message, DBPool);
        if (CMD_NAME === 'genweek') DBSeed(message, DBPool);
        if (CMD_NAME === 'genmonth') DBSeed1(message, DBPool);
        if (CMD_NAME === 'gen') Genstuff(message, DBPool);
        if (CMD_NAME === 'restock') restock(message, DBPool);
        if (CMD_NAME === 'stock') stock(message, DBPool);
        if (CMD_NAME === 'maxgens') MaxGens(message, DBPool);
    }
});

client.login(process.env.BOT_TOKEN);