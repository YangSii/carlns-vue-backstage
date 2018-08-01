import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ConfirmPay from '@/components/ConfirmPay'
import Finished from '@/components/Finished'
import Login from '@/components/Login'
import Channel from '@/components/Channel'
import System from '@/components/System'
import CooperationAgreement from '@/components/system/CooperationAgreement'
import ShortMsgModel from '@/components/system/ShortMsgModel'
import Detail from '@/components/com/Detail'
import ToExamine from '@/components/com/ToExamine'
import PerToExamine from '@/components/com/PerToExamine'
import RetreatCenter from '@/components/RetreatCenter'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/ConfirmPay',
      name: 'ConfirmPay',
      component: ConfirmPay
    },
    {
      path: '/RetreatCenter',
      name: 'RetreatCenter',
      component: RetreatCenter
    },
    {
      path: '/Finished',
      name: 'Finished',
      component: Finished
    },
    {
      path: '/Channel',
      name: 'Channel',
      component: Channel
    },
    {
      path: '/System',
      name: 'System',
      component: System
    },
    {
      path: '/ShortMsgModel',
      name: 'ShortMsgModel',
      component: ShortMsgModel
    },
    {
      path: '/CooperationAgreement',
      name: 'CooperationAgreement',
      component: CooperationAgreement
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Detail',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/ToExamine',
      name: 'ToExamine',
      component: ToExamine
    },
    {
      path: '/PerToExamine',
      name: 'PerToExamine',
      component: PerToExamine
    }
  ]
})
