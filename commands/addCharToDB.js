const { SlashCommandBuilder } = require('discord.js');
const Chars = require('../events/ready.js').Chars;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addcharacter')
		.setDescription('adds Character Info to Database.')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('the users inputted search term.')
				.setRequired(true)),
	async execute(interaction) {
		const query = `
		query ($name: String) { 
			Character (search: $name) { 
			  id
			  name {
				full
			  }
			  dateOfBirth {
				month
				day
			  }
			  age
			  siteUrl
			  image {
				medium
			  }
			}
		  }
		  `;

		const input = interaction.options.getString('input');
		const variables = {
			name: input,
		};
		const url = 'https://graphql.anilist.co',
			options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify({
					query: query,
					variables: variables,
				}),
			};

		// Make the HTTP Api request
		fetch(url, options).then(handleResponse)
			.then(handleData)
			.catch(handleError);

		function handleResponse(response) {
			return response.json()
				.then(function(json) {
					return response.ok ? json : Promise.reject(json);
				});
		}

		async function handleData(data) {
			const newData = JSON.stringify(data);
			const myJSON = JSON.parse(newData);

			const charName = myJSON.data.Character.name.full ?? 'N/A';
			const charMonth = myJSON.data.Character.dateOfBirth.month ?? 'N/A';
			const charDay = myJSON.data.Character.dateOfBirth.day ?? 'N/A';

			try {
				// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
				console.log(Chars);
				const char = await Chars.create({
					name: charName,
					month: charMonth,
					day: charDay,
				});
				return interaction.reply(`Character ${char.name} added to database.`);
			}
			catch (error) {
				if (error.name === 'SequelizeUniqueConstraintError') {
					return interaction.reply('That tag already exists.');
				}
				console.log(error);
				return interaction.reply('Something went wrong with adding a tag.');
			}
		}

		function handleError(error) {
			console.error(error);
		}
	},
};