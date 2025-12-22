module.exports = {
  apps: [
    {
      name: 'xuezhi-ai-frontend',
      script: 'pnpm',
      args: 'preview',
      cwd: '/home/ubuntu/frontend_demo',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 4173
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};