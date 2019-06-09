const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const fn_signin = async ctx => {
    if (ctx.method === 'GET') {
        await ctx.render('signin');
    } else if (ctx.method === 'POST') {
        try {
            const email = ctx.request.body.email,
                password = ctx.request.body.password,
                user = await User.findOne({ email });
            if (!user) {
                throw new Error();
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error();
            }
            ctx.session.user = {
                id: user._id,
                name: user.name,
                email: user.email,
                password: user.password
            };
            await ctx.redirect('/me');
        } catch (e) {
            await ctx.render('signin-failed');
        }
    }
};

const fn_signup = async ctx => {
    if (ctx.method === 'GET') {
        await ctx.render('signup');
    } else if (ctx.method === 'POST') {
        const user = new User(ctx.request.body);
        try {
            await user.save();
            ctx.response.status = 201;
            ctx.response.body = 'Sign up successful';
        } catch (e) {
            ctx.response.status = 400;
            ctx.response.body = e;
        }
    }
};

const fn_logout = async ctx => {
    ctx.session = null;
    ctx.redirect('/');
};

const fn_me = async ctx => {
    const user = ctx.session.user;
    await ctx.render('profile', {
        name: user.name,
        email: user.email,
    });
    
};

const fn_editUser = async ctx => {
    // if (!ctx.session.user) {
    //     return await ctx.render('needLogin');
    // }
    if (ctx.method === 'GET') {
        const user = ctx.session.user;
        await ctx.render('userEdit', {
            name: user.name,
            email: user.email,
            password: user.password
        });
    } else if (ctx.method === 'POST') {
        const user = ctx.session.user,
        name = ctx.request.body.name,
        email = user.email;
        var password = ctx.request.body.password;
        password = await bcrypt.hash(password, 8);
        const userEd = await User.findOneAndUpdate({ email }, {
            name,
            password,
            updatedAt: new Date().getTime()
        });
        if (!userEd) {
            return await ctx.render('signin-failed');
        }
        return await ctx.redirect('/');
    }
}

module.exports = {
    'GET /signin': fn_signin,
    'POST /signin': fn_signin,
    'GET /signup': fn_signup,
    'POST /signup': fn_signup,
    'GET /logout': fn_logout,
    'GET /me': fn_me,
    'GET /edit': fn_editUser,
    'POST /edit': fn_editUser,
};
