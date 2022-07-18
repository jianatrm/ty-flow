<template>
    <div>
        <div class="panelRow">
            <div>{{$t('label')}}：</div>
            <el-input style="width:90%; font-size:12px"
                      :disabled="props.readOnly"
                      :value="props.model.label"
                      @input="(value) => {props.onChange('label', value)}" />
        </div>
        <div class="panelRow">
            <el-checkbox @change="(value) => props.onChange('hideIcon', value)"
                         :disabled="props.readOnly"
                         :value="!!props.model.hideIcon">{{$t('hideIcon')}}</el-checkbox>
        </div>
    </div>
</template>
<script setup>
import {defineProps} from 'vue'
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
