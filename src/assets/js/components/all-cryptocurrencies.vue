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
                <tr v-for="c in cryptocurrencies">
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
            cryptocurrencies: [],
            originalCryptocurrencies: [],
            cryptocurrencySearch: ''
        }
    },

    created: function () {
        this.fetchCryptocurrenciesData();
        window.setInterval(this.fetchCryptocurrenciesData, 5000);
    },

    methods: {
        fetchCryptocurrenciesData: function () {
            this.$http.get('http://localhost:3000/api/cryptocurrencies').then((response) => {
                this.cryptocurrencies = response.body;
                this.originalCryptocurrencies = this.cryptocurrencies;
            });
        },

        searchCryptocurrencies: function () {
            if (this.cryptocurrencySearch == '') {
                this.cryptocurrencies = this.originalCryptocurrencies;
                return;
            }
            let url = new URL("http://localhost:3000/api/cryptocurrency/search");
            url.searchParams.append('name', this.cryptocurrencySearch);
            this.$http.get(url.toString()).then((response) => {
                this.cryptocurrencies = response.body;
            });
        }
    }
}
</script>
