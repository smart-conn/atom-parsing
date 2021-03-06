# Parsing

Example: ``

## 目录结构

- check 模式检查模块
  - pattern
  - checks.js 检测脚本是否正确
  - index.js 抛出所有的模式匹配检查
- handler 处理模块
- util 工具模块
  - button 按键匹配模块
    - index.js 匹配按键和keycode之间的关系
    - config.js 关于玩具按键和keycode之间的mapping表
  - LED LED模块
  - snapshot.js 故事快照功能，以及记录故事的状态
  - timer.js 故事的计时功能
- autotest.js 自动测试工具
- test.js 单步测试工具
- parsing.js 解释引擎的流程控制主要部分
- index.js 入口文件，事件分发，将mqtt消息分发至内部为event
- config.js 配置

## 逻辑处理
- 对于每一种模式都应该有一个入口初始值的调整，确定开始播放的位置
- 对于按键超过某个时间之后没有按，出现的 action 是 no 按键设置的内容
- 对于故事机所有的播放音频为了避免打断不能恢复，所有音频的播放模式均选择 play，包括提示音。（原因在于，如果其中的某些提示音 break，被打断就永远不能回到原来的播放状态。）
- 对于每一种模式 handler 的处理均需要在处理完成之后返回一个 promise。

## 按键规则
- 每一款玩具上边都有一套不同的按键匹配，（通用：any -- 任意键，no -- 没有按键）

## 脚本规则
- 对于绘本故事和互动故事开始必须有begin-title.ogg（XX故事开始播放了）和入场音效的播放，对于结尾有end-title.ogg（XX故事播放完了）。
- 在故事结尾开头播放的"XX故事开始播放了","XX故事播放完了"应该作为一个单独的段落，以保证在最后的段落总是可以听到这个结束音。
