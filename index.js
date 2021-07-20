'use strict'

// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform you.
if (Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("Node 12.0.0 or higher is required. Update Node on your system.");

const discord = require("discord.js");
const client = new discord.Client();
require("discord-buttons")(client);
const config = require("config.json");
const {prefix, buttonStyle, ownerID, roles} = config;
const { disbut, MessageActionRow, MessageButton } = require("discord-buttons");
const TOKEN = process.env.TOKEN || config.TOKEN;

client.logger = require("./modules/Logger");


client.on("ready", () => {
    client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");
    client.user.setStatus('invisible')
        .catch(console.error);

});

client.on("message", async (msg) => {
    if (msg.author.bot) return;

    const row = new MessageActionRow()

    if (msg.content.toLowerCase() === "!spawnbuttons"){

        for (let i = 0; i < roles.length; i++) {
            let button = new MessageButton()
                .setLabel(roles[i].buttonName)
                .setID(roles[i].uniqueID)
                .setStyle(roles[i].style);

            if (roles[i].Emoji != "") {
                button.setEmoji(roles[i].Emoji);
            }

            row.addComponent(button);
        }
        
        if (msg.author.id === ownerID) {
            msg.channel.send("Click a button to toggle that role!", row)
            msg.delete();
        }

    }
});

client.on("clickButton", async (button) => {
    await button.clicker.fetch(true);
    let role = button.clicker.member.roles;
    
    for (let i = 0; i < roles.length; i++) {
        let {roleID, uniqueID} = roles[i];

        if (uniqueID == button.id) {

            if (role.cache.has(roleID)) {
                role.remove(roleID);
                button.reply.send(`Removed the role <@&${roleID}>`, true);
                await button.clicker.fetch();
            } else {
                role.add(roleID);
                button.reply.send(`Gave the role <@&${roleID}>`, true);
                await button.clicker.fetch();
            }
        }
        
    }
})

client.login(TOKEN);
