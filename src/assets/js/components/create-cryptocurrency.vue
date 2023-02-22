<template>
    <div id="create-cryptocurrency">
        <h1>Create Cryptocurrency</h1>

        <p><router-link :to="{ name: 'all_cryptocurrencies' }">Return to cryptocurrencies</router-link></p>

        <notification v-bind:notifications="notifications"></notification>

        <form v-on:submit.prevent="createCryptocurrency">
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
                <button class="btn btn-primary">Create</button>
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

        methods: {
            createCryptocurrency: function()
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
                } else {
                    this.cryptocurrency.price = this.cryptocurrency.price;
                }

                this.$http.post('http://localhost:3000/api/cryptocurrency/create', this.cryptocurrency, {
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                }).then((response) => {
                    this.notifications.push({
                        type: 'success',
                        message: 'Cryptocurrency created successfully'
                    });
                }, (response) => {
                    this.notifications.push({
                        type: 'error',
                        message: 'Cryptocurrency not created'
                    });
                });
            }
        },

        components: {
            'notification' : Notification
        }
    }
</script>
