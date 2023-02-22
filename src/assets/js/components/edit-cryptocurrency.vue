<template>
    <div id="update-cryptocurrency">
        <h1>Update Cryptocurrency</h1>

        <p><router-link :to="{ name: 'all_cryptocurrencies' }">Return to cryptocurrencies</router-link></p>

        <notification v-bind:notifications="notifications"></notification>

        <form v-on:submit.prevent="editCryptocurrency">
            <div class="form-group">
                <label name="cryptocurrency_id">ID</label>
                <input type="text" class="form-control" disabled v-model="cryptocurrency.id" id="cryptocurrency_id">
            </div>

            <div class="form-group">
                <label name="cryptocurrency_name">Name</label>
                <input type="text" class="form-control" v-model="cryptocurrency.name" id="cryptocurrency_name" required>
            </div>

            <div class="form-group">
                <label name="cryptocurrency_price">Price</label>
                <input type="text" class="form-control" v-model="cryptocurrency.price" id="cryptocurrency_price" required>
            </div>

            <div class="form-group">
                <label name="cryptocurrency_description">Description</label>
                <input type="text" class="form-control" v-model="cryptocurrency.description" id="cryptocurrency_description" required>
            </div>

            <div class="form-group">
                <button class="btn btn-primary">Update</button>
            </div>
        </form>
    </div>
</template>

<script>
    import Notification from './notifications.vue';

    export default{
        data(){
            return{
                cryptocurrency:{},
                notifications:[]
            }
        },

        created: function(){
            this.getCryptocurrency();
        },

        methods: {
            getCryptocurrency: function()
            {
                this.$http.get('http://localhost:3000/api/cryptocurrency/' + this.$route.params.id).then((response) => {
                    this.cryptocurrency = response.body;
                }, (response) => {

                });
            },

            editCryptocurrency: function()
            {
                // Validation
                var price = parseFloat(this.cryptocurrency.price);
                if(isNaN(price))
                {
                    this.notifications.push({
                        type: 'danger',
                        message: 'Price must be a number'
                    });
                    return false;
                }

                this.$http.patch('http://localhost:3000/api/cryptocurrency/edit/' + this.$route.params.id, this.cryptocurrency, {
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                }).then((response) => {
                    this.notifications.push({
                        type: 'success',
                        message: 'Cryptocurrency updated successfully'
                    });
                }, (response) => {
                    this.notifications.push({
                        type: 'error',
                        message: 'Cryptocurrency not updated'
                    });
                });
            }
        },

        components: {
            'notification' : Notification
        }
    }
</script>
