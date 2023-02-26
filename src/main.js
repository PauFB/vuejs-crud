import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueResource from 'vue-resource';
Vue.use(VueResource);

import App from './App.vue'

const AllCryptocurrencies = require('./assets/js/components/all-cryptocurrencies.vue');
const CryptocurrencyDetails = require('./assets/js/components/cryptocurrency.vue');

const routes = [
    {
        name: 'all_cryptocurrencies',
        path: '/',
        component: AllCryptocurrencies
    },
    {
        name: 'cryptocurrency',
        path: '/cryptocurrency',
        component: CryptocurrencyDetails
    }
];
var router = new VueRouter({ routes: routes, mode: 'history' });
new Vue(Vue.util.extend({ router }, App)).$mount('#app');