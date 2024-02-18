import {Collection, EmojiIdentifierResolvable, Message, MessageReaction, ReactionCollector, User} from "discord.js";

/**
 * Attaches a reaction with a reaction collector to a specific message.
 * @param reactMsg The message to attach the reaction to.
 * @param reactionUserIds The list of userIds that can activate the effect of the reaction.
 * An empty list allows any author to activate the reaction. Will not be used if a custom filter is provided.
 * @param reactionsList The reactions to attach the message.
 * @param executeCallback A callback function for when any reaction is clicked.
 * @param endCallback Optional - A callback for when the reaction collector expires. If none then it will remove all reactions on the reactMsg.
 * @param filter Optional - A filter for the reactionCollector. If none is provided then it only allows the reactionUserIds to activate the reaction.
 * @param filterTime Optional - The duration in milliseconds for which the reactionCollector is in effect.
 */
export async function attachReactionsToMessage(
    reactMsg: Message,
    reactionUserIds: string[],
    reactionsList: EmojiIdentifierResolvable[],
    executeCallback: (reaction: MessageReaction, user: User, collector: ReactionCollector) => void,
    endCallback?: (collected: Collection<string, MessageReaction>, reason: string) => void,
    filter?: (reaction: MessageReaction, user: User) => boolean,
    filterTime = 30000
): Promise<ReactionCollector> {
    if (!endCallback) {
        endCallback = async () => {
            await reactMsg.reactions.removeAll();
        };
    }
    if (!filter) {
        filter = (reaction: MessageReaction, user: User) => {
            if (!reactionUserIds.length) return true;
            return !!(
                reactionUserIds.filter((id) => id === user.id).length &&
                reactionsList.includes(reaction.emoji.name!)
            );
        };
    }
    const collector = reactMsg.createReactionCollector({ filter, time: filterTime, dispose: true });
    collector.on('collect', (reaction, user) => executeCallback(reaction, user, collector));
    collector.on('end', endCallback);
    for (const r of reactionsList) {
        await reactMsg.react(r);
    }
    return collector;
}