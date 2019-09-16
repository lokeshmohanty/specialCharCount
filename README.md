`## Commands 

### Commands used

  ```
    npm init

    npm install --save express 
    npm install --save express-formidable
    npm install --save pug

    npm install --save-dev typescript
    npm install --save-dev eslint
    npm install --save-dev ts-node-dev

    npm i -D @types/node @types/express @types/pug @types/express-formidable

    sudo npm install pug-cli -g
  ```

  - Publish
  ```
    npm publish
    npm version <version number>
    npm dist-tag add <pkg-name>@<version> <tag>
  ```

### Troubleshooting

#### If `npm run dev` returns `Error: ENOSPC: System limit for number of file watchers reached` run 
  ```
    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
  ```
