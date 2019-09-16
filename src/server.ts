import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as pug from 'pug';
import * as util from 'util';
import * as child_process from 'child_process';
import * as formidable from 'formidable';
import * as formidableMiddleware from 'express-formidable';
// let express = require('express');
let app: express.Application = express();
app.set('views', __dirname + '/../views');
app.set('view engine', 'pug');
// let fs = require('fs');
// let path = require('path');

app.get('/:user/:path', function (req: express.Request, res: express.Response, next: express.NextFunction): void {
  next();
}, function (req: express.Request, res:express.Response, next: express.NextFunction): void {
  const file: string = path.join(process.cwd(), 'Users', req.params.user, req.params.path);
  fs.readFile(file, function (err: never, data: any): void {
    res.render('details', {user: req.params.user, file: {name: req.params.path, ...specialCharCount(data)}});
  });
});

app.get('/:user', function(req: express.Request, res: express.Response, next: express.NextFunction): void {
  // let listFiles = pug.renderFile('listFiles');
  // res.write(listFiles);
  if (req.params.user === 'newuser') {
    if (req.query.err != undefined) return res.render('createAccount', { err: req.query.err });
    else return res.render('createAccount');
  }
  next();
}, function (req: express.Request, res: express.Response, next: express.NextFunction): void {
  let userDir = path.join(process.cwd(), 'Users', req.params.user);
  fs.readdir(userDir, function (err: never, files: any){
    if (files === undefined) files = [];
    res.render('listFiles', { user: req.params.user, files: files });
  });
});

app.get('/', function(req: express.Request, res: express.Response, next: express.NextFunction): void {
  // let loginPage = pug.renderFile('index');
  // res.end(loginPage);
  if (req.query.err != undefined) res.render('index', { err: req.query.err });
  else res.render('index');
});

app.use(express.urlencoded());
app.use(express.json());
app.post('/', function(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const credFile: string = path.join(__dirname, '../Users/credentials.json');
  // const config = require('./config.json');
  fs.readFile(credFile, function (err: never, data: any): void | undefined {
    data = data.toString();
    let users = JSON.parse(data);
    if (users[req.body.user.name] == undefined) {
      // res.end("<h1>Invalid User</h1>");
      // child_process.execSync("sleep 5");
      return res.redirect('/?err=Username');
    }
    if (users[req.body.user.name] == req.body.user.password) {
      return res.redirect('/' + req.body.user.name);
    } else {
      // res.write("Invalid Password");
      // child_process.execSync("sleep 5");
      return res.redirect('/?err=Password');
    }
  });
  // res.end(util.inspect(req));
});

app.post('/newuser', function(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const credFile: string = path.join(__dirname, '../Users/credentials.json');
  let data: any = fs.readFileSync(credFile);
  data = data.toString();
  let users = JSON.parse(data);
  if (users[req.body.user.name] != undefined) {
    res.redirect('/newuser/?err=Username');
    next('route');
  } else if (req.body.user.password && req.body.user.password != req.body.user.confirm_password) {
    res.redirect('/newuser/?err=Password');
    next('route');
  } else {
    users[req.body.user.name] = req.body.user.password;
    data = JSON.stringify(users);
    fs.writeFile(credFile, data, {encoding: 'utf8', flag:'w'}, function (err: never) : void{
      if (err) console.error(err);
      fs.mkdirSync("Users/" + users[req.body.user.name]);
      return res.redirect('/');
    });
  }
});

app.use(formidableMiddleware());
app.post('/:user/upload', function(req: express.Request, res: express.Response, next: express.NextFunction): void {
  fs.rename(req.files.browse.path, process.cwd() + '/Users/' + req.params.user + '/' + req.files.browse.name, function(err) {
    if (err) console.error(err);
  });
  return res.redirect(`/${req.params.user}`);
});
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction): void {
  console.error(err.stack);
  res.status(500).end(err.message);
});

let port: number = Number(process.argv[2]) | 8000;
app.listen(port,
  (): void => console.log(`app listening on port ${port}`)
);

function specialCharCount(data: any): Object {
  const re = /[^a-zA-Z0-9\s]/g;
  data = data.toString();
  console.log(data.match(re));
  const details = {
    'specialChars': data.match(re).length,
    'noOfChars': data.length
  };
  return details;
  // let str = data.match(re);
  // return data.length - data.match(re).length;
  // return data.length - ((data || '').match(re) || []).length;
}

function header(req: express.Request, res: express.Response): void {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("Hi User, <br /> Welcome to my site");
  res.write("<br />");
  res.write("User: " + req.params.user);
  res.write("<br />");
  res.write("path: " + req.params.path);
  res.write("<br />");
}
