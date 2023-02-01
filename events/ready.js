const { Events } = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const Chars = sequelize.define('chars', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	month: Sequelize.NUMBER,
	day: Sequelize.NUMBER,
});

module.exports = {
	Chars: Chars,
	name: Events.ClientReady,
	once: true,
	execute(client) {
		Chars.sync();
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},

};