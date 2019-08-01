# 分页器

## article.js

```javascript
const fn_articles = async ctx => {
    try {
        const pageSize = 5;
        const currentPage = parseInt(ctx.query.page) || 1;
        const allArticlesCount = await Articles.countDocuments();
        const pageCount = Math.ceil(allArticlesCount / pageSize);
        const pageStart = currentPage - 2 > 0 ? currentPage - 2 : 1;
        const pageEnd =
            currentPage + 2 >= pageCount ? pageCount : currentPage + 2;
        const baseUrl = `${ctx.path}?page=`;
        const articles = await Articles.find({})
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);
        if (JSON.stringify(articles) === 'null' || articles.length === 0) {
            throw new Error('不存在文章');
        }
        await ctx.render('articles', {
            articles,
            currentPage,
            pageCount,
            pageStart,
            pageEnd,
            baseUrl
        });
    } catch (e) {
        await ctx.render('error', {
            e
        });
    }
};
```

设置每页显示五个文章 pagesize=5，当前页为ctx.query.page或者为空时为1，pageStart为分页器展示的第一个页，为当前页-2，同理pageEnd; const allArticlesCount = await Articles.countDocuments()获取文章总数，除以分页器取Math.ceil值

articles使用skip和limit实现分页

## pagination.html

```html
<div class="pagination clearfix">
    {%  if 1 < pageCount and pageCount >= currentPage  %}
        <div>
            {% if currentPage == 1 %}
                <a class="pagination-btn current-page" href="{{ baseUrl + 1 }}" >1</a>
            {% else %}
                <a class="pagination-btn" href="{{ baseUrl + 1 }}" >1</a>
            {% endif %}
            {% if pageStart > 1 %}
                <span>&hellip;</span>
            {% endif %}
            {% for i in range(pageStart + 1, pageEnd) %}
                {% if i == currentPage  %}
                    <a class="pagination-btn current-page">{{ i }}</a>
                {% else %}
                    <a class="pagination-btn" href="{{ baseUrl + i }}" >{{ i }}</a>
                {% endif %}
            {% endfor %}
            {% if pageEnd < pageCount %}
                <span>&hellip;</span>
            {% endif %}
            {% if currentPage == pageCount %}
                <a class="pagination-btn current-page" href="{{ baseUrl + pageCount }}">{{ pageCount }}</a>
            {% else %}
                <a class="pagination-btn" href="{{ baseUrl + pageCount }}">{{ pageCount }}</a>
            {% endif %}
        </div>
    {% else %}
        <div class="pagination-btn">没有更多了&hellip;</div>
    {% endif %}
</div>
```
