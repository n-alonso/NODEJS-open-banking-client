import winston from "winston";
import { Logger } from "../../libs/logger";

export class OpenBankingDataSource {
    private readonly logger: winston.Logger;
    private readonly client_id;
    private readonly client_secret;

    private readonly AUTH_URL =
        "https://auth.truelayer-sandbox.com/?response_type=code&client_id=sandbox-tsapp-9b4b6d&scope=info%20accounts%20balance%20transactions&redirect_uri=http://localhost:9876/accounts/sync/callback&providers=uk-cs-mock%20uk-ob-all%20uk-oauth-all";

    public constructor() {
        this.logger = new Logger(OpenBankingDataSource.name).getLogger();

        if (!process.env.TL_CLIENT_ID || !process.env.TL_CLIENT_SECRET) {
            this.logger.error("Client_id or client_secret missing");
        }

        this.client_id = process.env.TL_CLIENT_ID;
        this.client_secret = process.env.TL_CLIENT_SECRET;
    }

    public getAuthUrl() {
        return this.AUTH_URL;
    }

    public getCredentials() {
        return {
            client_id: this.client_id,
            client_secret: this.client_secret,
        };
    }
}
