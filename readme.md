# 迟些就会改成目录

## 开工大吉 2019/6/4

主体上跟 1.0 大同小异  

待解决： 如果将几个 middleware 放到 middlewares 文件夹内，templating controller.js 会 gg

期望实现的新功能：  
采用数据库
CSS 自己写  
textarea 有 md 功能  
登陆状态保持  
可以用 jsonwebtoken 或者 koa-session  
前者看文档，看 node 课，后者看 liuxing，文档  
如果我想用 jwt 呢，数据库模型怎么改，怎么存储在 ctx 里面  
评论区 controller  
文章 controller
响应式布局  
文章分类（完成了  
bcrypt 加密密码，实现了一半，考虑匹配密码的问题  
koa 有没有像 express 那样的 router.post('/users/logout', auth, async (req, res) =>?  
数据库操作学 node 课的  
加一个 node 课的 middlewares 的 authentication？  
controllers 文件夹里面的东西，分开存放，user，article，网页基础界面  
个人信息界面  
实现登陆前导航条右侧登陆/注册，登陆后是“欢迎回来，xxx”  
    想法：1. toggle
        2. 新建一个block 用if判断

记得认真看koa文档
