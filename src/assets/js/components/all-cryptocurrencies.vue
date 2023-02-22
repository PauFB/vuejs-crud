<template>
    <div id="all-cryptocurrencies">
        <h1>All Cryptocurrencies</h1>

        <p><router-link :to="{ name: 'create_cryptocurrency' }" class="btn btn-primary">Create Cryptocurrency</router-link></p>

        <div class="form-group">
            <input type="text" name="search" v-model="cryptocurrencySearch" placeholder="Search cryptocurrencies" class="form-control" v-on:keyup="searchCryptocurrencies">
        </div>

        <table class="table table-hover">
            <thead>
            <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Price</td>
                <td>Price timestamp</td>
                <td>Description</td>
                <td>Actions</td>
            </tr>
            </thead>

            <tbody>
                <tr v-for="c in cryptocurrencies">
                    <td>{{ c.id }}</td>
                    <td>{{ c.name }}</td>
                    <td>{{ c.price }}</td>
                    <td>{{ c.priceTimestamp }}</td>
                    <td>{{ c.description }}</td>
                    <td>
                        <router-link :to="{name: 'edit_cryptocurrency', params: { id: c.id }}" class="btn btn-primary">Edit</router-link>
                        <router-link :to="{name: 'delete_cryptocurrency', params: { id: c.id }}" class="btn btn-danger">Delete</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

    export default{
        data(){
            return{
                cryptocurrencies: [],
                originalCryptocurrencies: [],
                cryptocurrencySearch: ''
            }
        },

        created: function()
        {
            this.fetchCryptocurrenciesData();
        },

        methods: {
            fetchCryptocurrenciesData: function()
            {
                this.$http.get('http://localhost:3000/api/cryptocurrencies').then((response) => {
                    this.cryptocurrencies = response.body;
                    this.originalCryptocurrencies = this.cryptocurrencies;
                }, (response) => {

                });
            },

            searchCryptocurrencies: function()
            {
                if(this.cryptocurrencySearch == '')
                {
                    this.cryptocurrencies = this.originalCryptocurrencies;
                    return;
                }

                var searchedCryptocurrencies = [];
                for(var i = 0; i < this.originalCryptocurrencies.length; i++)
                {
                    var cryptocurrencyName = this.originalCryptocurrencies[i]['name'].toLowerCase();
                    if(cryptocurrencyName.indexOf(this.cryptocurrencySearch.toLowerCase()) >= 0)
                    {
                        searchedCryptocurrencies.push(this.originalCryptocurrencies[i]);
                    }
                }

                this.cryptocurrencies = searchedCryptocurrencies;
            }
        }
    }
</script>
