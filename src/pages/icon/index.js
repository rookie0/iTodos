import {icons, logos} from './data';

let app = getApp();

Page({
    data: {
        global: app.global,
        display: true,
        icon: 'ion ion-ios-radio-button-off',
        name: '待办事项',
        icons: icons,
        logos: logos
    },

    onShareAppMessage(e) {

    },

    onChange() {
        this.setData({display: !this.data.display});
    },

    onClick() {
        wx.setStorageSync('icon', this.data.icon);

        wx.navigateBack();
    },

    onTap(e) {
        this.setData({
            icon: e.currentTarget.id
        });
    },

    onLoad(opt) {
        // 注册
        for (let method in app.methods) {
            this[method] = app.methods[method];
        }

        this.setData({
            icon: opt.icon || this.data.icon,
            name: opt.name || this.data.name
        });
    }
});