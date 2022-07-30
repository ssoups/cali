const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Permissions } = require('discord.js');

module.exports = {
	// Slash Command Gibberish
	data: new SlashCommandBuilder()
		.setName('commands')
		.setDescription('Replies with list of commands!'),
	async execute(interaction) {
		console.log(interaction)
		
		await interaction.reply({
			//Embed Gibberish
			embeds: [new MessageEmbed()
				.setColor('#fffb42')
				.setTitle(`Commands`)
				.addFields(
					{ name: '/randomosu', value: 'Returns a random osu beatmap.', inline: true },
					{ name: '/osuadd [link]', value: 'Adds osu map to database.', inline: true },
					{ name: '/tetriostats [username]', value: 'Returns tetr.io stats.', inline: true },
					
				)
				.setTimestamp()
			]
		});
	},
};