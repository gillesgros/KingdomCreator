<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <div class="sidebar-content-title">Kingdoms</div>
      <div class="sets" v-for="set in sets" :key="set.setId">
        <div class="set">
          <label class="checkbox">
            <input type="radio" id="selectedKDSet" :value="set.setId" v-model="selectedKDSetId" />
            <span>{{ set.name }}</span>
          </label>
        </div>
      </div> <!-- sets {{ set.name }} -->
      <br>
      <div class="sets">
        <div class="set">
          <label class="checkbox">
            <input type="radio" id="selectedKDSet" value="All" v-model="selectedKDSetId" />
            <span>All recommended sets</span>
          </label>
        </div>
      </div><!-- sets All -->
      <div class="clear"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { UPDATE_SELECTED_KDSET } from "../stores/pages-store-mutation-types";
import { DominionSets } from "../dominion/dominion-sets";
import { State } from "../stores/pages-store";
import { SetId, IgnoreSetIdKingdoms } from "../dominion/set-id";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class KigndomSidebar extends Vue {
 constructor() {
    super(
    );
  }

  get sets() {
    return DominionSets.getAllSets().filter((set) => !IgnoreSetIdKingdoms.has(set.setId));
  }

  get selectedKDSetId() {
    if (!this.$storage.has("selectedKDSetId")) {
       this.$storage.set("selectedKDSetId", (this.$store.state as State).selectedKDSetId);
    }
    return (this.$store.state as State).selectedKDSetId;
  }

  set selectedKDSetId(value: SetId) {
    this.$storage.set("selectedKDSetId", value);
    this.$store.commit(UPDATE_SELECTED_KDSET, value);
  }
  
};

</script>
