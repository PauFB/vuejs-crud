<template>
    <div id="all-cryptocurrencies">
        <h1>All Cryptocurrencies</h1>

        <div class="sticky-top">
            <button type="button" class="btn" @click="openCartModal">Cart</button>
            <select v-model="selectedStyle">
                <option value="grid">Grid</option>
                <option value="table">Table</option>
            </select>
            <div class="form-group">
                <input type="text" name="search" v-model="cryptocurrencySearch" placeholder="Search cryptocurrencies"
                    class="form-control" v-on:keyup="searchCryptocurrencies">
            </div>
        </div>

        <CartModal v-if="isCartModalVisible" @close="closeCartModal" :cart-cryptocurrencies="cartCryptocurrencies" />

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
                    <router-link :to="{ name: 'cryptocurrency', query: { id: `${cryptocurrency.id}` } }">
                        <img :src="`/src/assets/img/${cryptocurrency.id}.png`" style="padding-right: 5px; width: 32px; height: 32px">
                        {{ cryptocurrency.name }}
                    </router-link>
                    <br>
                    {{ cryptocurrency.description }}
                    <hr>
                    {{ cryptocurrency.price }}
                    <div class="input-group">
                        <input v-model="qty[cryptocurrency.id]" class="form-control" type="number" min="0" style="width: 100px;">
                        <span class="input-group-btn">
                            <button @click="addToCart(cryptocurrency)" class="btn btn-primary">Add to cart</button>
                        </span>
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
                    <tr v-for="c in displayedCryptocurrencies">
                        <td>
                            <router-link :to="{ name: 'cryptocurrency', query: { id: `${c.id}` } }">
                                <img :src="`/src/assets/img/${c.id}.png`" style="padding-right: 5px; width: 32px; height: 32px">
                                {{ c.name }}
                            </router-link>
                        </td>
                        <td>{{ c.price }}</td>
                        <td>{{ c.priceTimestamp }}</td>
                        <td>{{ c.description }}</td>

                        <div class="input-group">
                            <input v-model="qty[c.id]" class="form-control" type="number" min="0" style="width: 100px;">
                            <span class="input-group-btn">
                                <button @click="addToCart(c)" class="btn btn-primary">Add to cart</button>
                            </span>
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
            cryptocurrencySearch: '',
            isCartModalVisible: false,
            cartCryptocurrencies: [],
            qty: []
        }
    },

    mounted() {
        document.head.appendChild(
            document.createElement('script').setAttribute('src', 'vue-grid-layout.umd.min.js')
        );
    },

    created() {
        this.fetchAllCryptocurrenciesData();
        window.setInterval(this.fetchDisplayedCryptocurrenciesData, 5000);
    },

    methods: {
        openCartModal() {
            this.isCartModalVisible = true;
        },

        closeCartModal() {
            this.isCartModalVisible = false;
        },

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
            if (this.cryptocurrencySearch == '') {
                this.fetchAllCryptocurrenciesData();
            }
            else {
                let url = new URL("http://localhost:3000/api/cryptocurrency/search");
                url.searchParams.append('name', this.cryptocurrencySearch);
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
    border: 1px solid;
    border-radius: 10px;
}
</style>
