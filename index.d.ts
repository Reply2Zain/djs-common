import {ILogger} from "./dist/main/interfaces/ILogger";
import {EmbedBuilderLocal} from "./dist/main/utils/EmbedBuilderLocal";
import {MessageEventCore} from "./dist/main/utils/types";
import {CommandHandler} from "./dist/main/handlers/CommandHandler";
import {EventHandler} from "./dist/main/handlers/EventHandler";
import {attachReactionsToMessage} from "./dist/main/utils/utils";

declare namespace djsCommon {
    export {ILogger, EmbedBuilderLocal, CommandHandler, MessageEventCore, EventHandler, attachReactionsToMessage};
}


export = djsCommon;
