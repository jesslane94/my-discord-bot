const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('searchcharacter')
		.setDescription('searches for a characters birthday.')
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
				year
				month
				day
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

		function handleData(data) {
			console.log(data);
			return interaction.reply(JSON.stringify(data));
		}

		function handleError(error) {
			console.error(error);
		}

	} };
