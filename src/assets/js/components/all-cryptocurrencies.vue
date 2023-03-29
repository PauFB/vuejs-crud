<template>
    <div id="all-cryptocurrencies">
        <h1>All Cryptocurrencies</h1>

        <div class="sticky-top">
            <div class="container">
                <div class="row">
                    <div class="col">
                        <input type="text" v-model="cryptocurrencySearchQuery" placeholder="Search cryptocurrencies" class="form-control" v-on:keyup="searchCryptocurrencies()">
                    </div>
                    <div class="col-md-auto">
                        <div class="input-group w-auto" style="float: right;">
                            <span class="input-group-text">Style</span>
                            <select class="form-select" v-model="selectedStyle">
                                <option value="grid">Grid</option>
                                <option value="table">Table</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-auto">
                        <div class="input-group w-auto" style="float: right;">
                            <span class="input-group-text">Sort by</span>
                            <select class="form-select">
                                <option @click="fetchAllCryptocurrenciesData()">Default sorting</option>
                                <option @click="displayedCryptocurrencies.sort((a, b) => a.price - b.price)">Price: low to high</option>
                                <option @click="displayedCryptocurrencies.sort((a, b) => b.price - a.price)">Price: high to low</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-auto">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#cartModal" style="float: right;">Cart</button>
                    </div>
                </div>
            </div>
        </div>

        <CartModal :cart-cryptocurrencies="cartCryptocurrencies"/>

        <div v-if="selectedStyle === 'grid'">
            <GridLayout
                    :layout.sync="layout"
                    :col-num="this.N_COLUMNS_GRIDLAYOUT"
                    :row-height="wrap"
                    :is-draggable="false"
                    :is-resizable="false"
                    :is-mirrored="false"
                    :vertical-compact="true"
                    :margin="[10, 10]"
                    :use-css-transforms="true">
                <GridItem v-for="(cryptocurrency, index) in displayedCryptocurrencies"
                        :x="layout[index].x"
                        :y="layout[index].y"
                        :w="layout[index].w"
                        :h="layout[index].h"
                        :i="layout[index].i"
                        :key="index">
                    <router-link class="text-decoration-none" :to="{ name: 'cryptocurrency', query: { id: `${cryptocurrency.id}` } }">
                        <img class="img" :src="`/src/assets/img/${cryptocurrency.id}.png`">
                        <span class="title">{{ cryptocurrency.name }}</span>
                    </router-link>
                    <br>
                    <span class="crypto-description">{{ cryptocurrency.description }}</span>
                    <hr>
                    {{ cryptocurrency.price }}
                    <div class="input-group w-50" style="float: right;">
                        <input v-model="qty[cryptocurrency.id]" class="form-control" type="number" min="0" style="width: 100px;">
                        <button @click="addToCart(cryptocurrency)" class="btn btn-primary">Add to cart</button>
                    </div>
                </GridItem>
            </GridLayout>
        </div>

        <div v-if="selectedStyle === 'table'">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Price</td>
                        <td>Price timestamp</td>
                        <td>Description</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in displayedCryptocurrencies" style="vertical-align: middle;">
                        <td>
                            <router-link class="text-decoration-none" :to="{ name: 'cryptocurrency', query: { id: `${c.id}` } }">
                                <img :src="`/src/assets/img/${c.id}.png`" style="width: 32px; height: 32px;">
                                <span style="vertical-align: middle;">{{ c.name }}</span>
                            </router-link>
                        </td>
                        <td>{{ c.price }}</td>
                        <td>{{ c.priceTimestamp }}</td>
                        <td>{{ c.description }}</td>

                        <div class="input-group">
                            <input v-model="qty[c.id]" class="form-control" type="number" min="0" style="width: 100px;">
                            <button @click="addToCart(c)" class="btn btn-primary">Add to cart</button>
                        </div>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import CartModal from './cart-modal.vue'
import VueGridLayout from 'vue-grid-layout'

export default {
    components: {
        CartModal,
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem
    },

    data() {
        return {
            selectedStyle: 'grid',
            N_COLUMNS_GRIDLAYOUT: 3,
            layout: [],
            displayedCryptocurrencies: [],
            cryptocurrencySearchQuery: '',
            cartCryptocurrencies: [],
            qty: [],
        }
    },

    created() {
        this.fetchAllCryptocurrenciesData();
        window.setInterval(this.fetchDisplayedCryptocurrenciesData, 5000);
    },

    methods: {
        addToCart(crypto) {
            let cryptoAlreadyInCart = this.cartCryptocurrencies.filter(item => item.id === crypto.id);
            if (cryptoAlreadyInCart.length > 0) {
                cryptoAlreadyInCart[0].qty += parseFloat(this.qty[crypto.id])
            }
            else {
                this.cartCryptocurrencies.push({
                    id: crypto.id,
                    name: crypto.name,
                    price: crypto.price,
                    qty: parseFloat(this.qty[crypto.id])
                })
            }
        },

        updateVueGridLayout(newLength) {
            this.layout = [];
            let x = 0, y = 0;
            for (let i = 0; i < newLength; i++) {
                this.layout.push({
                    "x": x,
                    "y": y,
                    "w": 1,
                    "h": 1,
                    "i": i
                });
                x = (x + 1) % this.N_COLUMNS_GRIDLAYOUT;
                if (x === 0)
                    y++;
            }
        },

        fetchAllCryptocurrenciesData() {
            this.$http.get('http://localhost:3000/api/cryptocurrencies').then(response => {
                this.updateVueGridLayout(response.body.length);
                this.displayedCryptocurrencies = response.body;
            });
        },

        fetchDisplayedCryptocurrenciesData() {
            const idsArray = this.displayedCryptocurrencies.map(item => {
                return item.id;
            });
            this.$http.post('http://localhost:3000/api/cryptocurrency/fetch', idsArray).then(response => {
                this.updateVueGridLayout(response.body.length);
                this.displayedCryptocurrencies = response.body;
            });
        },

        searchCryptocurrencies() {
            if (this.cryptocurrencySearchQuery == '') {
                this.fetchAllCryptocurrenciesData();
            }
            else {
                let url = new URL("http://localhost:3000/api/cryptocurrency/search");
                url.searchParams.append('name', this.cryptocurrencySearchQuery);
                this.$http.get(url.toString()).then(response => {
                    this.updateVueGridLayout(response.body.length);
                    this.displayedCryptocurrencies = response.body;
                });
            }
        }
    }
}
</script>

<style>
.input-group-btn {
    display: block;
    width: 100%;
}

.vue-grid-item:not(.vue-grid-placeholder) {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}

.vue-grid-item .title {
    font-size: 24px;
    text-align: left;
    position: relative;
    margin: auto;
    height: 100%;
    width: 100%;
    vertical-align: middle;
}

.vue-grid-item .img {
    width: 32px;
    height: 32px;
}

.crypto-description {
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
