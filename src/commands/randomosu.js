const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const osu = require('node-osu');

module.exports = {
    //Slash Command Gibberish
    data: new SlashCommandBuilder()
        .setName('randomosu')
        .setDescription('Returns a random beatmap.'),
    async execute(interaction) {
        var jsonbeatmap = [] // Converts json to array.
        importJson(jsonbeatmap, 'data/osumaps.json') // Imports json data, converts to usable array.
        var randommap = jsonbeatmap[Math.floor(Math.random() * jsonbeatmap.length)] // Generates random OSU map from database.
        var randommaplink = randommap[0] //Gets map link from database.
        var mapID = splitMessage(randommaplink) // Splits map link to get map ID. More in function.

        const osuApi = new osu.Api('cb1fb18f9a5e69e8f7d5ec1836639638321b144a', {
            // baseUrl: sets the base api url (default: https://osu.ppy.sh/api)
            notFoundAsError: true, // Throw an error on not found instead of returning nothing. (default: true)
            completeScores: false, // When fetching scores also fetch the beatmap they are for (Allows getting accuracy) (default: false)
            parseNumeric: false // Parse numeric values into numbers/floats, excluding ids
        });

        //Request from osu api
        osuApi.getBeatmaps({ s: mapID }).then(beatmaps => {

            var souce = undefined
            
            // Check for user who suggested map.
            if (beatmaps[0].source === "") {
                souce = "N/A"
            } else {
                souce = beatmaps[0].source
            }
            
            //Embed Gibberish
            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor('#fffb42')
                    .setTitle(`${beatmaps[0].title}`)
                    .setURL(randommaplink)
                    .addFields(
                        { name: 'Genre', value: `${beatmaps[0].genre}`, inline: true },
                        { name: 'Difficulty Rating', value: `${beatmaps[0].difficulty.rating}`, inline: true },
                        { name: 'Total Plays', value: `${beatmaps[0].counts.plays}`, inline: true },
                        { name: 'Status', value: `${beatmaps[0].approvalStatus}`, inline: true },
                        { name: 'BPM', value: `${beatmaps[0].bpm}`, inline: true },
                        { name: 'Circles', value: `${beatmaps[0].objects.normal}`, inline: true },
                        { name: 'Sliders', value: `${beatmaps[0].objects.slider}`, inline: true },
                        { name: 'Spinners', value: `${beatmaps[0].objects.spinner}`, inline: true },
                        { name: 'Artist', value: `${beatmaps[0].artist}`, inline: true },
                        { name: 'Source', value: souce, inline: true },
                        { name: 'Language', value: `${beatmaps[0].language}`, inline: true },
                        { name: 'Rating', value: `${beatmaps[0].rating}`, inline: true },
                        { name: 'Tags', value: `${beatmaps[0].tags}`, inline: false },
                    )
                    .setThumbnail(`https://b.ppy.sh/thumb/${mapID}l.jpg`)
                    .setTimestamp()
                    .setFooter({ text: `Suggested by ${randommap[1]}` })
                ]
            })
        });
    },
};


// Read if you want to lol
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
function splitMessage(link) {
    let split = link.split(`/`) //Cuts link parts upon '/'.
    let split2 = split[4].split(`#`) //Cuts splited parts upon '#'.
    return split2[0]; //Returns map ID.
}