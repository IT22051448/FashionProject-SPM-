import pino from "pino";
import caller from "pino-caller"

const logger = caller(pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
}));

export default logger;
