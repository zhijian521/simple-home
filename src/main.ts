import { createApp } from 'vue'
import './style.css'
import { applyPageSeo } from './config/applySeo'
import HomeView from './views/HomeView.vue'

applyPageSeo('/')

createApp(HomeView).mount('#app')
