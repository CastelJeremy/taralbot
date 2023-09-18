import { Message, MessageAttachment } from 'discord.js';
import logger from './logHandler.js';
import fs from 'fs';
import Env from '../Env.js';
import { DateTime } from 'luxon';
import { numberToEmoji } from './emojiHandler.js';

const MINECRAFT_SCREENSHOT_REGEX =
    /^[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}\.[0-9]{2}\.[0-9]{2}.*$/;

export function isChannelTracked(channelId: string) {
    return Env.getInstance().getTrackedChannels().has(channelId);
}

export function isAuthorTracked(authorId: string) {
    return Env.getInstance().getTrackedUsers().has(authorId);
}

function parseFilename(originalFilename: string, username: string) {
    let fileDate = DateTime.now();
    if (MINECRAFT_SCREENSHOT_REGEX.test(originalFilename)) {
        fileDate = DateTime.fromFormat(
            originalFilename.substring(0, 19),
            'yyyy-LL-dd_HH.mm.ss'
        );
    }

    let newFilename = fileDate.toFormat('yyyyLLdd_HHmmss');
    newFilename += '_' + Math.random().toString(16).slice(2).substring(0, 8);
    newFilename += '_' + username;

    return newFilename;
}

function resolveMimeType(mimeType: string) {
    if (mimeType.startsWith('image/gif')) {
        return 'gif';
    } else if (mimeType.startsWith('image/jpeg')) {
        return 'jpg';
    } else if (mimeType.startsWith('image/png')) {
        return 'png';
    } else if (mimeType.startsWith('image/svg+xml')) {
        return 'svg';
    } else if (mimeType.startsWith('image/webp')) {
        return 'webp';
    }

    throw new Error('MIME type not supproted');
}

export function downloadAttachment(
    channelId: string,
    authorId: string,
    attachment: MessageAttachment
) {
    const channelAttachmentDirectory = Env.getInstance()
        .getTrackedChannels()
        .get(channelId);
    const username = Env.getInstance().getTrackedUsers().get(authorId);

    if (!channelAttachmentDirectory) {
        throw new Error('Missing tracked channel attachment directory');
    }

    if (!username) {
        throw new Error('Missing tracked user username');
    }

    if (!attachment.contentType) {
        throw new Error('Could not determine attachment Content-Type');
    }

    if (!attachment.name) {
        throw new Error('Could not determine attachment Name');
    }

    const filePath =
        channelAttachmentDirectory +
        parseFilename(attachment.name, username) +
        '.' +
        resolveMimeType(attachment.contentType);

    return fetch(attachment.url)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
            fs.writeFileSync(filePath, Buffer.from(buffer));
            logger.info(`Downloaded attachment ${attachment.id}`);
        });
}

export async function downloadMessageAttachments(message: Message) {
    let error = false;
    let successCount = 0;

    await Promise.all(
        message.attachments.map(
            async (attachment: MessageAttachment, key: string) => {
                logger.info(
                    `${message.guildId} - ${message.author.id}: Downloading attachment ${key}`
                );

                try {
                    await downloadAttachment(
                        message.channelId,
                        message.author.id,
                        attachment
                    );

                    successCount++;
                } catch (e: any) {
                    error = true;
                    logger.error(e);
                }
            }
        )
    );

    message.react(numberToEmoji(successCount));
    if (error) {
        message.react('❌');
    } else {
        message.react('💾');
    }
}
