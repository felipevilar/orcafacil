<template>
  <v-container class="fixed-table">
    <!-- --------------------------------TABLE LIST------------------------------------->
    <v-data-table
      class="tableit"
      :headers="_headers"
      :items="desserts"
      :show-expand="!printable"
      calculate-widths
      hide-default-footer
      disable-pagination
      no-data-text="Adicione Produtos para Começar..."
      dense
      dark
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-divider horizontal class="my-3" />
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td style="width: 150px">
                    <v-icon left color="red accent-1">mdi-cash-remove</v-icon
                    >Custo (Und)
                  </td>
                  <td>
                    {{
                      formatter.format(
                        sumItemCost(
                          convertToNumber(item.buyPrice),
                          convertToNumber(item.taxes),
                          item.taxesInPercent
                        )
                      )
                    }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider horizontal class="my-1" />
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td style="width: 150px">
                    <v-icon left color="green accent-1">mdi-cash-plus</v-icon
                    >Lucro (Und)
                  </td>
                  <td style="width: 130px">
                    {{
                      calcProfit(
                        convertToNumber(item.buyPrice),
                        convertToNumber(item.sellPrice),
                        convertToNumber(item.taxes),
                        item.taxesInPercent,
                        true,
                        convertToNumber(item.discount)
                      )
                    }}
                  </td>
                  <td>
                    {{
                      calcProfit(
                        convertToNumber(item.buyPrice),
                        convertToNumber(item.sellPrice),
                        convertToNumber(item.taxes),
                        item.taxesInPercent,
                        false,
                        convertToNumber(item.discount)
                      )
                    }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider horizontal class="my-3" />
        </td>
      </template>

      <template v-slot:[`item.name`]="{ item }">
        <div class="big-col">{{ item.name }}</div>
      </template>

      <template v-slot:[`item.model`]="{ item }">
        <div class="small-col">{{ item.model }}</div>
      </template>

      <template v-slot:[`item.brand`]="{ item }">
        <div class="small-col">{{ item.brand }}</div>
      </template>

      <template v-slot:[`item.desc`]="{ item }">
        <div class="big-col">{{ item.desc }}</div>
      </template>

      <template v-slot:[`item.qtd`]="{ item }">
        <div class="small-input">
          <v-text-field
            v-model.number="item.qtd"
            dense
            outlined
            type="number"
          />
        </div>
      </template>

      <template v-slot:[`item.sellPrice`]="{ item }">
        <div class="medium-input">
          <v-text-field
            v-money="money"
            v-model="item.sellPrice"
            dense
            outlined
            prefix="R$"
          />
        </div>
      </template>

      <template v-slot:[`item.discount`]="{ item }">
        <div class="medium-input">
          <v-text-field
            v-money="money"
            v-model="item.discount"
            dense
            outlined
            prefix="R$"
          />
        </div>
      </template>

      <template v-slot:[`item.total`]="{ item }">
        {{
          formatter.format(
            item.qtd *
              (convertToNumber(item.sellPrice) - convertToNumber(item.discount))
          )
        }}
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="deep-orange accent" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
        <v-dialog
          v-model="dialogDelete"
          max-width="500px"
          :retain-focus="false"
        >
          <v-card>
            <v-card-title class="headline"
              >Quer mesmo deletar este item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm(item)"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <template slot="footer">
        <v-divider horizontal class="py-2" />
        <td :colspan="headers.length + 1" v-show="this.desserts.length > 0">
          <v-divider horizontal class="py-2 warning" />
          <v-simple-table dark>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td><v-icon left color="warning">mdi-cart</v-icon>Total</td>
                  <td>{{ formatter.format(sumTotal()) }}</td>
                  <td></td>
                </tr>
                <tr v-show="!printable">
                  <td>
                    <v-icon left color="green accent-1">mdi-cash</v-icon>Lucro
                    Total
                  </td>
                  <td>
                    {{
                      formatter.format(
                        sumProfit("sellPrice", "buyPrice", "discount", "qtd")
                      )
                    }}
                  </td>
                  <td>{{ formatterNum.format(sumProfitPercent()) }}%</td>
                </tr>
                <tr v-show="!printable">
                  <td>
                    <v-icon left color="red accent-1">mdi-cash-remove</v-icon
                    >Custo Total
                  </td>
                  <td>{{ formatter.format(sumCost()) }}</td>
                  <td></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </td>
      </template>
    </v-data-table>
    <v-row>
      <v-col cols="12">
        <v-btn class="my-4 mr-4" color="success" @click="printIt()"
          >Salvar & Preparar Impressão</v-btn
        >
        <v-btn class="my-4" color="info" @click="saveIt()">Salvar</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import {
  calcProfit,
  convertToNumber,
  formatter,
  formatterNum,
} from "@/util/calculations.js";

export default {
  name: "Table",
  props: ["desserts"],
  data() {
    return {
      formatter,
      formatterNum,
      totalCount: 0,
      money: {
        decimal: ",",
        thousands: "",
        prefix: "",
        suffix: "",
        precision: 2,
        masked: false /* doesn't work with directive */,
      },
      printable: false,
      btnPrint: true,
      dialogDelete: false,
      headers: [
        { text: "Nome", value: "name" },
        { text: "Modelo", value: "model" },
        { text: "Marca", value: "brand" },
        { text: "Descrição", value: "desc" },
        { text: "Quantidade", value: "qtd" },
        { text: "Preço", value: "sellPrice" },
        { text: "Desconto", value: "discount" },
        { text: "Total", value: "total" },
        { text: "Ações", value: "actions" },
      ],
      editedIndex: -1,
    };
  },
  computed: {
    includedIds() {
      return this.desserts.map((el) => el.id);
    },
    _headers() {
      if (this.printable) {
        return this.headers.filter(
          (x) => x.text !== "Custo" && x.text !== "Ações"
        );
      }
      return this.headers;
    },
  },
  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    convertToNumber,
    calcProfit,
    saveIt() {
      if (this.desserts.length !== 0) {
        localStorage.setItem("desserts", JSON.stringify(this.desserts));
      }
    },
    printIt() {
      if (this.desserts.length !== 0) {
        this.saveIt();
        this.$router.push({
          name: "PrintTable",
          params: { desserts: this.desserts, total: this.totalCount },
        });
      }
    },
    sumTotal(key, qtd) {
      let total = 0;
      for (let i = 0; i < this.desserts.length; i++) {
        let el = this.desserts[i];
        total +=
          el.qtd *
          (convertToNumber(el.sellPrice) - convertToNumber(el.discount));
      }

      this.totalCount = total;
      return total;
    },
    sumItemCost(buyPrice, taxes, isPercent) {
      // sum data in give key (property)
      if (isPercent) {
        return buyPrice + (taxes / 100) * buyPrice;
      }

      return buyPrice + taxes;
    },
    sumCost() {
      // sum data in give key (property)
      return (
        this.desserts.reduce(
          (a, b) =>
            a +
            this.sumItemCost(
              convertToNumber(b["buyPrice"]),
              convertToNumber(b["taxes"]),
              b.taxesInPercent
            ),
          0
        ) || 0
      );
    },
    sumProfit() {
      // sum data in give key (property)
      let profit = 0;
      for (let i = 0; i < this.desserts.length; i++) {
        profit += calcProfit(
          convertToNumber(this.desserts[i].buyPrice),
          convertToNumber(this.desserts[i].sellPrice),
          convertToNumber(this.desserts[i].taxes),
          this.desserts[i].taxesInPercent,
          true,
          convertToNumber(this.desserts[i].discount),
          false
        );
      }

      return profit;
    },
    sumProfitPercent() {
      let costs = this.sumCost();
      let profit = this.sumProfit();
      return (profit / costs) * 100;
    },
    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
      });
    },
    deleteItemConfirm(item) {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },
  },
  mounted() {
    let desserts = localStorage.getItem("desserts");
    if (desserts) {
      if (!this.items) {
        this.$emit("updateitems", desserts);
      }
    }
  },
};
</script>
<style lang="scss">
.theme--dark.v-data-table tbody tr:nth-of-type(even) {
  background-color: rgb(51, 51, 51);
}
.theme--dark.v-data-table tbody tr:nth-of-type(odd) {
  background-color: rgb(59, 59, 59);
}
.big-col {
  max-width: 300px;
  overflow: hidden;
  word-break: break-all;
  padding: 8px;
  text-overflow: ellipsis;
}
.small-col {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.small-input {
  margin-top: 15px;
  max-width: 65px;
}
.medium-input {
  margin-top: 15px;
  max-width: 115px;
}
.fixed-table {
  max-width: 1310px !important;
  margin: 0 auto;
}
.tableit {
  padding: 8px;
  border: 3px solid rgb(70, 70, 70);
}
.mdi-chevron-down {
  background-color: rgb(122, 122, 122);
  border-radius: 18px;

  &:hover {
    background-color: rgb(47, 47, 47);
  }
}
@media print {
  .no-print {
    display: none;
  }
}
</style>