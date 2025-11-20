const chalk = require('chalk');

class ErrorHandler {
    static handle(error) {
        console.log(''); // Empty line for spacing

        if (error.message.includes('Invalid configuration')) {
            console.error(chalk.red.bold('❌ Configuration Error'));
            console.error(chalk.red(error.message));
        } else if (error.code === 'ENOENT') {
            console.error(chalk.red.bold('❌ File System Error'));
            console.error(chalk.red(`File or directory not found: ${error.path}`));
        } else {
            console.error(chalk.red.bold('❌ Unexpected Error'));
            console.error(chalk.red(error.message));
            if (process.env.DEBUG) {
                console.error(chalk.gray(error.stack));
            }
        }

        process.exit(1);
    }
}

module.exports = ErrorHandler;
