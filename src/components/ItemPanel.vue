<template>
    <div class="itemPanel" :style="{'height': props.height+'px'}">
        <el-collapse v-model="activeNames"  style="width: 100%">
            <el-collapse-item  :title="$t('start')" name="1">
                <img data-item="{clazz:'start',size:'30*30',label:''}"
                     :src="getUrl('../assets/flow/start.svg')" style="width:42px;height:42px" />
                <div>{{$t('startEvent')}}</div>
              <img data-item="{clazz:'end',size:'30*30',label:''}"
                   :src="getUrl('../assets/flow/end.svg')" style="width:42px;height:42px" />
              <div>{{$t('endEvent')}}</div>
                <img :data-item="userTaskData"
                     :src="getUrl('../assets/flow/user-task.svg')" style="width:80px;height:44px" />
                <div>{{$t('userTask')}}</div>
                <img :data-item="receiveTaskData"
                     :src="getUrl('../assets/flow/receive-task.svg')" style="width:80px;height:44px" />
                <div>{{$t('receiveTask')}}</div>
            </el-collapse-item>
            <el-collapse-item  :title="$t('gateway')" name="3">
                <img data-item="{clazz:'exclusiveGateway',size:'40*40',label:''}"
                     :src="getUrl('../assets/flow/exclusive-gateway.svg')" style="width:48px;height:48px" />
                <div>{{$t('exclusiveGateway')}}</div>
                <img data-item="{clazz:'parallelGateway',size:'40*40',label:''}"
                     :src="getUrl('../assets/flow/parallel-gateway.svg')" style="width:48px;height:48px" />
                <div>{{$t('parallelGateway')}}</div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script setup>
import {reactive,toRefs} from "vue";
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps({
  height: {
    type: Number,
    default: 800,
  },
})
const getUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href
}
const state = reactive({
  activeNames: [],
  userTaskData: "{clazz:'userTask',size:'80*44',label:'"+t('userTask')+"'}",
  receiveTaskData: "{clazz:'receiveTask',size:'80*44',label:'"+t('receiveTask')+"'}",
})
const {userTaskData,receiveTaskData} = toRefs(state)
</script>

<style lang="less" scoped>
.itemPanel {
  float: left;
  width: 100%;
  background: #f0f2f5;
  overflow-y: auto;
  border-left: 1px solid #E9E9E9;
  border-bottom: 1px solid #E9E9E9;
  img{
    width: 92px;
    height: 96px;
    padding: 4px;
    border: 1px solid rgba(0,0,0,0);
    border-radius: 2px;
    &:hover{
      border: 1px solid #ccc;
      cursor: move;
    }
  }
  ::v-deep .el-collapse {
    border: 0;
    .el-collapse-item {
      > div[role=tab] > div {
        padding-left: 10px;
        border: 1px solid #E9E9E9;
        border-left:0;
      }
      &:first-child{
        > div[role=tab] > div {
          border-top: 0;
        }
      }
      &:last-child{
        > div[role=tab] > div {
          border-bottom: 1px solid #E9E9E9;
        }
      }
      .el-collapse-item__wrap{
        border-top: 0;
        background: #f0f2f5;
        text-align: center;
      }
    }
  }

}
</style>
