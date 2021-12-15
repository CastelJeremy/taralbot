import { readFile } from 'fs/promises';
import { Client, Intents } from 'discord.js';
import { play, stop, help } from './commandHandler.js';
import logger from './logHandler.js';
import Bot from './Bot.js';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const instances = {};

logger.info('Starting...');

client.once('ready', async () => {
	logger.info(`Logged in as ${client.user.tag}`);

	const guilds = await client.guilds.fetch();

	guilds.forEach((value, key) => {
		instances[key] = new Bot();
	})
});

client.on('messageCreate', async (message) => {
	try {
		if (message.content.startsWith('!tbk')) {
			const cmd = message.content.split(' ')[1];
			logger.info(`${message.guildId} - ${message.author.id}: ${message.content}`);

			switch (cmd) {
				case 'play':
					await play(instances[message.guildId], message);
					break;
				case 'stop':
					stop(instances[message.guildId]);
					break;
				case 'help':
					help(message);
					break;
				default:
			}
		}
	} catch(e) {
		logger.error(e);
	}
});

readFile(new URL('./config.json', import.meta.url))
	.then((content) => {
		try {
			const conf = JSON.parse(content);

			if (conf.token) {
				client.login(conf.token);
			} else {
				throw 'Missing Token.';
			}
		} catch (e) {
			if (e instanceof SyntaxError)
				logger.error('Invalid Configuration File.');
			else
				logger.error(e);
		}
	});

