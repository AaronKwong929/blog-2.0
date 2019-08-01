# 用户相关

## 用户模型设计 -- 参考[数据模型 - models](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/database.md)

## 用户登陆

```javascript
const fn_signin = async ctx => {
    if (ctx.method === 'GET') {
        try {
            if (ctx.session.user) {
                throw new Error('您已登陆');
            }
            await ctx.render('signin');
        } catch (e) {
            await ctx.render('error', {
                e
            });
        }
    } else if (ctx.method === 'POST') {
        try {
            const email = ctx.request.body.email,
                password = ctx.request.body.password,
                user = await User.findOne({ email }),
                isMatch = await bcrypt.compare(password, user.password);
            if (!user || !isMatch) {
                throw new Error('登陆失败');
            }
            ctx.session.user = {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                lastLogin: user.lastLogin
            };
            user.lastLogin = new Date().toLocaleString();
            await user.save();
            await ctx.redirect('/me');
        } catch (e) {
            await ctx.render('error', {
                e
            });
        }
    }
};
```

1. 在 get 下，先对 session 进行检测，如果 session 中有 user（即已登陆，返回错误 -> 防止已登陆用户再打开/signin 页面操作，如果没有则渲染 signin 页面

2. 在 post 下，获取表单内容，isMatch 用于检测用户输入的密码与数据库中的密码是否一致，一致则将当前用户信息加入到 session 中，并且更新最后登录日期，并 redirect 到个人中心页面

## 用户注册

```javascript
const fn_signup = async ctx => {
    if (ctx.method === 'GET') {
        try {
            if (ctx.session.user) {
                throw new Error('您已登陆');
            }
            await ctx.render('signup');
        } catch (e) {
            await ctx.render('error', {
                e
            });
        }
    } else if (ctx.method === 'POST') {
        const user = new User(ctx.request.body);
        try {
            await user.save();
            ctx.session.user = {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                lastLogin: user.lastLogin
            };
            await ctx.redirect('/me');
        } catch (e) {
            await ctx.render('error', {
                e
            });
        }
    }
};
```

1. get 下同样检测 session 防止用户再操作

2. 将 ctx.request.user 内的数据（object）新建成 User 对象并进行保存，并将用户信息注入到 session 中，并 redirect 到个人中心页实现注册后自动登陆

## 用户注销

```javascript
const fn_logout = async ctx => {
    ctx.session = null;
    ctx.redirect('/');
};
```

1. 清空 session，并且 redirect 到首页即可

## 用户个人中心

```javascript
const fn_me = async ctx => {
    try {
        if (!ctx.session.user) {
            throw new Error('请先登录');
        }
        const user = ctx.session.user;
        await ctx.render('profile', {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } catch (e) {
        await ctx.render('error', {
            e
        });
    }
};
```

## 修改个人信息

```javascript
const fn_editUser = async ctx => {
    if (ctx.method === 'GET') {
        try {
            if (!ctx.session.user) {
                throw new Error('请先登录');
            }
            const user = ctx.session.user;
            await ctx.render('userEdit', {
                name: user.name,
                email: user.email
            });
        } catch (e) {
            await ctx.render('error', {
                e
            });
        }
    } else if (ctx.method === 'POST') {
        try {
            const email = user.email;
            var password = ctx.request.body.password;
            const newUser = await User.findOne({ email });
            newUser.password = password;
            newUser.save();
            return await ctx.redirect('/me');
        } catch (e) {
            await ctx.render('error', {
                e
            });
        }
    }
};
```

1. 检测登陆状态，未登陆则输出错误

2. 渲染修改信息页面，将 session 中的邮箱与用户名注入页面

3. User 模型内有 pre 钩子用于对密码加密，代码如下所示，此处不再赘述，详情参考[数据模型 - models](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/database.md)

```javascript
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    const now = new Date().toLocaleString();
    if (user.updatedAt !== now) {
        user.updatedAt = now;
    }
    next();
});
```

## 路由

### get post 开头是对应[router 注册](https://github.com/AaronKwong929/blog-2.0/tree/master/DOCS/middlewares/controller-js.md)

```javascript
module.exports = {
    'GET /signin': fn_signin,
    'POST /signin': fn_signin,
    'GET /signup': fn_signup,
    'POST /signup': fn_signup,
    'GET /logout': fn_logout,
    'GET /me': fn_me,
    'GET /me/edit': fn_editUser,
    'POST /me/edit': fn_editUser
};
```
