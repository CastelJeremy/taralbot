import {
    AudioPlayer,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    DiscordGatewayAdapterCreator,
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus,
} from '@discordjs/voice';
import logger from './handlers/logHandler.js';

class Bot {
    guildId: string;
    connection: VoiceConnection | null;
    player: AudioPlayer | null;
    idling: NodeJS.Timeout | null;
    queue: Array<AudioResource>;

    constructor(guildId: string) {
        this.guildId = guildId;
        this.connection = null;
        this.player = null;
        this.idling = null;
        this.queue = [];
    }

    private onIdle() {
        logger.info(`${this.guildId} - Idling`);

        const resource = this.queue.shift();
        if (resource) {
            this.play(resource);
        } else if (this.idling) {
            clearTimeout(this.idling);
        } else {
            this.idling = setTimeout(
                this.leaveVoiceChannel.bind(this),
                2 * 60 * 1000
            );
        }
    }

    private onDisconnect() {
        this.player = null;

        if (
            this.connection &&
            this.connection.state.status !== VoiceConnectionStatus.Destroyed
        ) {
            this.connection.destroy();
        }

        this.connection = null;
    }

    joinVoiceChannel(
        channelId: string,
        voiceAdapterCreator: DiscordGatewayAdapterCreator
    ) {
        logger.info(`${this.guildId} - Joining ${channelId}`);

        if (!this.player) {
            this.player = createAudioPlayer();
            this.player.on(AudioPlayerStatus.Idle, this.onIdle.bind(this));
        }

        this.connection = joinVoiceChannel({
            channelId: channelId,
            guildId: this.guildId,
            adapterCreator: voiceAdapterCreator,
        });

        this.connection.subscribe(this.player);

        this.connection.on(
            VoiceConnectionStatus.Disconnected,
            this.onDisconnect.bind(this)
        );
        this.connection.on(
            VoiceConnectionStatus.Destroyed,
            this.onDisconnect.bind(this)
        );
    }

    leaveVoiceChannel() {
        if (this.connection) {
            logger.info(
                `${this.guildId} - Leaving ${this.connection.joinConfig.channelId}`
            );

            this.connection.disconnect();
        }
    }

    play(resource: AudioResource) {
        if (this.player) {
            if (this.player.state.status === AudioPlayerStatus.Idle) {
                logger.info(`${this.guildId} - Playing`);
                this.player.play(resource);
            } else {
                logger.info(`${this.guildId} - Enqueuing`);
                this.queue.push(resource);
            }
        }

        if (this.idling) {
            clearTimeout(this.idling);
        }
    }

    stop() {
        logger.info(`${this.guildId} - Stopping`);

        if (this.player) {
            this.player.stop();
        }
    }

    clear() {
        logger.info(`${this.guildId} - Clearing`);

        if (this.queue.length > 0) {
            this.queue = [];
        }
    }
}

export default Bot;
