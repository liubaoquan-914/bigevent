$(function () {
    const layer = layui.layer;
    const form = layui.form;
    initCate()
    // 初始化富文本编辑器
    initEditor()
    //获取文章分类列表
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // layer.msg(res.message)
                //调用模板引擎 渲染文章类别下拉菜单
                const htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }

        });
    }
    //实现图片的剪裁工作
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 当点击选择封面的时候 触发上传文件的点击
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    $('#coverFile').on('change', function (e) {
        //更换剪裁的图片
        var file = e.target.files[0] //这里也可以用$(this)[0].files
        //判断用户是否选择了文件
        if (file.length === 0) {
            return
        }
        //根据文件  选择URL的地址
        const newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    //发布文章
    // 1 先定义文章的状态  将其默认值设置为已发布
    const art_state = '已发布';
    $('#btnSave2').on('click', function () {
        //当用户点击存为草稿  就将文章的状态改为草稿
        art_state = '草稿';
    })
    // 2 为表单设置提交事件
    $('#form-pub').on('submit', function (e) {
        // 1 阻止表单的默认提交行为
        e.preventDefault()
        // 2 创建一个formData对象  注意  需要将jq对象转换为dom对象
        const fd = new FormData($(this)[0])
        // 3 将上面的文章状态添加到fd 中
        fd.append('state', art_state)
        // 查看fd中存的额数据
        // fd.forEach(function (value, key) {
        //     console.log(key, value); //打印出来的结果为每个键的值
        // })
        //  4 将剪裁过后的图片  输出位一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象  这里的blod就是我们所要的文件对象
                // 5 将这个文件对象存放到fd中  
                fd.append('cover_img', blob)
                //发起ajax数据请求
                publishArticle(fd)
            })
    })
    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            //注意  如果向服务器提交的是formData 格式的数据
            //必须添加下面的两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('发表文章成功')
                //成功之后跳转到art_list页面
                location.href = '/article/art_list.html'
            }
        });
    }
})