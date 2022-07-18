<template>
    <div :data-clazz="props.model.clazz">
        <div class="panelTitle">{{$t('startEvent')}}</div>
        <div class="panelBody">
            <DefaultDetail :model="props.model" :onChange="props.onChange" :readOnly="props.readOnly" />
        </div>
    </div>
</template>
<script setup>
  import DefaultDetail from "./DefaultDetail.vue";
  import {defineProps} from "vue";
  const props = defineProps({
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
  },)
</script>
