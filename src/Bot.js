import {
    AudioPlayerStatus,
    createAudioPlayer,
    joinVoiceChannel,
    VoiceConnectionStatus,
} from '@discordjs/voice';
import logger from './handlers/logHandler.js';

function Bot() {
    this.connection = null;
    this.player = null;
    this.idling = null;
    this.queue = [];
}

Bot.prototype.onIdle = function () {
    logger.info(`${this.connection.joinConfig.guildId} - Idling`);

    if (this.queue.length > 0) {
        this.play(this.queue.shift());
    } else {
        clearTimeout(this.idling);
        this.idling = setTimeout(
            this.leaveVoiceChannel.bind(this),
            2 * 60 * 1000
        );
    }
};

Bot.prototype.onDisconnect = function () {
    this.player = null;

    if (this.connection) {
        this.connection.destroy();
    }

    this.connection = null;
};

Bot.prototype.joinVoiceChannel = function (
    channelId,
    guildId,
    voiceAdapterCreator
) {
    logger.info(`${guildId} - Joining ${guildId}`);

    if (!this.player) {
        this.player = createAudioPlayer();
        this.player.on(AudioPlayerStatus.Idle, this.onIdle.bind(this));
    }

    this.connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: voiceAdapterCreator,
    });

    this.connection.subscribe(this.player);

    this.connection.on(
        VoiceConnectionStatus.Disconnected,
        this.onDisconnect.bind(this)
    );
    this.connection.on(
        VoiceConnectionStatus.Destroy,
        this.onDisconnect.bind(this)
    );
};

Bot.prototype.play = function (resource) {
    if (this.player) {
        if (this.player.state.status === AudioPlayerStatus.Idle) {
            logger.info(`${this.connection.joinConfig.guildId} - Playing`);
            this.player.play(resource);
        } else {
            logger.info(`${this.connection.joinConfig.guildId} - Enqueuing`);
            this.queue.push(resource);
        }
    }

    clearTimeout(this.idling);
};

Bot.prototype.stop = function () {
    logger.info(`${this.connection.joinConfig.guildId} - Stopping`);

    if (this.player) {
        this.player.stop();
    }
};

Bot.prototype.clear = function () {
    logger.info(`${this.connection.joinConfig.guildId} - Clearing`);

    if (this.queue.length > 0) {
        this.queue = [];
    }
};

Bot.prototype.leaveVoiceChannel = function () {
    logger.info(
        `${this.connection.joinConfig.guildId} - Leaving ${this.connection.joinConfig.channelId}`
    );

    this.connection.disconnect();
};

export default Bot;
