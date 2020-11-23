$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return "新旧密码不能一样"
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })
    //实现重置密码的方法
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('res.message')
                }
                //重置密码  reset  注意reset是DOM的方法  所以需要将jq对象转为DOM
                $('.layui-form')[0].reset()
                //添加一个回调函数  当密码重置成功之后删除本地的token  并跳转到登录页面
                layer.msg('更新密码成功,即将跳转到登录页面', function () {
                    //清除本地token
                    localStorage.removeItem('token');
                    //跳转到登录页面  需要注意的是这里是值从index页面跳转到login页面 而当前页面是index页面的子页面  所以需要先转到index页面  window.parent
                    window.parent.location.href = '/login.html'
                })
            }
        });
    })
})