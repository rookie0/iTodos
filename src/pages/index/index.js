let app = getApp();

Page({
    data: {
        global: app.global,
        todos: app.global.todos,
        notice: ''
    },

    onShareAppMessage(e) {

    },

    onLoad() {
        // 注册
        for (let method in app.methods) {
            this[method] = app.methods[method];
        }

        if (!app.global.user) {
            wx.cloud.callFunction({
                name: 'login',
                complete: res => {
                    app.global.user = res.result;
                    wx.setStorage({key: 'user', data: res.result});

                    if (!app.global.todos || app.global.todos.length < 1) {
                        app.db.collection('todos')
                            .where({
                                _openid: res.result.openId,
                                deleted_at: null
                            })
                            .orderBy('updated_at', 'desc')
                            .limit(100)
                            .get()
                            .then(res => {
                                app.global.todos = res.data;
                                app.util.updateIndex();
                                wx.setStorage({key: 'todos', data: app.global.todos});
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }
                }
            });
        }

        this.update();

        // 通知
        app.db.collection('config')
            .doc('config')
            .get()
            .then(res => {
                if (res.data.notice.content && (res.data.notice.user === app.global.user.openId || res.data.notice.user === 'all')) {
                    this.setData({notice: res.data.notice.content});
                }
            });
    },

    update() {
        this.setData({todos: app.global.todos});
    }

});