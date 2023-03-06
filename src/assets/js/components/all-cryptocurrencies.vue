<template>
    <div id="all-cryptocurrencies">
        <h1>All Cryptocurrencies</h1>

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
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            displayedCryptocurrencies: [],
            originalCryptocurrencies: [],
            cryptocurrencySearch: ''
        }
    },

    created: function () {
        this.fetchAllCryptocurrenciesData();
        window.setInterval(this.fetchDisplayedCryptocurrenciesData, 5000);
    },

    methods: {
        fetchAllCryptocurrenciesData: function () {
            this.$http.get('http://localhost:3000/api/cryptocurrencies').then(response => {
                this.originalCryptocurrencies = response.body;
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
