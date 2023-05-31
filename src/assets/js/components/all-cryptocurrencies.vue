<template>
    <div id="all-cryptocurrencies">
        <h1>{{ $t('All_cryptocurrencies') }}</h1>

        <div class="sticky-top">
            <div style="margin: 10px 0px 10px 0px">
                <div class="row">
                    <div class="col">
                        <input type="text" v-model="cryptocurrencySearchQuery" placeholder="Search cryptocurrencies" class="form-control" v-on:keyup="searchCryptocurrencies()" />
                    </div>
                    <div class="col-md-auto">
                        <div class="input-group w-auto">
                            <span class="input-group-text">{{ $t('Style') }}</span>
                            <select class="form-select" v-model="selectedStyle">
                                <option value="grid">{{ $t('Grid') }}</option>
                                <option value="table">{{ $t('Table') }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-auto">
                        <div class="input-group w-auto">
                            <span class="input-group-text">{{ $t('Sort_by') }}</span>
                            <select class="form-select">
                                <option @click="fetchAllCryptocurrenciesData()">{{ $t('Default_sorting') }}</option>
                                <option @click="displayedCryptocurrencies.sort((a, b) => a.price - b.price)">{{ $t('Price') }}: {{ $t('low_to_high') }}</option>
                                <option @click="displayedCryptocurrencies.sort((a, b) => b.price - a.price)">{{ $t('Price') }}: {{ $t('high_to_low') }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-auto">
                        <b-button v-b-modal.cartModal>{{ $t('Cart') }}</b-button>
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
                    <canvas :id="cryptocurrency.idString"></canvas>
                    <b-row align-v="center" style="margin: 10px 0px 10px 0px">
                        <div class="w-25">
                            <b-col class="d-flex justify-content-center">
                                {{ $t('Price') }}: {{ cryptocurrency.price | toCurrency }}
                            </b-col>
                        </div>
                        <div class="w-75">
                            <b-col>
                                <div class="input-group">
                                    <input v-model="qty[cryptocurrency.id]" class="form-control" type="number" min="0"
                                        style="width: 100px" />
                                    <button @click="addToCart(cryptocurrency)" class="btn btn-primary">{{ $t('Add_to_cart') }}</button>
                                </div>
                            </b-col>
                        </div>
                    </b-row>
                </b-col>
            </b-row>
        </div>

        <div v-if="selectedStyle === 'table'">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <td>{{ $t('Name') }}</td>
                        <td>{{ $t('Price') }}</td>
                        <td>{{ $t('Price_timestamp') }}</td>
                        <td>{{ $t('Description') }}</td>
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
                                {{ $t('Add_to_cart') }}
                            </button>
                        </div>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import Chart from "chart.js";
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
            qty: [],
            priceHistory: []
        };
    },

    filters: {
        toCurrency(value) {
            if (typeof value !== "number") {
                return value;
            }
            var formatter = new Intl.NumberFormat('ca-ES', {
                style: 'currency',
                currency: 'EUR'
            });
            return formatter.format(value);
        }
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
        async fetchAllCryptocurrenciesData() {
            await this.$http
                .get("http://localhost:3000/api/cryptocurrencies")
                .then(response => {
                    this.displayedCryptocurrencies = response.body;
                });
            let idStringArray = [];
            this.displayedCryptocurrencies.forEach(c => {
                idStringArray.push({
                    idString: c.idString
                });
            });
            this.$http
                .post("http://localhost:3000/api/cryptocurrency/fetch-history", idStringArray)
                .then(response => {
                    this.priceHistory = response.body;
                    this.generateGraphs();
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
        generateGraphs() {
            this.displayedCryptocurrencies.forEach(c => {
                const ctx = document.getElementById(c.idString);

                const labels = [], data = [];
                const cHistory = this.priceHistory.find(item => item.idString === c.idString);
                if (cHistory.prices && cHistory.prices.length > 0) {
                    cHistory.prices.forEach(pair => {
                        labels.push(pair[0]);
                        data.push(pair[1]);
                    });
                }

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            borderColor: '#FF0000',
                            borderWidth: 3,
                            fill: false,
                            pointRadius: 0,
                            tension: 0
                        }]
                    },
                    options: {
                        legend: {
                            display: false
                        },
                        scales: {
                            xAxes: [{
                                display: false
                            }]
                        }
                    }
                });
            });
        }
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
