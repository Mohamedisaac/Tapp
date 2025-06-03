import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig({
    plugins: [react()],
    base: "/Tapp/",    
});
