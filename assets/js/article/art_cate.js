$(function () {
    initArtCateList()
    const layer = layui.layer

    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                //判断获取数据是否成功
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        });
    }
    //为添加类别注册点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    // 实现添加文章分类的功能
    //因为form表单是自动生成的  所以不可以直接注册事件  需要通过事件委托
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //调用添加的函数
                initArtCateList()
                layer.msg(res.message)
                //添加成功之后关闭弹出层  根据索引关闭
                layer.close(indexAdd);
            }
        });
    })
    //实现文章的编辑功能
    var indexEdit = null
    var form = layui.form;
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        //  indexEdit 是为了在关闭这个弹出层时通过id  
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        // 获取到修改之后的数据 通过ID
        var id = $(this).attr('data-id');
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                console.log(res)
                //将获取到的信息填充到表单里面
                form.val('form-edit', res.data)
            }
        });
    })
    //修改之后更新文章
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                //关闭弹出层
                layer.close(indexEdit)
                //重新渲染数据
                initArtCateList()
            }
        });
    })
    //完成删除文章
    $('tbody').on('click', '.btn-delete', function () {
        //获取想删除栏的id
        var id = $(this).attr('data-id')
        layer.confirm('确定删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //发起删除的ajax请求
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCateList()
                }
            });
            //确认之后关闭弹出层
            layer.close(index);
        });
    })
})