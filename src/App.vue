<template>
    <div class="container-fluid">
        <div id="page">
            <SelectLocale />
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s
}

.fade-enter,
.fade-leave-active {
    opacity: 0
}
</style>

<script>
import SelectLocale from './assets/js/components/SelectLocale.vue'

export default {
    components: {
        SelectLocale
    },
    data() {
        return {

        }
    }
}
</script>
