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
      <div class="sets">
        <div class="set">
          <label class="checkbox">
            <input type="radio" id="selectedKDSet" value="Personal" v-model="selectedKDSetId" />
            <span>Personal sets</span>
          </label>
          <div class="js input-file-container"  v-show="show_PersonalFileSelection_Div">
            <input type="file" class="input-file"
                  id="fileInput" ref="fileInput"
                  onclick="this.value=null;" 
                  @change="SelectFile($event)" 
                  accept=".yaml"  
                  v-show="show_PersonalFileSelection_Input"/>
            <label id="my-file-label-trigger" for="fileInput" class="input-file-trigger" v-show="show_PersonalFileSelection_Input"
                  tabindex="0">Select a file...</label>
            <div id="div-file-return" class="file-return" style="background-color=blue">{{file_name}}</div>
          </div>
        </div>
      </div><!-- sets Personal -->
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
import { DominionKingdom } from "../dominion/dominion-kingdom";
import { DominionKingdoms } from "../dominion/dominion-kingdoms";

declare function  Yaml_Parsing(file_content : string) :any;

@Component
export default class KigndomSidebar extends Vue {
 constructor() {
    super(
    );
  }
  file_name= "";
  show_PersonalFileSelection_Input=false;
  
  beforeMount() {
    if (this.$storage.has("selectedKDSetId")) {
      if (!((this.$store.state as State).selectedKDSetId === this.$storage.get("selectedKDSetId")))  {
        this.$store.commit(UPDATE_SELECTED_KDSET, this.$storage.get("selectedKDSetId"));
      }
    } else {
      this.$storage.set("selectedKDSetId", (this.$store.state as State).selectedKDSetId);
    }
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
    ((value as string).toLowerCase() == "personal") 
        ? this.show_PersonalFileSelection_Input = true
        : this.show_PersonalFileSelection_Input = false;
    this.$storage.set("selectedKDSetId", value);
    this.$store.commit(UPDATE_SELECTED_KDSET, value);
  }
  
  get show_PersonalFileSelection_Div() {
    if (((this.selectedKDSetId as string) == "Personal") && (this.file_name == "")) {
      this.show_PersonalFileSelection_Input = true;
      return true;
    }
    if (this.show_PersonalFileSelection_Input) { return true; }
    if (this.file_name != "") { return true; }
    return false;
  }
  
  SelectFile(ev: any) {
    let file = ev.target.files[0];
    if (file == undefined) {
      this.file_name = ""
    } else {
      let reader = new FileReader();
      reader.onload = (e) => { 
          //this.file_content = (reader.result as string); 
          let kingdoms_object = Yaml_Parsing((reader.result as string)); 
          let kingdoms = Object.keys(kingdoms_object).map((key) => { return kingdoms_object[key] })
          let sets = kingdoms[0].map((json: any) => DominionKingdom.fromJson(json));
          DominionKingdoms.kingdoms[("Personal" as SetId)] = sets;
          /* to  request update of kigndom-list */
          this.selectedKDSetId=("personal" as SetId);
          this.selectedKDSetId=("Personal" as SetId);
       };
      reader.readAsText(file);
      this.file_name = file.name;
    }
  }
  
};

</script>

<style>

/* styles de base si JS est activé */
.js .input-file-container {
  position: relative;
  width: 225px;
}

.js .input-file-trigger {
  display: block;
  padding: 3px 22px;;
  background: #39D2B4;
  color: #fff;
  font-size: 1em;
  transition: all .4s;
  cursor: pointer;
}

.js .input-file {
  position: absolute;
  top: 0; left: 0;
  width: 225px;
  padding: 3px ;
  opacity: 0;
  cursor: pointer;
}
 
/* quelques styles d'interactions */
.js .input-file:hover + .input-file-trigger,
.js .input-file:focus + .input-file-trigger,
.js .input-file-trigger:hover {
  background: #344A5E;
  color: #39B2B4;
}

/* styles du retour visuel */
.file-return:empty {
  margin: 1.8em 0;
}

.file-return:not(:empty) {
  margin: 5px 3px;;
}

.file-return:not(:empty):before {
  content : "Selected file: ";
  font-size: 0.8em;
}

</style>
