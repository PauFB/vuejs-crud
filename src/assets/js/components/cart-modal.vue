<template>
    <b-modal id="cartModal" title="Cart" @shown="onModalShown()">
        <div v-if="cartCryptocurrencies.length === 0">
            <p class="text-center">{{ $t('Cart_is_empty') }}</p>
        </div>
        <div v-if="cartCryptocurrencies.length > 0">
            <table class="table table-cart">
                <thead>
                    <tr>
                        <td>{{ $t('Name') }}</td>
                        <td>{{ $t('Quantity') }}</td>
                        <td>{{ $t('Price_per_unit') }}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(c, index) in cartCryptocurrencies" :key="c.id" style="vertical-align: middle;">
                        <td>{{ c.name }}</td>
                        <td style="width:120px; height: 30px;">
                            <input v-model="c.qty" class="form-control" type="number" min="0">
                        </td>
                        <td>{{ c.price | toCurrency }}</td>
                        <td>
                            <button type="button" class="btn btn-danger" @click="removeItem(index)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <b-row align-h="center" align-v="center">
                <b-col class="text-center">
                    <div id="paypal-button-container"></div>
                </b-col>
                <b-col class="text-center">
                    {{ $t('Cart_total') }}: {{ totalAmountToPay | toCurrency }}
                </b-col>
            </b-row>
        </div>
        <div v-if="purchaseSuccessfulBody" class="alert alert-success" role="alert">
            <h5 class="alert-heading text-center">{{ $t('Purchase_summary') }}</h5>
            <table class="table table-cart">
                <thead>
                    <td>{{ $t('Name') }}</td>
                    <td>{{ $t('Quantity') }}</td>
                    <td>{{ $t('Price_per_unit') }}</td>
                </thead>
                <tbody>
                    <tr v-for="c in purchaseSuccessfulBody">
                        <td>{{ c.name }}</td>
                        <td>{{ c.price | toCurrency }}</td>
                        <td>{{ c.qty }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </b-modal>
</template>

<script>
import axios from 'axios';

export default {
    props: ['cartCryptocurrencies'],

    data() {
        return {
            purchaseSuccessfulBody: null
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

    computed: {
        totalAmountToPay() {
            let total = 0;
            this.cartCryptocurrencies.forEach(c => total += c.price * c.qty);
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: false
            });
            return parseFloat(formatter.format(total));
        }
    },

    mounted() {
        this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
            this.purchaseSuccessfulBody = null;
        });
        this.$root.$on('eraseCartCryptocurrencies', () => {
            this.cartCryptocurrencies = [];
        });
    },

    methods: {
        requestPaymentExecution(body) {
            return new Promise((resolve, reject) => {
                axios
                    .post('http://localhost:3000/api/process-payment', body)
                    .then(res => {
                        this.purchaseSuccessfulBody = res.data;
                        this.$root.$emit('eraseCartCryptocurrencies');
                        return resolve()
                    })
                    .catch(err => {
                        return reject(err)
                    });
            })
        },
        onModalShown() {
            const totalAmountToPay = this.totalAmountToPay;
            let payment = (data, actions) => {
                return actions.payment.create({
                    payment: {
                        transactions: [
                            {
                                amount: {
                                    total: totalAmountToPay,
                                    currency: 'EUR'
                                }
                            }
                        ]
                    }
                });
            }
            let onAuthorize = (data) => {
                this.requestPaymentExecution({data: data, cartCryptocurrencies: this.cartCryptocurrencies});
            }
            paypal.Button.render({
                env: 'sandbox',
                client: {
                    sandbox: process.env.VUE_APP_CLIENT_ID
                },
                commit: true,
                payment,
                onAuthorize
            }, '#paypal-button-container');
        },
        removeItem(index) {
            this.cartCryptocurrencies.splice(index, 1)
        }
    }
};
</script>
