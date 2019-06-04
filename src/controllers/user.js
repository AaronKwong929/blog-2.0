const User = require('../models/Users');

const fn_index = async (ctx, next) => {
    ctx.render('hello.html');
}

module.exports = {
    'GET /': fn_index,
}