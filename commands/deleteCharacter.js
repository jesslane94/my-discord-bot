const { SlashCommandBuilder } = require('discord.js');
const Chars = require('../events/ready.js').Chars;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletecharacters')
		.setDescription('deletes requested character from database.')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('the users inputted search term.')
				.setRequired(true)),
	async execute(interaction) {
		const input = interaction.options.getString('input');
		await Chars.destroy({
			where: {
				name: input,
			},
		});
		return interaction.reply('Table deleted');
	},
};