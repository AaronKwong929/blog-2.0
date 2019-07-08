# 使用 MongoDB 进行数据存储

## 包含的 npm

validator 用于验证输入内容合法性
bcrypt 用于加密密码

```cmd
npm install validator
npm install bcrypt
```

数据库总共包含如下表：

1. 文章 - src/models/Articles.js
2. 用户 - src/models/Users.js
3. 评论 - src/models/Comments.js
4. 点赞/点踩 - src/models/Likes.js

## 用户模型

```javascript
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 10,
        validate(value) {
            if (validator.isNumeric(value)) {
                throw new Error(`Name can't be only numbers`);
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 6,
        validate(value) {
            if (validator.isNumeric(value)) {
                throw new Error(`Password can't be only numbers`);
            }
        }
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(`Email format error`);
            }
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        default: new Date().toLocaleString()
    },
    updatedAt: {
        type: String,
        default: new Date().toLocaleString()
    },
    lastLogin: {
        type: String,
        default: new Date().toLocaleString()
    }
});

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

用户名定义长度为 4-10，去除首尾空格，不可以是纯数字  
密码最低长度为 6，去除首尾空格，不可以为纯数字  
邮箱唯一，且全小写  
isAdmin 判断是否为管理员，默认为否，自行在数据库内修改成 true  
lastLogin 记录用户上一次登陆的时间，每次登陆进行更改

设置一个 pre 钩子，在每一次修改用户信息的时候重置修改时间，另外如果密码有变动

```javascript
user.isModified('password');
```

使用 bcrypt 重新加密密码，pre钩子记得加入next(); 防止一直抢占，最后exports模型

```javascript
module.exports = mongoose.model('User', userSchema);
```

## 评论和文章模型不再赘述

## 点赞/点踩模型

```javascript

const likesSchema = new mongoose.Schema({
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    ArticleID: {
        type: String,
    },
    userIDs: [{
        userID: {
            type: String
        }
    }],
});

likesSchema.methods.findUser = async function(id) {
    const likesAndDislikes = this;
    return likesAndDislikes.userIDs.find(
        user => user.userID === id
    );
};

likesSchema.methods.like = async function(id) {
    const likesAndDislikes = this;
    likesAndDislikes.likes++;
    likesAndDislikes.userIDs.push({ userID: id });
    await this.save();
};

likesSchema.methods.dislike = async function(id) {
    const likesAndDislikes = this;
    likesAndDislikes.dislikes++;
    likesAndDislikes.userIDs.push({ userID: id });
    await this.save();
};

module.exports = mongoose.model('Likes', likesSchema);
```

### 实现思路：每一篇文章的的点赞点踩数均独立计算。用户操作后在这篇文章的表下加入操作用户的 _id，每一次加载文章时将获取当前session内的用户id，遍历该文章的点赞表内的userIDs，如果存在则渲染“您已操作”，否则渲染可操作的点赞模块
