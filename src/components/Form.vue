<template>
  <div>
    <div class="d-flex justify-center align-center ma-4">
      <img src="../assets/logo.png" width="100px" alt="" />
    </div>
    <v-form class="fixed-size pa-8 blue-grey lighten-5" ref="form" lazy-validation>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              placeholder="Nome do produto ou serviço..."
              solo
              label="Nome*"
              v-model="item.name"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="3">
            <v-text-field
              placeholder="Modelo"
              color="purple darken-2"
              solo
              label="Modelo"
              v-model="item.model"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="3">
            <v-text-field
              placeholder="Marca"
              solo
              label="Marca"
              v-model="item.brand"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              solo
              placeholder="Descrição do produto ou serviço"
              name="input-7-4"
              label="Descrição"
              v-model="item.desc"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" md="2">
            <v-text-field
              outlined
              dense
              label="Custos"
              ref="buyPrice"
              color="deep-orange"
              prefix="R$"
              v-money="money"
              v-model.lazy="item.buyPrice"
              :rules="rules"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              placeholder="Impostos"
              outlined
              dense
              label="Impostos"
              color="light-blue"
              ref="taxes"
              :rules="rules"
              v-money="money"
              :prefix="taxesInPercent ? '%' : 'R$'"
              v-model.lazy="item.taxes"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2" class="d-flex justify-center">
            <v-checkbox
              label="Impostos em %"
              color="light-blue"
              v-model="taxesInPercent"
              dense
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              placeholder="Preço de Venda"
              color="green"
              outlined
              dense
              class="bg-form2"
              ref="sellPrice"
              label="Preço de Venda"
              prefix="R$"
              v-money="money"
              v-model.lazy="item.sellPrice"
            ></v-text-field>
          </v-col>
          <v-col
            cols="4"
            md="1"
            class="d-flex flex-column justify-center align-center"
          >
            <v-icon left color="teal" size="x-large">mdi-cash-100</v-icon
            ><strong class="green--text">Lucro: </strong
            >{{ profitCurrency || "" }}
          </v-col>
          <v-col
            cols="4"
            md="1"
            class="d-flex flex-column justify-start align-center"
          >
            <v-icon left color="teal" size="x-large">mdi-percent</v-icon
            ><strong class="green--text">Lucro: </strong
            >{{ profitPercentage || "" }}
          </v-col>
          <v-col
            cols="4"
            md="1"
            class="d-flex flex-column justify-start align-center"
          >
            <v-icon left color="deep-orange" size="x-large"
              >mdi-cash-minus</v-icon
            ><strong class="deep-orange--text">Custo: </strong
            >{{ formatter.format(cost) || 0 }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn color="success" @click="save" class="mx-2">Adicionar</v-btn>
            <v-btn color="error" @click="reset">Limpar</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <Table :desserts="items" @updateitems="onUpdateItems" />
  </div>
</template>

<script>
import Table from "@/components/Table";
import { calcProfit, convertToNumber, formatter } from "@/util/calculations.js";
import { VMoney } from "v-money";

export default {
  name: "Home",
  components: { Table },
  data: () => ({
    formatter,
    taxesInPercent: true,
    money: {
      decimal: ",",
      thousands: "",
      prefix: "",
      suffix: "",
      precision: 2,
      masked: false /* doesn't work with directive */,
    },
    item: {
      taxes: 0,
      qtd: 1,
      discount: 0,
    },
    items: [],
    select: null,
  }),
  methods: {
    onUpdateItems: function(value) {
      this.items = JSON.parse(value);
    },
    reset() {
      this.$refs.sellPrice.$el.getElementsByTagName("input")[0].value = 0;
      this.$refs.buyPrice.$el.getElementsByTagName("input")[0].value = 0;
      this.$refs.taxes.$el.getElementsByTagName("input")[0].value = 0;
      this.item = {
        taxes: 0,
        qtd: 1,
        discount: 0,
      };

      this.taxesInPercent = true;
    },
    save() {
      let validation = this.$refs.form.validate();
      if (this.item.name && this.item.name.trim() != "" && this.$refs.form.validate()) {
        this.item.id = Date.now();
        this.item.taxesInPercent = this.taxesInPercent;
        this.items.push(this.item);
        this.reset();
      }
    },
  },
  computed: {
    rules() {
      const rules = [];

      const gtz = (v) => convertToNumber(v) >= 0 || "Valor inválido!";

      rules.push(gtz)

      return rules
    },
    profitCurrency() {
      return calcProfit(
        convertToNumber(this.item.buyPrice),
        convertToNumber(this.item.sellPrice),
        convertToNumber(this.item.taxes),
        this.taxesInPercent,
        true
      );
    },
    profitPercentage() {
      return calcProfit(
        convertToNumber(this.item.buyPrice),
        convertToNumber(this.item.sellPrice),
        convertToNumber(this.item.taxes),
        this.taxesInPercent,
        false
      );
    },
    cost() {
      // sum data in give key (property)
      if (this.taxesInPercent) {
        return (
          convertToNumber(this.item.buyPrice) +
          (convertToNumber(this.item.taxes) / 100) *
            convertToNumber(this.item.buyPrice)
        );
      }

      return (
        convertToNumber(this.item.buyPrice) + convertToNumber(this.item.taxes)
      );
    },
  },
};
</script>

<style lang="scss">

</style>
