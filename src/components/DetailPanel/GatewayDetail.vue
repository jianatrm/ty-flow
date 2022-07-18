<template>
    <div :data-clazz="model.clazz">
        <div class="panelTitle">{{model.clazz === 'exclusiveGateway' || model.clazz === 'gateway' ? i18n['exclusiveGateway']
            : model.clazz === 'parallelGateway' ? $t('parallelGateway') : $t('inclusiveGateway')}}</div>
        <div class="panelBody">
            <DefaultDetail :model="model" :onChange="onChange" :readOnly="readOnly" />
        </div>
    </div>
</template>
<script setup>
import {defineProps} from 'vue'
  import DefaultDetail from "./DefaultDetail.vue";
  const  props = defineProps({
    model: {
      type:Object,
      default: ()=>({}),
    },
    onChange: {
      type: Function,
      default: ()=>{}
    },
    readOnly:{
      type: Boolean,
      default: false,
    }
  })
</script>
