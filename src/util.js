const util = {
    // 跳转
    navTo: (to) => {
        let pages = getCurrentPages();
        let count = pages.length;
        let page = pages[count - 1];

        // 当前页
        if (to === ('/' + page.route)) {
            return;
        }

        let routes = pages.map((page) => {
            return '/' + page.route;
        });
        let index = routes.indexOf(to);

        // 存在返回 反之打开
        if (count > 1 && index > -1) {
            wx.navigateBack({
                delta: count - index - 1, fail: () => {
                    wx.reLaunch({url: '/pages/index/index'});
                }
            });
        } else {
            wx.navigateTo({
                url: to, fail: () => {
                    wx.reLaunch({url: '/pages/index/index'});
                }
            });
        }
    },

    // 更新首页列表
    updateIndex() {
        getCurrentPages().find(page => page.route === 'pages/index/index').update();
    }

};

module.exports = util;