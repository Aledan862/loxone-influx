
class Logger {

    private static debug:boolean = false;

    static log_error(message: string) {
        console.log((new Date().toLocaleString())+' ERROR : '+message);
    }

    static log_info(message: string) {
        console.log((new Date().toLocaleString())+' INFO : '+message);
    }

    static log_debug(message: string) {
        if (Logger.debug){
            console.log((new Date().toLocaleString())+' DEBUG: '+message);
        }
    }

    static setDebug(debug:boolean) {
        Logger.debug = debug;
    }
}

export { Logger }