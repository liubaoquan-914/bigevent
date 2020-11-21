// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    //在调用权限接口的时候  指定complete回调函数  ajax自带的complete
    //全局统一挂载complate回调函数
    options.complete = function (res) {
        // console.log('执行了 complete 回调：')
        // console.log(res)
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据  注意'身份认证失败 '后面必须有空格
        if (res.responseJSON.status !== 1 && res.responseJSON.message === '身份认证失败! ') {
            //强制清空token
            localStorage.removeItem('token')
            //强制跳转到login页面
            location.href = '/login.html'
        }
    }
})