$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n < 10 ? '0' + n : n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            //这里的参数data   就是获取第几页 什么类别的数据  因此传入q
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法  就是获取文章的分类列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()

            }
        })
    }
    // 定义渲染分页的方法
    // function renderPage(total) {
    //     // 调用 laypage.render() 方法来渲染分页的结构
    //     laypage.render({
    //         elem: 'pageBox', // 分页容器的 Id
    //         count: total, // 总数据条数
    //         limit: q.pagesize, // 每页显示几条数据
    //         curr: q.pagenum, // 设置默认被选中的分页
    //         layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
    //         limits: [2, 3, 5, 10],
    //         // 分页发生切换的时候，触发 jump 回调
    //         // 触发 jump 回调的方式有两种：
    //         // 1. 点击页码的时候，会触发 jump 回调
    //         // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
    //         jump: function (obj, first) {
    //             // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
    //             // 如果 first 的值为 true，证明是方式2触发的
    //             // 否则就是方式1触发的
    //             console.log(first)
    //             console.log(obj.curr)
    //             // 把最新的页码值，赋值到 q 这个查询参数对象中
    //             q.pagenum = obj.curr
    //             // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
    //             q.pagesize = obj.limit
    //             // 根据最新的 q 获取对应的数据列表，并渲染表格
    //             // initTable()
    //             if (!first) {
    //                 initTable()
    //             }
    //         }
    //     })
    // }
    //分页功能
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认请求的页码数
            layout: ["count", "limit", "prev", "page", "next", "skip"], //修饰分页条
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // 触发 jump 回调的方式有两种：
                // 1. 点击页码的时候，会触发 jump 回调
                // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
                //在将得到的当前页赋值给q
                q.pagenum = obj.curr
                // console.log(obj.limit); //得到每页显示的条数
                //将得到的每页现实的条数赋值给q
                q.pagesize = obj.limit
                //根据first的值判断 jump函数是通过第几种方式触发的  注意这里的first是一个布尔值
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                if (!first) {
                    initTable()
                }
            }
        })
    }
    //删除功能
    $('tbody').on('click', '.btn-delete', function (e) {
        e.preventDefault()
        //删除是根据id  所以先获取id
        var id = $(this).attr('data-id');
        var len = $('.btn-delete').length
        // console.log(len);
        layer.confirm('确定删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    //当删除数据之后需要判断当前页的数据条数  
                    //如果没有数据了 则需要执行当前页的页码-1的操作  判断是否还有数据主要通过判断删除按钮的个数
                    //删除之后需要重新渲染数据
                    if (len === 1) {
                        //利用三元 判断当前页的页码是否为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            });
            layer.close(index);
        });

    })
})