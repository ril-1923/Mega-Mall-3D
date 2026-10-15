import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig
({base:'/Mega-Mall-3D/',
    plugins:[react()],build:{chunkSizeWarningLimit:2000}})
