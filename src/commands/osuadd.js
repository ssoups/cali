const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    // Slash Command Gibberish
    data: new SlashCommandBuilder()
        .setName('osuadd')
        .setDescription('Adds a beatmap to the database.')
        .addStringOption(option => option.setName('link').setDescription('The link to the beatmap.')),
    async execute(interaction) {

        // Checks if link has been entered.
        if (interaction.options.getString('link') === null) {
            return interaction.reply('Beatmap link is required.')
        }
        const string = (interaction.options.getString('link'));

        // Checks if link is valid.
        if (string.includes('https://osu.ppy.sh/beatmapsets/')) {
            var jsonbeatmap = []
            var addtojson = [string, `${interaction.user.username}#${interaction.user.discriminator}`]
            importJson(jsonbeatmap, 'data/osumaps.json')
            jsonbeatmap.push(addtojson)
            saveJson(jsonbeatmap, 'data/osumaps.json') // Saves to json file.
            return interaction.reply("beat map added")
        } else {
            return interaction.reply("This is an invalid beatmap link.")
        }
    },
};

function importJson(array, file) {
    const rawdjson = fs.readFileSync(file);
    const jsJson = JSON.parse(rawdjson);
    for (let i = 0; i < jsJson.length; i++) {
        array.push(jsJson[i]);
    }
    // console.log(`${file} has been imported.`)
}

function saveJson(array, file) {
    const jsonData = JSON.stringify(array, null, 2)
    fs.writeFile(file, jsonData, finisher)
    // console.log(`Data has been saved to ${file}`)
}

function finisher(error) {
    if (error) {
        console.error(error)
        return
    }
}
