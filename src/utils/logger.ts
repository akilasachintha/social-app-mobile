type LogEntry = {
    level: 'error' | 'warning' | 'info' | 'success';
    message: string;
    file?: string;
    method?: string;
    data?: object | unknown | string | number | boolean | null;
    timestamp?: string;
};

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    fg: {
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
    }
};

const colorForLevel = (level: string): string => {
    switch (level) {
        case 'error':
            return colors.fg.red;
        case 'warning':
            return colors.fg.yellow;
        case 'info':
            return colors.fg.blue;
        case 'success':
            return colors.fg.green;
        default:
            return colors.reset;
    }
};

const createLogMessage = ({level, message, file, method, data}: LogEntry): string => {
    const color = colorForLevel(level);
    const timestamp = new Date().toISOString();
    const baseMsg = `${color}[${timestamp}] [${level.toUpperCase()}] ${file ? `[${file}${method ? ` - ${method}` : ''}]:` : ''} ${message}`;
    return data ? `${baseMsg} - Data: ${JSON.stringify(data)}` : baseMsg;
};

const logger = {
    log: (entry: LogEntry) => {
        const logMessage = createLogMessage(entry);
        console.log(logMessage);
    },
};

export default logger;
