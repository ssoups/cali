const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { Permissions } = require('discord.js');


module.exports = {
	//Slash Command Gibberish
	data: new SlashCommandBuilder()
		.setName('newtetriostats')
		.setDescription('MOST GREATEST TERIO STATS REAL NOT CLICKBAIT!')
		.addStringOption(option => option.setName('username').setDescription('Enter username')),
	async execute(interaction) {

		const string = (interaction.options.getString('username'));
		if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			return interaction.reply("Under development! \nhttps://media.discordapp.net/attachments/980203166605918258/983238651297275924/unknown.png")
		}

		if (string === null) return interaction.reply({
			embeds: [new MessageEmbed()
				.setColor('#ff0000')
				.addFields(
					{
						name: `Error`, value: `You can not have username blank!`, inline: true
					}
				)
				.setTimestamp()
			]
		});

		// First request from tetrio api.
		fetch(`https://ch.tetr.io/api/users/${string.toLowerCase()}`)
			.then(res => res.json())
			.then(json => {
				// Second request from tetrio api.
				fetch(`https://ch.tetr.io/api/users/${string.toLowerCase()}/records`)
					.then(res => res.json())
					.then(json2 => {
						if (json.error) return interaction.reply("No such user found.")

						var simplifedGametime = undefined
						var _40lineTime = undefined
						var rank = undefined
						var totalWins = json.data.user.gameswon
						var leagueWLR = Math.round((json.data.user.league.gamesplayed / json.data.user.league.gameswon) * 100) / 100
						var leagueWins = json.data.user.league.gameswon
						var speed = json.data.user.league.pps

						
						if (json.data.user.gametime < 3600) {
							simplifedGametime = Math.round((json.data.user.gametime / 60) * 10) / 10 + " minutes" 
						} else if (json.data.user.gametime > 3600) {
								simplifedGametime = Math.round(((json.data.user.gametime / 60) / 60) * 10) / 10 + " hours" 
						}


						if (json2.data.records['40l'].record) {
							var time = json2.data.records['40l'].record.endcontext.finalTime
							_40lineTime = `${Math.floor((time / 1000) / 60)}:${(Math.round(((time / 1000) % 60) * 1000)) / 1000}` 
						} else { 
							_40lineTime = "No time recorded"
						}
						console.log(json.data.user.country)

						// Embed Gibberish
						return interaction.reply({
							embeds: [new MessageEmbed()
								.setColor('#fffb42')
								.setTitle(`${json.data.user.username}'s Statistics :flag_${(json.data.user.country).toLowerCase()}:`)
								.setThumbnail(`https://tetr.io/user-content/avatars/${json.data.user._id}.jpg?rv=${json.data.user._id.avatar_revision}`)
								.addFields(
									{ name: `Rank`, value: `${tetrioleague((json.data.user.league.rank).toUpperCase())} | ${(Math.round(json.data.user.league.percentile * 100))} percentile`, inline: true },
									{ name: '40 Line', value: _40lineTime, inline: true },
									{ name: 'Blitz Score:', value: `${json2.data.records.blitz.record.endcontext.score}`, inline: true },
									{ name: 'Total Wins', value: `${json.data.user.gameswon}`, inline: true },
									{ name: 'League W/L Ratio', value: `${Math.round((json.data.user.league.gamesplayed / json.data.user.league.gameswon) * 100) / 100}`, inline: true },
									{ name: 'League Wins', value: `${json.data.user.league.gameswon}`, inline: true },
									{ name: 'Gametime', value: simplifedGametime, inline: true },
									{ name: 'Speed', value: `${json.data.user.league.pps} pps (Piece Per Second)`, inline: true },
								)
								.setTimestamp(),

							]
						});
					})
			});
	},
};


function tetrioleague(leauge) {
	if (leauge === "X"){
		return("<:tetrioX:982170684589494363>")
	} else 	if (leauge === "U"){
		return("<:tetrioU:982170684358799381>")
	} else 	if (leauge === "SS"){
		return("<:tetrioSS:982170684748873768> ")
	} else 	if (leauge === "S+"){
		return("<:tetrioSp:982170684660797480>")
	} else 	if (leauge === "S"){
		return("<:tetrioS:982170684866326588>")
	} else 	if (leauge === "A+"){
		return("<:tetrioAp:982170684992139305>")
	} else 	if (leauge === "A"){
		return("<:tetrioA:982170684966969355>")
	} else 	if (leauge === "A-"){
		return("<:tetrioAm:982170684920848424> ")
	} else 	if (leauge === "B+"){
		return("<:tetrioBp:982170684983754792>")
	} else 	if (leauge === "B"){
		return("<:tetrioB:982170684534964245>")
	} else if (leauge === "B-"){
		return("<:tetrioBm:982170684803403816>")
	} else 	if (leauge === "C+"){
		return("<:tetrioCp:982170684824375326> ")
	} else 	if (leauge === "C"){
		return("<:tetrioC:982170684920848414>")
	} else 	if (leauge === "C-"){
		return("<:tetrioCm:982170684631429121>")
	} else 	if (leauge === "D"){
		return("<:tetrioD:982170684916650004>")
	} else 	if (leauge === "D+"){
		return("<:tetrioDp:982170684765634611>")
	} else if (leauge === "Z") {
		return("unrated")
	} else {
		return("?")
	}
}