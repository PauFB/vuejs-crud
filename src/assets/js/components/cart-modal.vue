<script>
export default {
    name: 'Modal',
    props: ['displayedCryptocurrencies'],
    computed: {
        totalAmountToPay() {
            let total = 0;
            this.displayedCryptocurrencies.forEach(element => total += element.price * element.qty);
            return total;
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        removeItem(index){
            this.displayedCryptocurrencies.splice(index, 1)
        },
    },
};
</script>

<template>
    <div class="modal fade in modal-active">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" @click="$emit('close')" class="close"><span>&times;</span></button>
                    <h4 class="modal-title">
                        Cryptocurrencies cart.
                    </h4>
                </div>
                <div class="modal-body">
                    <table class="table table-cart">
                        <tr v-for="(c, index) in displayedCryptocurrencies" :key="c.id">
                            <td>{{ c.name }}</td>
                            <td style="width:120px; height: 30px;">QTY:
                                <input v-model="c.qty" class="form-control input-qty" type="number" min="1">
                           </td>
                            <td class="text-right">{{ c.price }}</td>
                            <td>
                              <button @click="removeItem(index)"><span class="glyphicon glyphicon-trash"></span></button>
                           </td>
                        </tr>
                        <tr v-show="displayedCryptocurrencies.length === 0">
                           <td colspan="4" class="text-center">Cart is empty</td>
                        </tr>
                    </table>
                <div class="modal-footer" v-show="displayedCryptocurrencies.length > 0">
                    <p class="text-right">Cart Total: {{ totalAmountToPay }}</p>
                </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" @click="$emit('close')">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.modal-active {
    display: block;
}
</style>