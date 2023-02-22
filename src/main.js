import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueResource from 'vue-resource';
Vue.use(VueResource);

import App from './App.vue'

const AllCryptocurrencies = require('./assets/js/components/all-cryptocurrencies.vue');
const CreateCryptocurrency = require('./assets/js/components/create-cryptocurrency.vue');
const EditCryptocurrency = require('./assets/js/components/edit-cryptocurrency.vue');
const DeleteCryptocurrency = require('./assets/js/components/delete-cryptocurrency.vue');

const routes = [
    {
        name: 'all_cryptocurrencies',
        path: '/',
        component: AllCryptocurrencies
    },
    {
        name: 'create_cryptocurrency',
        path: '/cryptocurrencies/create',
        component: CreateCryptocurrency
    },
    {
        name: 'edit_cryptocurrency',
        path: '/cryptocurrencies/edit/:id',
        component: EditCryptocurrency
    },
    {
        name: 'delete_cryptocurrency',
        path: '/cryptocurrencies/delete/:id',
        component: DeleteCryptocurrency
    }
];
var router = new VueRouter({ routes: routes, mode: 'history' });
new Vue(Vue.util.extend({ router }, App)).$mount('#app');