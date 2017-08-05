export default [
  {
      path: '/inbox/',
      component: require('./components/Inbox.vue')
  },
  {
      path: '/conversation/:id',
      component: require('./components/Chat.vue')
  }
];
