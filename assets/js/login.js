$(function () {
    $('#link_login').on('click', function () {
        // console.log(2);
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_reg').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从layui中获取form属性
    const form = layui.form;
    const layer = layui.layer
    //通过form.verify() 函数自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        //校验两次密码是否一致
        repwd: function (value) {
            //获取密码框里面的值  如果没有IDs的情况使用属性选择器  也可以设置id  这里选择属性选择器
            var pwd = $('.reg-box [name=password]').val()
            //判断他俩是否相等
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POSt",
            url: "/api/reguser",
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！')
                //注册成功后自动切换到登录页面
                $('#link_reg').click()
            }
        });
    })

    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功')
                //将登录成功之后的token字符串 存储到localStorage中
                localStorage.setItem('token', res.token)
                //切换到首页  index.html
                location.href = "/index.html"
            }
        });
    })
})