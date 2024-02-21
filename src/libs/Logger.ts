import winston from "winston";

export class Logger {
    private logger: winston.Logger;

    public constructor(serviceName: string) {
        // TODO: Return env-based Logger based on LoggerConfig.ts
        this.logger = winston.createLogger({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
                winston.format.errors({ stack: true }),
                winston.format.colorize(),
                winston.format.printf((info) => {
                    let logMessage = `${info.timestamp} [${info.level} @ ${info.service}]: ${info.message}`;
                    if (info.stack) {
                        logMessage += `\nStack Trace: ${info.stack}`;
                    }
                    return logMessage;
                }),
            ),
            defaultMeta: { service: serviceName },
            transports: [
                new winston.transports.Console({
                    level: "info",
                }),
                new winston.transports.File({
                    level: "error",
                    filename: "logs/error.log",
                    format: winston.format.uncolorize(),
                }),
            ],
        });
    }

    public getLogger() {
        return this.logger;
    }
}
