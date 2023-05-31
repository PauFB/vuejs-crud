import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: 'en',
    messages: {
        en: {
            "All_cryptocurrencies": "All cryptocurrencies",
            "Style": "Style",
            "Grid": "Grid",
            "Table": "Table",
            "Sort_by": "Sort by",
            "Default_sorting": "Default sorting",
            "low_to_high": "low to high",
            "high_to_low": "high to low",
            "Cart": "Cart",
            "Price": "Price",
            "Add_to_cart": "Add to cart",
            "Name": "Name",
            "Price_timestamp": "Price timestamp",
            "Description": "Description",
            "Quantity": "Quantity",
            "Price_per_unit": "Price per unit",
            "Cart_is_empty": "Cart is empty",
            "Cart_total": "Cart total",
            "Purchase_summary": "Purchase summary",
            "Back": "Back",
            "ID_string": "ID string"
        },
        ca: {
            "All_cryptocurrencies": "Totes les criptomonedes",
            "Style": "Estil",
            "Grid": "Quadrícula",
            "Table": "Taula",
            "Sort_by": "Ordenar per",
            "Default_sorting": "Ordre predeterminat",
            "low_to_high": "baix a alt",
            "high_to_low": "alt a baix",
            "Cart": "Carro",
            "Price": "Preu",
            "Add_to_cart": "Afegir al carro",
            "Name": "Nom",
            "Price_timestamp": "Temps del preu",
            "Description": "Descripció",
            "Quantity": "Quantitat",
            "Price_per_unit": "Preu per unitat",
            "Cart_is_empty": "Carro buit",
            "Cart_total": "Total del carro",
            "Purchase_summary": "Resum de compra",
            "Back": "Endarrere",
            "ID_string": "ID cadena"
        }
    },
});

export default i18n;