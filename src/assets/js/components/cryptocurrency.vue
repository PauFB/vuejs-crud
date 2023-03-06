<template>
    <div id="cryptocurrency">
        {{ cryptocurrency.id }}
        {{ cryptocurrency.name }}
        {{ cryptocurrency.price }}
        {{ cryptocurrency.priceTimestamp }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            cryptocurrency: {}
        }
    },

    created: function () {
        this.fetchCryptocurrencyDetails();
        window.setInterval(this.fetchCryptocurrenciesData, 5000);
    },

    methods: {
        fetchCryptocurrencyDetails: function () {
            this.$http.get(`http://localhost:3000/api/cryptocurrency/${this.$route.query.id}`).then(response => {
                this.cryptocurrency = response.body;
                console.log(this.cryptocurrency);
            });
        }
    }
}
</script>
