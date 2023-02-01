const { SlashCommandBuilder } = require('discord.js');
const Chars = require('../events/ready.js').Chars;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('viewcharacters')
		.setDescription('shows what characters have been added to the database.'),
	async execute(interaction) {
		const chars = await Chars.findAll();
		const newData = JSON.stringify(chars);
		const myJSON = JSON.parse(newData);
		const message = [];
		myJSON.forEach(thing => {
			if (thing.name === null) {
				message.push('N/A');
			}
			else {
				message.push(thing.name);
			}
		});

		return interaction.reply(JSON.stringify(message));
	},
};