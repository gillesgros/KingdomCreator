<template>
  <div class="static-card" :class="{isVertical: isVertical}">
    <img class="static-card__img" :src="cardImageUrl" :key="cardImageUrl" @error="incaseofError"/>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class StaticCardComponent extends Vue {
  @Prop() readonly cardImageUrl!: string | null;
  @Prop() readonly isVertical!: boolean;
  
  incaseofError(ev:any) {
    if (ev.target.imgUrl == undefined) {
      let imgsrc =ev.target.src;
      let indextoInsert = imgsrc.lastIndexOf('/');
      console.log("error loading " + imgsrc + " - loading " +imgsrc.slice(0,indextoInsert-1)+ imgsrc.slice(indextoInsert))
      ev.target.imgUrl = imgsrc.slice(0,indextoInsert-1)+ imgsrc.slice(indextoInsert);
      ev.target.src = ev.target.imgUrl
    }
  }
  
}
Vue.component("static-card-component", StaticCardComponent);
</script>

<style>
.static-card,
.static-card__img {
  height: 100%;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>