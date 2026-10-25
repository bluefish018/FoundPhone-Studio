# 先别告诉她

林池鱼 × 王橹杰。校园平行设定、同龄同学、双向暗恋、甜向，无真人语音或私人聊天资料。林池鱼为代入角色，许愿为原创同学；全部聊天、行程、关系与场景均为创作，不代表真人的私人生活。

你在校园活动结束后的走廊捡到林池鱼的手机。两位主角正在找它。通过聊天、照片与未发出的备忘录，你发现两个人都在认真地向对方靠近。玩家负责归还手机，不冒充机主回复，也不替主角表白。

## 人物与表达

- 林池鱼：会回嘴、会关心，也有自己的主动；她不是等待被选择的人。她的备忘录表达她自己的喜欢，最终由她自己说出口。
- 王橹杰：以作者明确给出的“不是高冷人设”为准，写主动分享日常、会接话开玩笑、会紧张也会认真回应的同人版本。不使用冷脸、命令、控制、霸总或强行占有的表达；不把这些创作当作对真人性格的事实认证。
- 许愿：知道朋友的小心思，但尊重她自己决定何时开口，不代发消息、不替人揭露心意。

默认入口使用 `stories/template/story.json`。故事复用现有 Phone Runtime、微信、信息、相册、备忘录、事件引擎和 IndexedDB 存档。原有完整 App 测试入口 `?preview=test`、纯空白入口 `?template=blank` 和 App Store 保留。

## 游玩

先读信息里的许愿，再打开微信的两段聊天。点按关键气泡推进，找到日期线索后查看照片与加锁备忘录。两条线索集齐后收到模拟来电；本作未提供音频，接听后挂断或拒接均会解锁信息里的文字留言。点最后一条归还留言进入选择。

阅读提示同时放在手机备忘录的“从这里开始 · 游玩提示”中。照片标题和备忘录文字互相呼应；关键文字不放在仅渲染图片的照片说明字段里。

<details>
<summary>通关路线与结局（含剧透）</summary>

1. 微信 → 许愿 → 点按“嗯，1024。第一次一起排练那天。照片也收在相册里了，你不许笑我。”
2. 相册 → 两把椅子，一张照片。
3. 备忘录 → 先别告诉他 → 输入 `1024`。第 2、3 步可交换顺序。
4. 等待约 2 秒。接听王橹杰来电后挂断，或直接拒接；两条路径均不锁死故事。
5. 信息 → 王橹杰 → 阅读三条留言，点按最后一条“这句先别替我告诉她……”的气泡。
6. 选择“交还林池鱼，让她亲自赴约”，得到《这次不是顺路》；或选择“在值班台等两个人一起来取”，得到《明天也一起走》。两个结局均为甜向。

`tests` 内置 8 条实际引擎通关路径，覆盖两个结局 × 接听/拒接 × 照片/备忘录的两种阅读顺序。修改剧情时保持稳定 ID，并递增 `revision`；本作使用新作品 ID，避免与上游界面预览存档混用。

</details>

## 素材来源

相册图片为 2026-10-25 使用内置 imagegen 生成的原创场景图，不含真人、第三方照片、文字或品牌标识。最终 PNG 已以内嵌 data URL 保存于 `story.json` 的 `content.photos[0].media`，无需外部图床；未修改生成图。下方保留生成提示，方便复现创作意图，不承诺逐像素一致。

> Use case: illustration-story. Asset type: one in-game album photo for a gentle Chinese school alternate-universe crush story, original fictional scene. A candid cinematic still life in an empty school music rehearsal room at late afternoon: two slightly mismatched chairs pulled close together beside a sunlit window, two plain translucent cups of lemon soda on a wooden table, one closed blue notebook, an acoustic guitar case standing against the wall, autumn leaves outside and tiny water droplets on the glass. Warm apricot sunshine, muted sage and powder blue, quiet youthful sweetness, photographic texture with a very subtle illustrated softness, natural imperfect arrangement rather than an advertisement. Square framing. No people, no faces, no writing, no text, no logos, no watermark, no collage. The two chairs and the two drinks should be clearly visible.

原框架的 MIT 许可、源版权、第三方依赖及品牌素材声明均保留。此说明不为第三方名称、商标或真人肖像授予许可。
