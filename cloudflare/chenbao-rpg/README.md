# 雾灯归途 · 手游入口

- 自定义域名：https://rpg.chenbao.fun/
- GitHub Pages：https://qingyu24.github.io/web/mist-lantern/
- 统一项目入口：https://web.chenbao.fun/mist-lantern/
- 手游源码：https://github.com/qingyu24/wx_game

静态产物由 `qingyu24/web` 的 Pages 流水线发布。Cloudflare Worker `chenbao-rpg` 将域名根路径映射到同一份 `/web/mist-lantern/` 内容，流式转发 GET/HEAD，不转发 Cookie/Authorization 或返回 Set-Cookie。不使用单独的资源副本。HTML、安装清单和 Service Worker 使用 no-cache，以便更新检查；离线缓存仍由游戏管理。

`deployment.json` 记录连接 API 部署的参数，不包含凭证。修改 Worker 后通过 Cloudflare 连接发布同名服务，保留自定义域名。现有 game.chenbao.fun 属于其他项目，保持原样。

更新游戏：在 wx_game 运行 npm run build:offline，将 dist 内容同步到 public/mist-lantern/，更新项目卡片最近更新日期，提交 main，确认 Pages 流水线和域名访问。2026-11-06 首次加入公共项目目录。
