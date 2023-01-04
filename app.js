require('dotenv').config();
const path = require('path');
const gis = require('googlethis');

const Discord = require('discord.js');
const fs = require('fs');

const commands = [
    {
        name: 'shrek',
        description: 'Shrek in discord!',
    },
];

const rest = new Discord.REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Discord.Routes.applicationCommands('768116129490665534'), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
    ]
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'shrek') {
        let script = parseScript(fs.readFileSync("./shrek.txt", 'utf-8'));
        let index = 0;
        const interval = setInterval(
            async function () {
                if (index >= script.length) clearInterval(interval)
                let line = script[index];
                index++
                if (!/\S/.test(line)) return;
                let name = !!line.match(/(([A-Z0-9\']\s?( - )?)+\s?\n)+/) ? line.match(/(([A-Z0-9\']\s?( - )?)+\s?\n)+/)[0] : 'NULL'
                line = String(line).replace(name, "\u{200B}").trim();
                let result = ""
                try { result = await gis.image(`SHREK ${name}`, { safe: true }); result = result[0].url } catch (e) { result = "https://www.stignatius.co.uk/wp-content/uploads/2020/10/default-user-icon.jpg" }
                const channel = interaction.channel;
                const embed = new Discord.EmbedBuilder()
                embed.setDescription(line)
                embed.setColor("lime")
                if (name != "NULL")
                    embed.setAuthor({ name: name, iconURL: result })
                channel.send({
                    embeds: [embed]
                });
            }, 1000)
    }
});

function parseScript(data) {
    let script = data.split("\r\n")
    let scriptEnd = [];
    for (let i = 0; i < script.length; i++) {
        let temp = ""
        while (true) {
            if (!/\S/.test(script[i]) || i > script.length) break
            temp += `${String(script[i]).trim()}\n`
            i++
        }
        scriptEnd.push(temp)
    }
    return scriptEnd
}


/**
 * Must stay at the bottom of the script
 */
if (!!process.env.DISCORD_TOKEN) client.login(process.env.DISCORD_TOKEN);