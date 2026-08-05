# Personal Workbench Skills

Personal AI Workbench 的两个可独立安装 Agent Skills：

- `research-social-insights`：扫描近期 AI 社媒风向，或围绕指定主题研究跨平台讨论、评论、回复、需求与反例。
- `douyin-account-data`：从用户本人已授权登录的抖音创作者中心拉取账号数据，完成质量校验，并生成 Personal AI Workbench 抖音页面读取的完整数据文件。

这两个 Skill 遵循通用的 `SKILL.md` 目录结构，可交给支持 Agent Skills 的工具安装。最简单的安装方式是：

> 把本仓库链接发给你正在使用的 Agent，让它把需要的 Skill 安装到自己的 Skill 目录。

例如：

```text
请从这个仓库安装 research-social-insights 和 douyin-account-data：
<本仓库的 GitHub 链接>
```

不同 Agent 的本地目录和调用方式可能不同，由 Agent 自己完成适配。本仓库只维护一份 Skill 真源，不分别维护 Codex、Claude Code 或其他工具的副本。

## Ego Lite 依赖

两个 Skill 在读取需要登录态的社媒页面时都依赖 [Ego Lite](https://lite.ego.app/download) 提供的 `ego-browser`。其中抖音账号自动采集必须使用该能力。

macOS 安装步骤：

1. 打开 Ego Lite 官方下载页，按机器类型下载 Apple Silicon 或 Intel 版本。
2. 安装并首次启动 Ego Lite。
3. 完成 onboarding。Ego Lite 会安装 `ego-browser` 命令与配套 Skill，并尝试接入本机已有的 Agent 工具。
4. 在 Ego Lite 中登录需要访问的平台。使用抖音 Skill 前，需要先登录本人有权访问的抖音创作者中心。
5. 重新打开 Agent；如果 Agent 仍找不到 `ego-browser`，先确认 Ego Lite onboarding 已完成。

登录态、Cookie、密码、浏览记录和下载的账号数据都不属于本仓库，禁止提交到 Git。

## Windows 和 Linux

Ego Lite 官方当前只支持 macOS；Windows 和 Linux 仍在路线图中，尚无明确发布时间。

- `research-social-insights`：可以只使用公开网页来源运行，但必须把缺少的登录态社媒来源标记为覆盖降级。
- `douyin-account-data`：自动采集暂不支持 Windows 或 Linux。不要用未经验证的浏览器脚本伪装为完整支持。
- Personal AI Workbench 自身及其 synthetic demo 数据仍可在满足 Node.js 环境要求的平台运行。

Ego Lite 发布 Windows/Linux 版本，或本项目增加经过验证的等价登录态浏览器适配器后，再扩展抖音采集支持。

## Skill 1：社媒洞察

适合这些请求：

```text
扫描最近 7 天 AI 圈里普通人正在做什么。
围绕“个人知识库”深挖跨平台观点、评论和需求。
```

最终只向用户指定知识库的 `10_raw/social-insights/` 写入脱敏 Markdown 报告，不自动生成选题或修改 Wiki。

## Skill 2：抖音账号数据

只处理用户本人有权访问的抖音创作者中心数据：

```text
Ego Lite 登录态
→ 官方 Excel 与页面数据
→ 临时解析和数据质量门禁
→ 30_self_media/douyin/current.json
→ Personal AI Workbench 抖音页面
```

它不抓取其他账号、不分析私信、不生成内容策略，也不替用户决定下一条拍什么。

运行前需要：

- macOS；
- Ego Lite 与 `ego-browser`；
- Node.js 20+；
- Python 3 与 `openpyxl`；
- `jq`；
- 已安装依赖的 Personal AI Workbench；
- 一个不提交到公开 Git 的个人知识库目录。

详细执行边界见 [douyin-account-data/SKILL.md](skills/douyin-account-data/SKILL.md)。

## 隐私与授权

- 只访问用户主动授权且本人有权访问的账号或页面。
- 不读取、打印、保存或提交密码、Cookie、会话参数和浏览器配置。
- 官方 Excel、页面快照和中间解析文件只保存在本轮系统临时目录，完成或失败后删除。
- 数据质量失败时不覆盖上一版有效 `current.json`。
- 仓库中的测试数据必须从零合成，不能由真实账号数据轻微改写而来。

## 验证

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py skills/research-social-insights
python3 /path/to/skill-creator/scripts/quick_validate.py skills/douyin-account-data
python3 -m unittest skills/douyin-account-data/scripts/test_analyze_snapshot.py
python3 skills/research-social-insights/scripts/validate_report.py --help
node scripts/privacy-scan.mjs
```

## License

MIT。见 [LICENSE](LICENSE)。
