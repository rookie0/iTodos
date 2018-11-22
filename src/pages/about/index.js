let app = getApp();

Page({
    data: {
        global: app.global,
        year: new Date().getFullYear()
    },

    onShareAppMessage(e) {

    },

    imgTapped(e) {
        wx.previewImage({
            urls: [e.target.dataset.src]
        });
    },

    onLoad() {
        // 注册
        for (let method in app.methods) {
            this[method] = app.methods[method];
        }
    }

});