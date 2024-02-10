const YT = require('../../lib/YT')
const yts = require("youtube-yts");

module.exports = {
    name: 'video',
    aliases: ['video'],
    category: 'proUsers',
    description: 'Downloads given YT Video',
    react: "✅",
    async execute(client, arg, M) {
           const archer = (await client.DB.get('archer')) || []
   if (!archer.includes(M.from)) return M.reply(` *🟥 Bot is not enabled in current group ask mods to activate* `)

        const link = async (term) => {
            const { videos } = await yts(term.trim())
            if (!videos || !videos.length) return null
            return videos[0].url
        }
        if (!arg) return M.reply('🟥 *Please use this command with a valid youtube.com link*')
        const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/
        const term = validPathDomains.test(arg) ? arg.trim() : await link(arg)
        if (!term) return M.reply('🟥 *Please use this command with a valid youtube contant link*')
        if (!YT.validateURL(term.trim())) return M.reply('🟥 *Please use this command with a valid youtube.com link*')
        const { videoDetails } = await YT.getInfo(term)
        if (Number(videoDetails.lengthSeconds) > 1800) return M.reply('Cannot download audio longer than 30 minutes')
        const audio = YT.getBuffer(term, 'audio')
            .then(async (res) => {
 await client.sendMessage(M.from, { 
         document: res,
        fileName: videoDetails.title + '.mp4',
        mimetype: 'video/mp4',
       contextInfo:{
        externalAdReply:{
       Title: 'videoDetails.title',
       body: '📽️ < V I D E O > 📽️',
      thumbnail:  await client.utils.getBuffer(`https://i.ytimg.com/vi/${videoDetails.videoId}/maxresdefault.jpg`),
      mediaType:2,
          }
       }
    })
  })

 .catch((err) => {
return M.reply(err.toString())
client.log(err, 'red')
            })
    }
}
//M.quoted.mtype === 'imageMessage',
