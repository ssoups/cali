const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');


module.exports = {
	//Slash Command Gibberish
	data: new SlashCommandBuilder()
		.setName('tetriostats')
		.setDescription('Replies tetr.io stats!')
		.addStringOption(option => option.setName('username').setDescription('Enter username')),
	async execute(interaction) {
		const string = (interaction.options.getString('username'));
		if (string === null) return interaction.reply({
			embeds: [new MessageEmbed()
				.setColor('#ff0000')
				.addFields(
					{
						name: `Error`, value: `You can not have username blank!
				`, inline: true
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
						// var totalWins = json.data.user.gameswon
						// var leagueWLR = Math.round((json.data.user.league.gamesplayed / json.data.user.league.gameswon) * 100) / 100
						// var leagueWins = json.data.user.league.gameswon
						// var speed = json.data.user.league.pps

						// Converts tetrio gametime to minutes or hours. Returns to variable simplifedGametime
						if (json.data.user.gametime < 3600) { //Checks if gametime is less than an hour.
							simplifedGametime = Math.round((json.data.user.gametime / 60) * 10) / 10 + " minutes" //Converts gametime to minutes.
						} else if (json.data.user.gametime > 3600) {
								simplifedGametime = Math.round(((json.data.user.gametime / 60) / 60) * 10) / 10 + " hours" //Converts gametime to hours.
						}

						// Turns time in milliseconds into a rounded minutes and seconds. Returns to variable _40linetTime
						if (json2.data.records['40l'].record) {
							var time = json2.data.records['40l'].record.endcontext.finalTime
							_40lineTime = `${Math.floor((time / 1000) / 60)}:${(Math.round(((time / 1000) % 60) * 1000)) / 1000}` //Converts time to minutes and seconds. Stupid API.
						} else { // If no time is found
							_40lineTime = "No time recorded"
						}










						// Embed Gibberish
						return interaction.reply({
							embeds: [new MessageEmbed()
								.setColor('#fffb42')
								.setTitle(`${json.data.user.username}'s Statistics`)
								.setThumbnail(`https://tetr.io/user-content/avatars/${json.data.user._id}.jpg?rv=${json.data.user._id.avatar_revision}`)
								.addFields(
									{ name: `Rank`, value: `${(json.data.user.league.rank).toUpperCase()} | ${(Math.round(json.data.user.league.percentile * 100))} percentile`, inline: true },
									{ name: 'Total Wins', value: `${json.data.user.gameswon}`, inline: true },
									{ name: '40 Line', value: _40lineTime, inline: true },
									{ name: 'League W/L Ratio', value: `${Math.round((json.data.user.league.gamesplayed / json.data.user.league.gameswon) * 100) / 100}`, inline: true },
									{ name: 'League Wins', value: `${json.data.user.league.gameswon}`, inline: true },
									{ name: 'Gametime', value: simplifedGametime, inline: true },
									{ name: 'Speed', value: `${json.data.user.league.pps} pps (Piece Per Second)`, inline: true },
								)
								.setTimestamp()

							]
						});
					})
			});
	},
};
