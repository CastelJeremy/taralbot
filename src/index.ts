import { Client, Intents, TextChannel } from 'discord.js';
import { play, skip, stop, help } from './handlers/commandHandler.js';
import { isCringe } from './handlers/cringeHandler.js';
import logger from './handlers/logHandler.js';
import Bot from './Bot.js';
import {
    downloadMessageAttachments,
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

    if (Env.getInstance().getCheckAttachmentOnstart()) {
        guilds.forEach(async (value, key) => {
            const guild = await value.fetch();
            const channels = await guild.channels.fetch();

            channels.forEach(async (channel) => {
                if (
                    channel &&
                    Env.getInstance().getTrackedChannels().has(channel.id) &&
                    channel.isText()
                ) {
                    logger.info(`Parsing channel ${guild.id} - ${channel.id}`);
                    let lastMessage;
                    let messages;

                    do {
                        messages = await channel.messages.fetch({
                            limit: 100,
                            before: lastMessage,
                        });
                        lastMessage = messages.last()?.id;

                        const filteredMessages = messages.filter(
                            (message) => message.attachments.size > 0
                        );

                        filteredMessages.forEach((message) => {
                            const reaction = message.reactions.resolve('💾');

                            if (!reaction || !reaction.me) {
                                downloadMessageAttachments(message);
                            }
                        });
                    } while (messages.size == 100 && lastMessage);

                    logger.info(`Finished parsing ${guild.id} - ${channel.id}`);
                }
            });
        });
    }
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
            await downloadMessageAttachments(message);
        }
    } catch (e: any) {
        logger.error(e);
    }
});

client.login(Env.getInstance().getToken());
