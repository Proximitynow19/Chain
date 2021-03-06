//
// Copyright [2020] [Jakob de Guzman]
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

const fetch = require("node-fetch");
const { RichEmbed } = require("discord.js");

module.exports = {
  name: "reddit",
  aliases: ["subreddit"],
  usage: "<subreddit>",
  description: "Grabs a random post from the specified subreddit.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    fetch(
      `https://api.ksoft.si/images/rand-reddit/${args[0]}?remove_nsfw=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${require("../secret.json").ksoftapi}`,
        },
      }
    ).then((res) => {
      res.json().then((memestuff) => {
        if (!memestuff.title) {
          const embed = new RichEmbed()
            .setTitle("Error")
            .setDescription("Unable to find post.")
            .setColor(client.warning)
            .setFooter(
              `Executed by ${message.author.tag}`,
              message.author.avatarURL
            )
            .setTimestamp(message.createdTimestamp);
          message.channel.send(embed);
          return;
        }

        const embed = new RichEmbed()
          .setTitle(memestuff.title)
          .setAuthor(
            "Posts provided by KSoft",
            "https://cdn.ksoft.si/images/Logo128.png",
            "https://api.ksoft.si/"
          )
          .setDescription(
            `[**${memestuff.subreddit}** by ${memestuff.author}](${memestuff.source})`
          )
          .setImage(memestuff.image_url)
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .addField("Upvotes", `\`${memestuff.upvotes}\``, true)
          .addField("Downvotes", `\`${memestuff.downvotes}\``, true)
          .setColor(client.other)
          .setTimestamp(message.createdTimestamp);

        message.channel.send(embed);
      });
    });
  },
};
