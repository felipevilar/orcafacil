<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex text-area justify-center">
          <v-textarea
            solo
            rows="3"
            placeholder="NOME DA EMPRESA LTDA
  Av Paulista, 0000 São Paulo
 CNPJ: 123.456.789/0001-00
 (11) 91234-5678 - meuemail@gmail.com"
            row-height="45"
            background-color="rgb(245 245 245)"
            auto-grow
            v-model="header"
            v-show="!showHeaders"
            name="input-7-4"
            class="pa-3 no-show"
          ></v-textarea>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-checkbox
          class="pa-3 no-show"
          label="Esconder Cabeçalho"
          color="light-blue"
          v-model="showHeaders"
          dense
        >
        </v-checkbox>
      </v-col>
    </v-row>
    <v-col cols="12" class="mx-0">
      <h5 class="officalHeader show-it" v-show="!showHeaders">
        {{ this.header }}
      </h5>
    </v-col>
    <v-simple-table dark class="mx-4 fuck">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Nome</th>
            <th class="text-left">Modelo</th>
            <th class="text-left">Marca</th>
            <th class="text-left">Descrição</th>
            <th class="text-left">Quantidade</th>
            <th class="text-left">Preço (Und)</th>
            <th class="text-left">Desconto</th>
            <th class="text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in desserts" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.model || "-" }}</td>
            <td>{{ item.brand || "-" }}</td>
            <td class="big-col">{{ item.desc }}</td>
            <td>{{ item.qtd }}</td>
            <td>{{ formatter.format(convertToNumber(item.sellPrice)) }}</td>
            <td>{{ formatter.format(convertToNumber(item.discount)) }}</td>
            <td>
              {{
                formatter.format(
                  item.qtd *
                    (
                      convertToNumber(item.sellPrice) -
                      convertToNumber(item.discount)
                    ).toFixed(2)
                )
              }}
            </td>
          </tr>
          <tr>
            <td><v-icon left color="warning">mdi-cart</v-icon>Total:</td>
            <td>{{ formatter.format(total) }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import { convertToNumber, formatter } from "@/util/calculations.js";
export default {
  name: "PrintTable",
  data() {
    return {
      formatter,
      convertToNumber,
      showHeaders: false,
      header: "",
      desserts: this.$route.params.desserts,
      total: this.$route.params.total,
    };
  },
  mounted() {
    if (!this.desserts) {
      let desserts = JSON.parse(localStorage.getItem("desserts"));
      if (desserts) {
        this.desserts = desserts;
        this.total = this.sumTotal();
      }
    }
  },
  methods: {
    sumTotal() {
      let total = 0;
      for (let i = 0; i < this.desserts.length; i++) {
        let el = this.desserts[i];
        total +=
          el.qtd *
          (convertToNumber(el.sellPrice) - convertToNumber(el.discount));
      }
      return total;
    },
  },
};
</script>

<style scoped lang="scss">
.text-area {
  width: 800px;
  margin: 0 auto;
}
.big-col {
  max-width: 300px;
  max-height: 300px;
  overflow: hidden;
  word-break: break-all;
  padding: 8px;
  text-overflow: ellipsis;
}
.v-input__slot {
  box-shadow: none;
  border-radius: 0;
}

.officalHeader {
  white-space: pre-wrap;
  display: none;
  color: rgb(97, 97, 97);
  border: 1px solid rgb(230, 230, 230);
  padding: 10px;
}
@media print {
  body {
    width: 21cm;
    height: 29.7cm;
    margin: 30mm 45mm 30mm 45mm;
    /* change the margins as you want them to be. */
  }
  .no-show {
    display: none !important;
  }
  .show-it {
    display: block;
  }
}
</style>