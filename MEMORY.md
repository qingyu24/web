# 公开项目与发布记忆

更新：2026-10-20。本文件仅保存公开架构与维护约定，不保存家庭档案。

## 统一项目入口

- 仓库：qingyu24/web，公开，默认分支main。
- 网页目录：public/；一个项目一个文件夹。首页public/index.html展示项目卡片，未来新增项目继续沿用。
- 项目卡片有“创建”“最近更新”两个日期，以及data-created/data-updated和语义time元素，格式YYYY-MM-DD。按创建时间从新到旧维护。
- 当前英语花园创建于2026-10-20。不要随着每次修改重新定义创建日期。

## 生产地址

- 自定义域名项目首页：https://web.chenbao.fun/
- 当前课表：https://web.chenbao.fun/english-garden/
- GitHub源站：https://qingyu24.github.io/web/
- 原GitHub URL继续可用；自定义域名是新增入口，不要求迁移旧订阅。

## 发布与域名架构

- .github/workflows/pages.yml自动发布main中public/的变化；README、协作规范和网关源码变化不会自动重发静态站点。
- Cloudflare Worker：chenbao-web-home。
- 网关源码：cloudflare/chenbao-web-home/worker.mjs；配置：同目录wrangler.jsonc；说明：同目录README.md。
- 自定义域名web.chenbao.fun绑定该Worker。根路径映射到GitHub Pages的/web/，其他路径映射到/web/<path>。因此新增public/<project>/发布后自动具备/<project>/自定义域名入口。
- 网关只允许GET/HEAD，流式转发公开页面；不转发Cookie/Authorization，不传回Set-Cookie；站内重定向改回自定义域名。
- 当前不需要GitHub Pages CNAME文件；不要仅改DNS去直连github.io而破坏既有网关映射。
- 现有其他Worker和DNS记录保持原样。凭证通过连接或安全环境提供，不存仓库。

## 英语花园实现

- public/english-garden/index.html与week.html是同一张晚间作息表，带打印/另存PDF按钮。
- library.html是精简资源记录，calendar.html是订阅说明；旧roadmap.html/games.html入口转回作息表。
- app.js只负责打印入口；style.css同时维护移动端和一页A4纵向打印样式。plan.json保留当前课表数据，inventory.json保存公开资源状态。
- 用户偏好简单可执行的一张表，不重新添加复杂模块。打印、网页和日历用词要一致。

## 日历订阅

- 固定源地址：https://qingyu24.github.io/web/english-garden/family-plan.ics
- 新域名也可访问：https://web.chenbao.fun/english-garden/family-plan.ics
- 六个每周重复的全天VEVENT，周日不安排，具体钟点列在描述。保持既有UID、DTSTART/DTEND及RRULE，正常更新增加SEQUENCE、更新DTSTAMP。
- 原订阅者无需更换地址；Outlook刷新可能延迟。文件导入是快照，不能作为自动更新的订阅来介绍。
- 不在公开ICS存储家庭账号或私人行程，不声称已代用户完成账号订阅或邀请家人。
