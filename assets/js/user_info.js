$(function () {
    const form = layui.form;
    const layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })
    getUserInfo()
    //初始化用户的基本信息
    function getUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                //利用layui 的form.val 快速给表单赋值
                form.val('formUserInfo', res.data)
            }
        });
    }
    //重置表单的数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        getUserInfo()
    })
    //监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('res.message')
                }
                layer.msg('更改用户信息成功')
                //更改只够需要将index页面中的个人中心  欢迎那个地方重新渲染 在子页面获取父页面的方法  用  window.parent  
                window.parent.getUserInfo()
            }
        });
    })
})