<template>
    <div id="all-cryptocurrencies">
        <h1>All Cryptocurrencies</h1>

        <div class="sticky-top">
            <div style="margin: 10px 0px 10px 0px">
                <div class="row">
                    <div class="col">
                        <input type="text" v-model="cryptocurrencySearchQuery" placeholder="Search cryptocurrencies" class="form-control" v-on:keyup="searchCryptocurrencies()" />
                    </div>
                    <div class="col-md-auto">
                        <div class="input-group w-auto">
                            <span class="input-group-text">Style</span>
                            <select class="form-select" v-model="selectedStyle">
                                <option value="grid">Grid</option>
                                <option value="table">Table</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-auto">
                        <div class="input-group w-auto">
                            <span class="input-group-text">Sort by</span>
                            <select class="form-select">
                                <option @click="fetchAllCryptocurrenciesData()">Default sorting</option>
                                <option @click="displayedCryptocurrencies.sort((a, b) => a.price - b.price)">Price: low to high</option>
                                <option @click="displayedCryptocurrencies.sort((a, b) => b.price - a.price)">Price: high to low</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-auto">
                        <b-button v-b-modal.cartModal>Cart</b-button>
                    </div>
                </div>
            </div>
        </div>

        <CartModal :cart-cryptocurrencies="cartCryptocurrencies" />

        <div v-if="selectedStyle === 'grid'">
            <b-row v-for="row in gridRows">
                <b-col v-for="cryptocurrency in row" class="crypto-column">
                    <router-link class="text-decoration-none" :to="{ name: 'cryptocurrency', query: { id: `${cryptocurrency.id}` } }">
                        <b-img :src="`/src/assets/img/${cryptocurrency.id}.png`" width="32" height="32" />
                        <span class="crypto-title">{{ cryptocurrency.name }}</span>
                    </router-link>
                    <br>
                    <span class="crypto-description">{{ cryptocurrency.description }}</span>
                    <hr>
                    {{ cryptocurrency.price }}
                    <div class="input-group w-50" style="float: right">
                        <input v-model="qty[cryptocurrency.id]" class="form-control" type="number" min="0"
                            style="width: 100px" />
                        <button @click="addToCart(cryptocurrency)" class="btn btn-primary">Add to cart</button>
                    </div>
                </b-col>
            </b-row>
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
                    <tr v-for="c in displayedCryptocurrencies" style="vertical-align: middle">
                        <td>
                            <router-link class="text-decoration-none" :to="{ name: 'cryptocurrency', query: { id: `${c.id}` } }">
                                <img :src="`/src/assets/img/${c.id}.png`" style="width: 32px; height: 32px" />
                                <span style="vertical-align: middle">{{ c.name }}</span>
                            </router-link>
                        </td>
                        <td>{{ c.price }}</td>
                        <td>{{ c.priceTimestamp }}</td>
                        <td>{{ c.description }}</td>
                        <div class="input-group">
                            <input v-model="qty[c.id]" class="form-control" type="number" min="0" style="width: 100px" />
                            <button @click="addToCart(c)" class="btn btn-primary">
                                Add to cart
                            </button>
                        </div>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import CartModal from "./cart-modal.vue";

export default {
    components: {
        CartModal
    },

    data() {
        return {
            selectedStyle: "grid",
            N_COLUMNS_GRID: 3,
            displayedCryptocurrencies: [],
            cryptocurrencySearchQuery: "",
            cartCryptocurrencies: [],
            qty: []
        };
    },

    created() {
        this.fetchAllCryptocurrenciesData();
        window.setInterval(this.fetchDisplayedCryptocurrenciesData, 5000);
    },

    mounted() {
        this.$root.$on('eraseCartCryptocurrencies', () => {
            this.cartCryptocurrencies = [];
        });
    },

    computed: {
        gridRows() {
            const result = [];
            for (let i = 0; i < this.displayedCryptocurrencies.length; i += this.N_COLUMNS_GRID) {
                result.push(this.displayedCryptocurrencies.slice(i, i + this.N_COLUMNS_GRID));
            }
            return result;
        },
    },

    methods: {
        addToCart(crypto) {
            let cryptoAlreadyInCart = this.cartCryptocurrencies.filter(item => item.id === crypto.id);
            if (cryptoAlreadyInCart.length > 0) {
                cryptoAlreadyInCart[0].qty += parseFloat(this.qty[crypto.id]);
            } else {
                this.cartCryptocurrencies.push({
                    id: crypto.id,
                    name: crypto.name,
                    price: crypto.price,
                    qty: parseFloat(this.qty[crypto.id]),
                });
            }
        },
        fetchAllCryptocurrenciesData() {
            this.$http
                .get("http://localhost:3000/api/cryptocurrencies")
                .then(response => {
                    this.displayedCryptocurrencies = response.body;
                });
        },
        fetchDisplayedCryptocurrenciesData() {
            const idsArray = this.displayedCryptocurrencies.map(item => item.id);
            this.$http
                .post("http://localhost:3000/api/cryptocurrency/fetch", idsArray)
                .then(response => {
                    this.displayedCryptocurrencies = response.body;
                });
        },
        searchCryptocurrencies() {
            if (this.cryptocurrencySearchQuery == "") {
                this.fetchAllCryptocurrenciesData();
            } else {
                let url = new URL("http://localhost:3000/api/cryptocurrency/search");
                url.searchParams.append("name", this.cryptocurrencySearchQuery);
                this.$http.get(url.toString()).then(response => {
                    this.displayedCryptocurrencies = response.body;
                });
            }
        },
    },
};
</script>

<style>
.crypto-column {
    margin: 10px;
    padding: 10px;
    border: 1px solid lightgray;
    border-radius: 10px;
}

.crypto-title {
    font-size: 24px;
    text-align: left;
    position: relative;
    margin: auto;
    height: 100%;
    width: 100%;
    vertical-align: middle;
}

.crypto-description {
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
