import fs from 'fs';

class Env {
    private static instance: Env;
    private token!: string;
    private trackedChannels: Map<string, string>;
    private trackedUsers: Map<string, string>;

    private constructor() {
        if (!process.env.TOKEN) {
            throw new Error('Missing environment variable TOKEN');
        }

        if (!process.env.TRACKED_CHANNELS) {
            throw new Error('Missing environment variable TRACKED_CHANNELS');
        }

        if (!process.env.TRACKED_USERS) {
            throw new Error('Missing environment variable TRACKED_USERS');
        }

        this.token = process.env.TOKEN;
        this.trackedChannels = new Map();
        Object.entries(JSON.parse(process.env.TRACKED_CHANNELS)).map(
            (value) => {
                const channelId = value[0];
                let channelAttachmentDirectory: any = value[1];

                if (
                    typeof channelAttachmentDirectory == 'string' &&
                    channelAttachmentDirectory.length > 0
                ) {
                    fs.accessSync(
                        channelAttachmentDirectory,
                        fs.constants.R_OK | fs.constants.W_OK
                    );

                    if (!channelAttachmentDirectory.endsWith('/')) {
                        channelAttachmentDirectory += '/';
                    }

                    this.trackedChannels.set(
                        channelId,
                        channelAttachmentDirectory
                    );
                } else {
                    throw new Error('Invalid tracked channel property');
                }
            }
        );

        this.trackedUsers = new Map();
        Object.entries(JSON.parse(process.env.TRACKED_USERS)).map((value) => {
            const userId = value[0];
            const username = value[1];

            if (typeof username == 'string' && username.length > 0) {
                this.trackedUsers.set(userId, username);
            } else {
                throw new Error('Invalid tracked user property');
            }
        });
    }

    static getInstance() {
        if (!Env.instance) {
            Env.instance = new Env();
        }

        return Env.instance;
    }

    getToken() {
        return this.token;
    }

    getTrackedChannels() {
        return this.trackedChannels;
    }

    getTrackedUsers() {
        return this.trackedUsers;
    }
}

export default Env;
