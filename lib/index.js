"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.Config = exports.name = void 0;
const koishi_1 = require("koishi");
exports.name = 'dailygames';
exports.Config = koishi_1.Schema.object({});
const axios = require('axios');

function apply(ctx) {
   ctx.command('发售', "近期即将发售的游戏")
  .action(async ({ options }) => {
    let success = false;
    let data;
    let error;
    for (let i = 0; i < 3; i++) {
      try {
        const response = await axios.get('http://app02.vgtime.com:8080/vgtime-app/api/v3/launch/wallpaper_today');
        data = response.data.data;
        success = true;
        break;
      } catch (err) {
        error = err;
      }
    }

    if (success) {
      const games = data.will_be_onsale_games.list.map((game) => {
        return `\n\n游戏名：${game.title}\n发售日期：${game.publish_date}\n登陆平台：${game.platforms}\n简介：${game.recommend}`;
      });
      return games.join('');
    } else {
      return `请求失败：${error.message}`;
    }
  });




  ctx.command('daily', "查看游戏今昔史")
    .action(async ({ options }) => {
      let success = false;
      let data;
      let error;
      for (let i = 0; i < 3; i++) {
        try {
          const response = await axios.get('http://app02.vgtime.com:8080/vgtime-app/api/v3/launch/wallpaper_today');
          data = response.data.data;
          success = true;
          break;
        } catch (err) {
          error = err;
        }
      }

      if (success) {
        const date = new Date().toLocaleDateString('zh-CN', {
          month: 'long',
          day: 'numeric'
        });
        const history = data.user_sign.history_in_today.toString();
        const pictureUrl = decodeURIComponent(data.wallpaper.picture);
        const imageData = await ctx.http.get(pictureUrl, { responseType: 'arraybuffer' });
        return `历史上的 ${date}\n${history.replace(/<br\/>/g, '\n').replace(/^<br>/, '')}${koishi_1.segment.image(imageData)}`;
      } else {
        return `请求失败：${error.message}`;
      }
    });
}

exports.apply = apply;
