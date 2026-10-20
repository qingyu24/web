# Web · 公开网页项目

所有可公开访问的项目网页统一放在 public/ 下，每个项目一个独立目录。私有原始资料、个人档案、密钥与构建缓存不放入本仓库。

## 项目

| 项目 | 文件夹 | 预期 Pages 地址（需发布成功后生效） |
| --- | --- | --- |
| 小小英语花园 | [public/english-garden](public/english-garden/) | https://qingyu24.github.io/web/english-garden/ |

## 发布

Settings → Pages → Build and deployment → Source 选择 GitHub Actions。统一工作流只上传 public/，不会把仓库其他目录部署成网页。main 分支的 public/ 更新后自动发布，也可在 Actions 手动运行。

Pages 统一入口预期为 https://qingyu24.github.io/web/，以工作流实际成功的部署记录为准。未配置Pages前，工作流会在配置步骤失败，不代表文件丢失。

## 后续新增项目

1. 新建 public/<project-slug>/，放入 index.html 及该项目自己的资源文件。
2. 使用相对资源路径，避免引用域名根路径导致项目子目录失效。
3. 更新 public/index.html 项目入口与本文件的项目清单。
4. 提交到 main，检查 Actions 发布结果。所有 public/ 项目共同发布，不能让单个项目覆盖 public/ 根目录。

## 当前项目说明

英语花园包含整体安排、一周菜单、游戏和资源建议。勾选和周记仅存当前浏览器，不同步到GitHub或其他设备；公开目录不包含宝宝档案。复制到GitHub Pages后，由于域名变化，R2域名下的浏览器本地记录不会自动迁移。
