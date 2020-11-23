$(function () {
    getUserInfo()
    //实现退出功能
    $('#btnLogout').on('click', function () {
        // console.log(12);
        layui.layer.confirm('确定退出吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            //点击确定之后清除本地的token  注意不能用clear  clear会把所有的都清除掉
            localStorage.removeItem('token')
            //跳转到longin.html
            location.href = '/login.html'
            //关闭询问框  layui自带 
            layer.close(index);
        });
    })
})
//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!')
            }
            // 调用  renderAvatar 渲染头部头像的函数
            renderAvatar(res.data)
        }
    });
}
//渲染头部头像
function renderAvatar(user) {
    //获取用户名
    var name = user.nickname || user.username;
    //设置欢迎文本
    $('#welcome').html("欢迎&nbsp&nbsp" + name)
    //按用户需要渲染头部头像
    //如果有图片就显示图片头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //如果没有图片就显示名字的第一个文字
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }

}