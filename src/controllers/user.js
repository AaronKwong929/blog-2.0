const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const fn_signin = async ctx => {
    if (ctx.method === 'GET') {
        await ctx.render('signin.html');
    } else if (ctx.method === 'POST') {
        try {
            const email = ctx.request.body.email,
                password = ctx.request.body.password,
                user = await User.findOne({ email });
            if (!user) {
                throw new Error();
            }
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                throw new Error();
            }
            await ctx.render('profile.html', {
                name: user.name,
            })
        } catch (e) {
            await ctx.render('signin-failed.html');
        }
        //     try {
        //         const email = ctx.request.body.email,
        //             password = ctx.request.body.password,
        //             user = await User.findOne({ email });
        //         if (!user) {
        //             return await ctx.render('signin-failed.html');
        //         }
        //         await bcrypt.compare(password, user.password, (err, res) => {
        //             if (err) {
        //                 throw new Error();
        //             }
        //             await ctx.render('profile.html', {
        //                 name: user.name
        //         });
        //     });
        // }
    }
};

const fn_signup = async ctx => {
    if (ctx.method === 'GET') {
        await ctx.render('signup.html');
    } else if (ctx.method === 'POST') {
        console.log(ctx.request.body);
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

module.exports = {
    'GET /signin': fn_signin,
    'POST /signin': fn_signin,
    'GET /signup': fn_signup,
    'POST /signup': fn_signup
};
