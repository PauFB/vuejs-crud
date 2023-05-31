<template>
    <div style="text-align: right;">
        <select v-model="$i18n.locale">
            <option v-for="(lang, i) in langs" :key="`lang-${i}`" :value="lang">
                {{ lang }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
    name: "SelectLocale",
    data() {
        return { langs: ["en", "ca"] };
    },
};
</script>
