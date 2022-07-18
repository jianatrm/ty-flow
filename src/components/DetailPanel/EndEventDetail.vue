<template>
    <div :data-clazz="model.clazz">
        <div class="panelTitle">{{$t('endEvent')}}</div>
        <div class="panelBody">
            <DefaultDetail :model="model" :onChange="onChange" :readOnly="readOnly" />
        </div>
    </div>
</template>
<script>
  import {defineProps} from 'vue'
  import DefaultDetail from "./DefaultDetail.vue";
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
  })
</script>
