import { createApp } from 'vue'
import './styles/global.css'
import { applyPageSeo } from './config/applySeo'
import HomeView from './views/HomeView.vue'

applyPageSeo('/')

createApp(HomeView).mount('#app')
