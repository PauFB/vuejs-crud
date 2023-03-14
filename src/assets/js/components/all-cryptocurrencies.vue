<template>
    <div id="all-cryptocurrencies">
        <h1>All Cryptocurrencies</h1>

        <button type="button" class="btn" @click="openCartModal">Cart</button>

        <CartModal v-if="isCartModalVisible" @close="closeCartModal" :cart-cryptocurrencies="cartCryptocurrencies" />

        <div class="form-group">
            <input type="text" name="search" v-model="cryptocurrencySearch" placeholder="Search cryptocurrencies"
                class="form-control" v-on:keyup="searchCryptocurrencies">
        </div>

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
</template>

<script>
import CartModal from './cart-modal.vue'

export default {
    components: {
        CartModal
    },
    data() {
        return {
            displayedCryptocurrencies: [],
            cryptocurrencySearch: '',
            isCartModalVisible: false,
            cartCryptocurrencies: [],
            qty: [],
            test: ''
        }
    },

    created: function () {
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

        addToCart: function (crypto) {
            let cryptoAlreadyInCart = this.cartCryptocurrencies.filter(item => item.id === crypto.id);
            if (cryptoAlreadyInCart.length > 0) {
                cryptoAlreadyInCart[0].qty += parseFloat(this.qty[crypto.id])
            }
            else {
                let purchaseCrypto = {
                    id: crypto.id,
                    name: crypto.name,
                    price: crypto.price,
                    qty: parseFloat(this.qty[crypto.id])
                }
                this.cartCryptocurrencies.push(purchaseCrypto)
            }
        },

        fetchAllCryptocurrenciesData: function () {
            this.$http.get('http://localhost:3000/api/cryptocurrencies').then(response => {
                this.displayedCryptocurrencies = response.body;
            });
        },

        fetchDisplayedCryptocurrenciesData: function () {
            const idsArray = this.displayedCryptocurrencies.map(item => {
                return item.id;
            });
            this.$http.post('http://localhost:3000/api/cryptocurrency/fetch', idsArray).then(response => {
                this.displayedCryptocurrencies = response.body;
            });
        },

        searchCryptocurrencies: function () {
            if (this.cryptocurrencySearch == '') {
                this.fetchAllCryptocurrenciesData();
            }
            else {
                let url = new URL("http://localhost:3000/api/cryptocurrency/search");
                url.searchParams.append('name', this.cryptocurrencySearch);
                this.$http.get(url.toString()).then(response => {
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
</style>
