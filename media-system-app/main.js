import Vue from 'vue'
import App from './App'

import store from './store/index.js'
import request from './common/requesst/interface.js'

import uView from "@/uview";
Vue.use(uView);

Vue.config.productionTip = false

Vue.prototype.$request = request

Vue.prototype.$store = store

Vue.config.productionTip = false

Vue.prototype.$host = 'https://unidemo.dcloud.net.cn/';

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
