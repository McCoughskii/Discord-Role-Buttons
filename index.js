'use strict'

const discord = require("discord.js");
const client = new discord.Client();
require("discord-buttons")(client);
const {prefix, TOKEN, buttonStyle, ownerID, roles} = require("./config.json")

const { disbut, MessageActionRow, MessageButton } = require("discord-buttons");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus('invisible')
        .catch(console.error);

});

client.on("message", async (msg) => {
    if (msg.author.bot) return;

    const row = new MessageActionRow()

    if (msg.content.toLowerCase() === "!buttontest"){

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
