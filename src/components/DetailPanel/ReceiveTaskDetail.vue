<template>
    <div :data-clazz="props.model.clazz">
        <div class="panelTitle">{{$t('receiveTask')}}</div>
        <div class="panelBody">
            <DefaultDetail :model="props.model" :onChange="props.onChange" :readOnly="props.readOnly" />
            <div class="panelRow">
                <div>{{$t('receiveTask.waitState')}}：</div>
                <el-input style="width:90%; font-size:12px"
                          :disabled="props.readOnly"
                          v-model="props.model.waitState"
                          @input="(value) => {props.onChange('waitState', value)}" />
            </div>
            <div class="panelRow">
                <div>{{$t('receiveTask.stateValue')}}：</div>
                <el-input style="width:90%; font-size:12px"
                          :disabled="props.readOnly"
                          v-model="props.model.stateValue"
                          @input="(value) => {props.onChange('stateValue', value)}" />
            </div>
        </div>
    </div>
</template>
<script setup>
  import DefaultDetail from "./DefaultDetail.vue";
 const props =  defineProps({
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
