import { Client, Intents, TextChannel } from 'discord.js';
import { play, skip, stop, help } from './handlers/commandHandler.js';
import { isCringe } from './handlers/cringeHandler.js';
import logger from './handlers/logHandler.js';
import Bot from './Bot.js';
import { MessageAttachment } from 'discord.js';
import {
    downloadAttachment,
    isAuthorTracked,
    isChannelTracked,
} from './handlers/attachmentHandler.js';
import Env from './Env.js';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
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

        if (
            message.channel instanceof TextChannel &&
            isChannelTracked(message.channelId) &&
            isAuthorTracked(message.author.id) &&
            message.attachments.size > 0
        ) {
            let error = false;
            message.attachments.map(
                (attachment: MessageAttachment, key: string) => {
                    logger.info(
                        `${message.guildId} - ${message.author.id}: Downloading attachment ${key}`
                    );

                    try {
                        downloadAttachment(
                            message.channelId,
                            message.author.id,
                            attachment
                        );
                    } catch (e: any) {
                        error = true;
                        logger.error(e);
                    }
                }
            );

            if (!error) {
                message.react('💾');
            }
        }
    } catch (e: any) {
        logger.error(e);
    }
});

client.login(Env.getInstance().getToken());
