# web.chenbao.fun · 项目首页域名

- 公开首页：https://web.chenbao.fun/
- 晚间课表：https://web.chenbao.fun/english-garden/
- 源站：https://qingyu24.github.io/web/

Cloudflare Worker `chenbao-web-home` 绑定自定义域名 `web.chenbao.fun`，将域名根路径映射到现有GitHub Pages的 `/web/`。因此后续 `public/<project>/` 自动发布后，也能通过本域名的 `/<project>/` 访问，无需每次修改域名配置。

原GitHub Pages网址继续可用。日历原订阅URL继续保留，不需要重新订阅；也可通过本域名的 `/english-garden/family-plan.ics` 访问同一份文件。

Worker仅允许GET/HEAD，流式转发公开页面；不转发Cookie和Authorization；站内重定向保持自定义域名。源码和声明配置保存在此目录；Cloudflare连接用于实际部署，没有在仓库保存密钥。

2026-10-20：域名绑定创建成功，已验证自定义域名下的课表HTTPS返回200。
