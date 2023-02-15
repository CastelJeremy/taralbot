import { createAudioResource, demuxProbe } from '@discordjs/voice';
import yt from './ytHandler.js';

async function play(bot, message) {
    if (!message.member.voice.channelId) {
        message.channel.send(
            'Il faut être connecté à un salon vocal pour que je puisse jouer 🐷'
        );
        return;
    }

    if (
        bot.connection &&
        bot.connection.joinConfig.guildId == message.guild.id &&
        bot.connection.joinConfig.channelId != message.member.voice.channel.id
    ) {
        bot.leaveVoiceChannel();
    }

    if (!bot.connection) {
        bot.joinVoiceChannel(
            message.member.voice.channel.id,
            message.guild.id,
            message.guild.voiceAdapterCreator
        );
    }

    try {
        let regexFull = /^https:\/\/www\.youtube\.com\/watch\?v=.+/;
        let regexShort = /^https:\/\/youtu\.be\/.+/;
        let videoUrl = message.content.slice(10);

        if (
            null == regexFull.exec(videoUrl) &&
            null == regexShort.exec(videoUrl)
        ) {
            videoUrl = await yt.searchVideoUrl(videoUrl);
        }

        message.channel.send('Je joue: `' + videoUrl + '`');

        const audio = yt.getAudioStream(videoUrl);
        const { stream, type } = await demuxProbe(audio);
        const resource = createAudioResource(stream, {
            inputType: type,
            inlineVolume: true,
        });

        resource.volume.setVolume(0.3);
        bot.play(resource);
    } catch (e) {
        if (e.message == 'No result for the specified string') {
            message.channel.send('Aucune vidéo trouvée 🐷');
        } else {
            message.channel.send(
                "Oula 🐷, j' ai eu un petit soucis. Tu veux bien réessayer ?"
            );
            throw e;
        }
    }
}

function skip(bot) {
    if (bot.player) {
        bot.stop();
    }
}

function stop(bot) {
    if (bot.player) {
        bot.clear();
        bot.stop();
    }
}

function help(message) {
    message.channel.send(
        "Salut petit animal 🐖,\nMes commandes commencent toujours par un **!tbk** suivi d'un mot clé. Voici la liste des mots clé que tu peux utiliser:\n```\n!tbk play < titre / lien video youtube >\n!tbk skip\n!tbk stop\n!tbk help\n```"
    );
}

export { play, skip, stop, help };
