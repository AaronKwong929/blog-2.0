const User = require('../models/Users');
const bcrypt = require('bcryptjs');

const fn_signin = async ctx => {
    if (ctx.method === 'GET') {
        await ctx.render('signin');
    } else if (ctx.method === 'POST') {
        try {
            const email = ctx.request.body.email,
                password = ctx.request.body.password,
                user = await User.findOne({ email }),
                isMatch = await bcrypt.compare(password, user.password);
            if (!user || !isMatch) {
                throw new Error();
            }
            ctx.session.user = {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            };
            await ctx.redirect('/me');
        } catch (e) {
            await ctx.render('fail-on-signin');
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
            ctx.session.user = {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            };
            await ctx.redirect('/me');
        } catch (e) {
            await ctx.render('failed-on-signup');
        }
    }
};

const fn_logout = async ctx => {
    ctx.session = null;
    ctx.redirect('/');
};

const fn_me = async ctx => {
    if (!ctx.session.user) {
        await ctx.render('need-to-login');
    }
    try {
        const user = ctx.session.user;
        await ctx.render('profile', {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } catch (e) {
        ctx.render('need-to-login');
    }
};

const fn_editUser = async ctx => {
    if (!ctx.session.user) {
        return await ctx.render('need-to-login');
    }
    const user = ctx.session.user;
    if (ctx.method === 'GET') {
        await ctx.render('userEdit', {
            name: user.name,
            email: user.email
        });
    } else if (ctx.method === 'POST') {
        try {
            const name = ctx.request.body.name,
                email = user.email;
            var password = ctx.request.body.password;
            const newUser = await User.findOne({ email });
            newUser.name = name;
            newUser.password = password;
            newUser.save();
            ctx.session.user.name = name;
            return await ctx.redirect('/me');
        } catch (e) {
            await ctx.render('fail-on-user-edit');
        }
    }
};

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
