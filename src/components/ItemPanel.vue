<template>
    <div class="itemPanel" :style="{'height': props.height+'px'}">
        <div  class="el-collapse-item">
            <div class="el-collapse-item__wrap" :title="$t('start')" name="1">
                <img data-item="{clazz:'start',size:'30*30',label:''}"
                     :src="getUrl('../assets/flow/start.svg')" style="width:42px;height:42px" />
                <div>{{$t('startEvent')}}</div>
<!--                <img data-item="{clazz:'timerStart',size:'30*30',label:''}"-->
<!--                     :src="getUrl('../assets/flow/timer-start.svg')" style="width:42px;height:42px" />-->
<!--                <div>{{$t('timerEvent')}}</div>-->
<!--                <img data-item="{clazz:'messageStart',size:'30*30',label:''}"-->
<!--                     :src="getUrl('../assets/flow/message-start.svg')" style="width:42px;height:42px" />-->
<!--                <div>{{$t['messageEvent']}}</div>-->
<!--                <img data-item="{clazz:'signalStart',size:'30*30',label:''}"-->
<!--                     :src="getUrl('../assets/flow/signal-start.svg')" style="width:42px;height:42px" />-->
<!--                <div>{{$t['signalEvent']}}</div>-->
              <img data-item="{clazz:'end',size:'30*30',label:''}"
                   :src="getUrl('../assets/flow/end.svg')" style="width:42px;height:42px" />
              <div>{{$t('endEvent')}}</div>
            </div>
            <div class="el-collapse-item__wrap" :title="$t['task']" name="2">
                <img :data-item="userTaskData"
                     :src="getUrl('../assets/flow/user-task.svg')" style="width:80px;height:44px" />
                <div>{{$t('userTask')}}</div>
<!--                <img :data-item="scriptTaskData"-->
<!--                     :src="getUrl('../assets/flow/script-task.svg')" style="width:80px;height:44px" />-->
<!--                <div>{{$t['scriptTask']}}</div>-->
<!--                <img :data-item="javaTaskData"-->
<!--                     :src="getUrl('../assets/flow/java-task.svg')" style="width:80px;height:44px" />-->
<!--                <div>{{$t['javaTask']}}</div>-->
<!--                <img :data-item="mailTaskData"-->
<!--                     :src="getUrl('../assets/flow/mail-task.svg')" style="width:80px;height:44px" />-->
<!--                <div>{{$t['mailTask']}}</div>-->
                <img :data-item="receiveTaskData"
                     :src="getUrl('../assets/flow/receive-task.svg')" style="width:80px;height:44px" />
                <div>{{$t('receiveTask')}}</div>
            </div>
            <div class="el-collapse-item__wrap"  :title="$t('gateway')" name="3">
                <img data-item="{clazz:'exclusiveGateway',size:'40*40',label:''}"
                     :src="getUrl('../assets/flow/exclusive-gateway.svg')" style="width:48px;height:48px" />
                <div>{{$t('exclusiveGateway')}}</div>
                <img data-item="{clazz:'parallelGateway',size:'40*40',label:''}"
                     :src="getUrl('../assets/flow/parallel-gateway.svg')" style="width:48px;height:48px" />
                <div>{{$t('parallelGateway')}}</div>
<!--                <img data-item="{clazz:'inclusiveGateway',size:'40*40',label:''}"-->
<!--                     :src="getUrl('../assets/flow/inclusive-gateway.svg')" style="width:48px;height:48px" />-->
<!--                <div>{{$t['inclusiveGateway']}}</div>-->
            </div>
<!--            <div class="el-collapse-item__wrap"  :title="$t['catch']" name="4">-->
<!--                <img data-item="{clazz:'timerCatch',size:'50*30',label:''}"-->
<!--                     :src="getUrl('../assets/flow/timer-catch.svg')" style="width:58px;height:38px" />-->
<!--                <div>{{$t['timerEvent']}}</div>-->
<!--                <img data-item="{clazz:'messageCatch',size:'50*30',label:''}"-->
<!--                     :src="getUrl('../assets/flow/message-catch.svg')" style="width:58px;height:38px" />-->
<!--                <div>{{$t['messageEvent']}}</div>-->
<!--                <img data-item="{clazz:'signalCatch',size:'50*30',label:''}"-->
<!--                     :src="getUrl('../assets/flow/signal-catch.svg')" style="width:58px;height:38px" />-->
<!--                <div>{{$t['signalEvent']}}</div>-->
<!--            </div>-->
            <div  class="el-collapse-item__wrap"  :title="$t('end')" name="5">

            </div>
        </div>
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
  return new URL(`..//assets/${name}`, import.meta.url).href
}
const state = reactive({
  activeNames: [],
  userTaskData: "{clazz:'userTask',size:'80*44',label:'"+t['userTask']+"'}",
  scriptTaskData: "{clazz:'scriptTask',size:'80*44',label:'"+t['scriptTask']+"'}",
  javaTaskData: "{clazz:'javaTask',size:'80*44',label:'"+t['javaTask']+"'}",
  mailTaskData: "{clazz:'mailTask',size:'80*44',label:'"+t['mailTask']+"'}",
  receiveTaskData: "{clazz:'receiveTask',size:'80*44',label:'"+t['receiveTask']+"'}",
})
const {activeNames,userTaskData,scriptTaskData,javaTaskData,mailTaskData,receiveTaskData} = toRefs(state)
</script>

<style>
    .itemPanel {

        width: 100%;
        background: #f0f2f5;
        overflow-y: auto;
        border-left: 1px solid #E9E9E9;
        border-bottom: 1px solid #E9E9E9;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }
    .el-collapse-item__wrap{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
</style>
