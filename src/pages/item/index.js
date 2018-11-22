import {$wuxSelect} from '../../wux/index';
import {$wuxToptips} from '../../wux/index';

let app = getApp();

Page({
    data: {
        global: app.global,
        colors: [
            {
                title: 'Gray',
                value: '#888888',
                color: '#888888'
            },
            {
                title: 'Red',
                value: 'rgb(253,78,74)',
                color: 'rgb(253,78,74)'
            },
            {
                title: 'Orange',
                value: 'rgb(253,154,61)',
                color: 'rgb(253,154,61)'
            },
            {
                title: 'Yellow',
                value: 'rgb(253,207,68)',
                color: 'rgb(253,207,68)'
            },
            {
                title: 'Green',
                value: 'rgb(119,224,84)',
                color: 'rgb(119,224,84)'
            },
            {
                title: 'Blue',
                value: 'rgb(73,174,248)',
                color: 'rgb(73,174,248)'
            },
            {
                title: 'Purple',
                value: 'rgb(203,119,205)',
                color: 'rgb(203,119,205)'
            }
        ],
        item: {
            _id: null,
            name: '',
            icon: 'ion ion-ios-radio-button-off',
            color: '#888888',
            remark: ''
        }
    },

    onShareAppMessage(e) {

    },

    inputChanged(e) {
        let limit = e.target.id === 'name' ? 38 : 150;
        if (e.detail.value.length >= limit) {
            $wuxToptips().warn({
                hidden: false,
                text: '限 ' + limit + ' 字以内',
                duration: 3000,
                success() {
                }
            });
            e.detail.value = e.detail.value.substr(0, limit);
        }

        this.data.item[e.target.id] = e.detail.value;
        this.setData({item: this.data.item});
    },

    colorTapped() {
        $wuxSelect('#sltColor').open({
            value: [this.data.item.color],
            multiple: true,
            options: this.data.colors,
            onConfirm: (value, index, options) => {
                this.data.item.color = value[0];
                this.setData({item: this.data.item});
            },
            onCheckboxChange: (value) => {
                this.data.item.color = value[0];
                this.setData({item: this.data.item});
            }
        });
    },

    onLoad(opt) {
        // 注册
        for (let method in app.methods) {
            this[method] = app.methods[method];
        }

        let navTitle = '添加待办';
        if (opt._id) {
            navTitle = '待办详情';
            this.data.item = app.global.todos.find(item => item._id === opt._id) || this.data.item;
            this.setData({item: this.data.item});
        }
        wx.setNavigationBarTitle({title: navTitle});
        wx.setStorageSync('icon', this.data.item.icon);
    },

    onShow() {
        let icon = wx.getStorageSync('icon');
        if (icon && this.data.item.icon !== icon) {
            this.data.item.icon = icon;
            this.setData({item: this.data.item});
        }
    },

    onUnload() {
        this.update();
    },

    onHide() {
        this.update();
    },

    update() {
        let now = new Date().toISOString();
        // name存在保存|更新 不存在删除
        if (this.data.item._id && this.data.item.name) { // 更新
            let item = wx.getStorageSync('todos').find(item => item._id === this.data.item._id);
            if (JSON.stringify(item) !== JSON.stringify(this.data.item)) {
                this.data.item.updated_at = now;
                item = Object.assign({}, this.data.item);
                delete item._id;
                delete item._openid;
                item.updated_at = app.db.serverDate();
                app.db.collection('todos').doc(this.data.item._id).update({
                    data: item,
                    success: res => {
                        // 更新缓存
                        app.global.todos = app.global.todos.filter(item => item._id !== this.data.item._id);
                        app.global.todos.unshift(this.data.item);
                        app.util.updateIndex();
                        wx.setStorageSync('todos', app.global.todos);
                    }
                })
            }
        } else if (this.data.item._id) { // 删除
            app.db.collection('todos').doc(this.data.item._id).update({
                data: {
                    deleted_at: app.db.serverDate(),
                    updated_at: app.db.serverDate()
                },
                success: res => {
                    app.global.todos = app.global.todos.filter(item => item._id !== this.data.item._id);
                    app.util.updateIndex();
                    wx.setStorageSync('todos', app.global.todos);
                }
            });
        } else if (this.data.item.name) { // 添加
            this.data.item.updated_at = this.data.item.created_at = now;
            this.data.item.deleted_at = null;
            let item = Object.assign({}, this.data.item);
            item.created_at = item.updated_at = app.db.serverDate();
            app.db.collection('todos').add({
                data: item,
                success: res => {
                    this.data.item._id = res._id;
                    this.data.item._openid = app.global.user.openId;
                    app.global.todos.unshift(this.data.item);
                    app.util.updateIndex();
                    wx.setStorageSync('todos', app.global.todos);
                }
            });
        }
    }

});