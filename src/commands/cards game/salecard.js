const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'salecard',
    aliases: ['sellcard'],
    category: 'cardgame', // Adjust category as needed
    react: "✅",
    description: 'Sell a card from your collection',
    usage: '<card_name> <price>',
    async execute(client, arg, M) {
        // Check if the command has correct arguments
        if (arg.length < 2) {
            return M.reply('Please provide the card name and price to sell. Usage: `salecard <card_name> <price>`');
        }

        const cardName = arg[0];
        const price = parseInt(arg[1]);

        // Check if price is a valid number
        if (isNaN(price) || price <= 0) {
            return M.reply('Please provide a valid price greater than 0.');
        }

        // Example: Assuming 'cards' is a collection in your client to manage user cards
        const userCards = await client.cards.get(`${M.sender}.cards`);

        // Check if the user has the card
        if (!userCards || !userCards.includes(cardName)) {
            return M.reply(`You don't have a card named "${cardName}" to sell.`);
        }

        // Remove the card from user's collection
        const updatedCards = userCards.filter(card => card !== cardName);
        await client.cards.set(`${M.sender}.cards`, updatedCards);

        // Add money to user's wallet
        await client.credit.add(`${M.sender}.wallet`, price);

        // Construct and send confirmation message
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Card Sold!')
            .setDescription(`You have successfully sold **${cardName}** for 💵 ${price} coins.`);

        M.channel.send(embed);
    }
};
