<template>
    <div>
        <header>
            <router-link :to="{ name: 'all_cryptocurrencies' }">
                <button type="button" class="btn btn-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-return-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    {{ $t('Back') }}
                </button>
            </router-link>
        </header>
        <main>
            <section class="hero">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="container" style="display: flex; align-items: center;">
                                <img :src="`/src/assets/img/${cryptocurrency.id}.png`" style="width: 32px; height: 32px; margin-right: 10px;" />
                                <span style="vertical-align: middle"><h1>{{ cryptocurrency.name }}</h1></span>
                            </div>
                            <h3>{{ cryptocurrency.price | toCurrency }}</h3>
                            <p>{{ cryptocurrency.description }}</p>
                        </div>
                        <div class="col-lg-6">
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <td><b>ID</b></td>
                                        <td colspan="2">{{ cryptocurrency.id }}</td>
                                    </tr>
                                    <tr>
                                        <td><b>{{ $t('ID_string') }}</b></td>
                                        <td colspan="2">{{ cryptocurrency.idString }}</td>
                                    </tr>
                                    <tr>
                                        <td><b>{{ $t('Name') }}</b></td>
                                        <td colspan="2">{{ cryptocurrency.name }}</td>
                                    </tr>
                                    <tr>
                                        <td><b>{{ $t('Price') }}</b></td>
                                        <td colspan="2">{{ cryptocurrency.price }}</td>
                                    </tr>
                                    <tr>
                                        <td><b>{{ $t('Price_timestamp') }}</b></td>
                                        <td colspan="2">{{ cryptocurrency.priceTimestamp }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <canvas id="graph" style="margin-top: 20px;"></canvas>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cryptocurrency: [],
            priceHistory: []
        }
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
        this.fetchCryptocurrencyDetails();
        window.setInterval(this.fetchUpdatedCryptocurrencyDetails, 5000);
    },

    methods: {
        async fetchCryptocurrencyDetails() {
            await this.$http.get(`http://localhost:3000/api/cryptocurrency/${this.$route.query.id}`).then(response => {
                this.cryptocurrency = response.body;
            });
            this.$http
                .post("http://localhost:3000/api/cryptocurrency/fetch-history", [{ idString: this.cryptocurrency.idString }])
                .then(response => {
                    this.priceHistory = response.body;
                    this.generateGraph();
            });
        },
        fetchUpdatedCryptocurrencyDetails() {
            this.$http.get(`http://localhost:3000/api/cryptocurrency/${this.$route.query.id}`).then(response => {
                this.cryptocurrency = response.body;
            });
        },
        generateGraph() {
            const ctx = document.getElementById('graph');

            const labels = [], data = [];
            const cHistory = this.priceHistory[0];
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
        }
    }
}
</script>

<style scoped>
.hero {
    padding: 50px 0;
}
.hero h1 {
    font-size: 40px;
}
.hero p {
    font-size: 18px;
}
</style>
