<template>
    <div id="delete-cryptocurrency">
        <h1>Delete Cryptocurrency {{ cryptocurrency.name }}</h1>

        <p><router-link :to="{ name: 'all_cryptocurrencies' }">Return to cryptocurrencies</router-link></p>

        <notification v-bind:notifications="notifications"></notification>

        <form v-on:submit.prevent="deleteCryptocurrency">
            <p><button class="btn btn-danger">Delete Cryptocurrency</button></p>
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

            deleteCryptocurrency: function()
            {
                this.$http.delete('http://localhost:3000/api/cryptocurrency/delete/' + this.$route.params.id, this.cryptocurrency, {
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                }).then((response) => {
                    this.$router.push({name: 'all_cryptocurrencies'})
                }, (response) => {
                    this.notifications.push({
                        type: 'danger',
                        message: 'Cryptocurrency could not deleted'
                    });
                });
            }
        },

        components: {
            'notification' : Notification
        }
    }
</script>
