## Commands 

### Basic commands

  ```
    npm init
    npm install express --save
    npm install --save-dev typescript
    npm install --save-dev eslint
    npm install --save-dev ts-node-dev
    npm i -D @types/node @types/express
  ```

### Troubleshooting

#### If `npm run dev` returns `Error: ENOSPC: System limit for number of file watchers reached` run 
  ```
    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
  ```
