class Env {
    private static instance: Env;
    private token!: string;

    private constructor() {
        if (!process.env.TOKEN) {
            throw new Error('Missing environment variable TOKEN');
        }

        this.token = process.env.TOKEN;
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
}

export default Env;
