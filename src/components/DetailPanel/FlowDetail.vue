<template>
    <div :data-clazz="props.model.clazz">
        <div class="panelTitle">{{$t('sequenceFlow')}}</div>
        <div class="panelBody">
            <DefaultDetail :model="model" :onChange="onChange" :readOnly="readOnly" />
            <div class="panelRow">
                <div>{{$t('sequenceFlow.expression')}}：</div>
                <el-input style="width:90%; font-size:12px"
                          type="textarea"
                          :rows="4"
                          :disabled="readOnly"
                          v-model="model.conditionExpression"
                          @input="(value) => {onChange('conditionExpression', value)}" />
            </div>
            <div class="panelRow">
                <div>{{$t('sequenceFlow.seq')}}：</div>
                <el-input style="width:90%; font-size:12px"
                          :disabled="readOnly"
                          v-model="model.seq"
                          @input="(value) => {onChange('seq', value)}" />
            </div>
            <div class="panelRow">
                <el-checkbox @change="(value) => onChange('reverse', value)"
                             :disabled="readOnly"
                             v-model="!!model.reverse">{{$t('sequenceFlow.reverse')}}</el-checkbox>
            </div>
        </div>
    </div>
</template>
<script setup>
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
