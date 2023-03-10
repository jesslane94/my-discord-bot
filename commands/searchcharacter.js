const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

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

		function handleData(data) {
			const newData = JSON.stringify(data);
			const myJSON = JSON.parse(newData);

			const embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle(myJSON.data.Character.name.full)
				.setURL(myJSON.data.Character.siteUrl)
				.setThumbnail(myJSON.data.Character.image.medium)
				.addFields(
					{ name: 'Date of Birth', value: `Month: ${myJSON.data.Character.dateOfBirth.month ?? 'N/A' }\nDay: ${myJSON.data.Character.dateOfBirth.day ?? 'N/A'}` },
					{ name: 'Age', value: myJSON.data.Character.age ?? 'N/A' },
					{ name: 'If you would like to add this character to the database, please input the character through the addCharToDB command!' },
				)
				.setTimestamp();

			return interaction.reply({ embeds: [embed] });
		}

		function handleError(error) {
			console.error(error);
		}

	} };
