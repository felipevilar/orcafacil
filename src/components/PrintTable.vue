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
      <v-col cols="12" class="d-flex justify-center no-show">
        <v-btn color="info" class="mr-3" @click="showHeaders = !showHeaders"
          >{{ showHeaders ? "Mostrar" : "Ocultar" }} Cabeçalho</v-btn
        >
        <v-btn color="success" class="mr-3" @click="print()">Imprimir</v-btn>
        <v-btn color="error" @click="$router.go(-1)">Voltar</v-btn>
      </v-col>
    </v-row>
    <v-col cols="12" :class="classObject">
      <h5 class="officalHeader show-it" v-show="!showHeaders">
        {{ this.header }}
      </h5>
    </v-col>
    <v-data-table
      dark
      class="pa-3 mx-3"
      :headers="headers"
      :items="desserts"
      hide-default-footer
    >
      <template v-slot:[`item.name`]="{ item }">
        {{ item.name }}
      </template>

      <template v-slot:[`item.model`]="{ item }">
        {{ item.model }}
      </template>

      <template v-slot:[`item.brand`]="{ item }">
        {{ item.brand }}
      </template>

      <template v-slot:[`item.desc`]="{ item }">
        <p class="textit">{{ item.desc }}</p>
      </template>

      <template v-slot:[`item.qtd`]="{ item }">
        {{ item.qtd }}
      </template>

      <template v-slot:[`item.sellPrice`]="{ item }">
        {{ formatter.format(convertToNumber(item.sellPrice)) }}
      </template>

      <template v-slot:[`item.discount`]="{ item }">
        {{ formatter.format(convertToNumber(item.discount)) }}
      </template>

      <template v-slot:[`item.total`]="{ item }">
        {{
          formatter.format(
            item.qtd *
              (convertToNumber(item.sellPrice) - convertToNumber(item.discount))
          )
        }}
      </template>

      <template slot="footer">
        <v-divider horizontal class="py-2" />
        <td>
          <v-divider horizontal class="py-2 warning" />
          <v-simple-table dark>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td><v-icon left color="warning">mdi-cart</v-icon>Total</td>
                  <td>{{ formatter.format(sumTotal()) }}</td>
                  <td></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </td>
      </template>
    </v-data-table>
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
      headers: [
        { text: "Nome", value: "name", width: "15%" },
        { text: "Modelo", value: "model", width: "7%" },
        { text: "Marca", value: "brand", width: "7%" },
        { text: "Descrição", value: "desc", width: "30%" },
        { text: "Qtd", value: "qtd", width: "3%", align: "center" },
        { text: "Preço (Und)", value: "sellPrice", width: "5%", align: "center" },
        { text: "Desconto", value: "discount", width: "5%", align: "center" },
        { text: "Total", value: "total", width: "5%", align: "center" },
      ],
      header: "",
      desserts: this.$route.params.desserts,
      total: this.$route.params.total,
    };
  },
  mounted() {
/*     if (!this.desserts) {
      let desserts = JSON.parse(localStorage.getItem("desserts"));
      if (desserts) {
        this.desserts = desserts;
        this.total = this.sumTotal();
      }
    } */
  },
  methods: {
    sumTotal() {
      if(!this.desserts) return;
      let total = 0;
      for (let i = 0; i < this.desserts.length; i++) {
        let el = this.desserts[i];
        total +=
          el.qtd *
          (convertToNumber(el.sellPrice) - convertToNumber(el.discount));
      }
      return total;
    },
    print() {
      print();
    },
  },
  computed: {
      classObject() {
          if(this.header.trim() == '') return 'no-show';
          return 'mx-0' 
      }
  }
};
</script>

<style scoped lang="scss">
.text-area {
  width: 800px;
  margin: 0 auto;
}
.teste {
  max-width: 50px !important;
  word-break: break-all;
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
.textit {
  max-height: 100px !important;
  word-break: break-all;
  margin-top: 12px;
  overflow: hidden;
  text-overflow: ellipsis !important;
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