<template>
  <div v-if="items.length">
      <div :v-if="title==''" class="preset-kingdom__addon-title"">{{title}}</div> 
      <grid-layout-component
        v-if="items.length"
        :items="items"
        :number-of-columns="genericNbColumns"
        :is-vertical="isVertical"
      >
        <template v-slot:default="slotProps">
          <static-card-with-set-component
            :card="slotProps.item"
            :is-vertical="false"
          />
        </template>
      </grid-layout-component>
  </div>
</template>

<script lang="ts">
import GridLayoutComponent from "./grid-layout.vue";
import StaticCardWithSetComponent from "./static-card-with-set.vue";

//import { Cards } from "../utils/cards";
import { Vue, Component, Prop } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
export default class GenericLayoutComponent extends Vue {
  constructor() {
    super({
      components: {
        "grid-layout-component": GridLayoutComponent,
        "static-card-with-set-component": StaticCardWithSetComponent,
      }
    });
  }
  //@State(state => state.randomizer.kingdom) readonly kingdom!: [];
  @State(state => state.window.width) readonly windowWidth!: number;
  @State(state => state.window.isEnlarged) readonly isEnlarged!: boolean;
  @Prop() readonly items!: any[];
  @Prop() readonly genericNbColumns!: number;
  @Prop() readonly isVertical!: boolean;
  @Prop() readonly shape!: string;
  @Prop() readonly title!: string;
  
}
Vue.component("generic-layout-component", GenericLayoutComponent);
</script>

<style>
.boons-header {
  margin: 10px 0 0;
  font-size: 20px;
}
</style>
