import { Client, Intents } from 'discord.js';
import { play, skip, stop, help } from './handlers/commandHandler.js';
import { isCringe } from './handlers/cringeHandler.js';
import logger from './handlers/logHandler.js';
import Bot from './Bot.js';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});
const instances = new Map();

logger.info('Starting...');

client.once('ready', async (client) => {
    logger.info(`Logged in as ${client.user.tag}`);

    const guilds = await client.guilds.fetch();

    guilds.forEach((value, key) => {
        instances.set(key, new Bot(key));
    });
});

client.on('messageCreate', async (message) => {
    try {
        const instance = instances.get(message.guildId);
        if (message.content.startsWith('!tbk') && instance) {
            const cmd = message.content.split(' ')[1];
            logger.info(
                `${message.guildId} - ${message.author.id}: ${message.content}`
            );

            switch (cmd) {
                case 'play':
                    await play(instance, message);
                    break;
                case 'skip':
                    skip(instance);
                    break;
                case 'stop':
                    stop(instance);
                    break;
                case 'help':
                    help(message);
                    break;
                default:
            }
        }

        if (isCringe(message.content)) {
            message.reply(
                'Ce message à été jugé comme "CRINGE" par mon IA :saluting_face:'
            );
        }
    } catch (e: any) {
        logger.error(e);
    }
});

client.login(process.env.TOKEN);
