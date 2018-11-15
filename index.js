#!/usr/bin/env node


// const chromix = require("chromix-too");
// const lodash = require("lodash");
const console = require("console");
const express = require('express');
const child_process = require("child_process");
const sqparse = require("shell-quote").parse;
const app = express();

const host = "localhost";
const port = 4038;

app.get('/', (req, res) => res.send('Hello Chelf'));

app.listen(port, host, () => console.log(`Chelf listening on ${host}:${port}!`));

// localhost:4038/do?command=echo&args=hello+world&env=DISPLAY%3d=%3a1&inherit_env=true
app.get("/_spawn/", (req, res) => {
    let result = "";
    let command = req.query.command;
    let args = sqparse(req.query.args || "");
    let options = {};
    // let inherit_env = "inherit_env" in req.query ? req.query.inherit_env === "false" : true;
    let inherit_env = req.query.inherit_env != "false";
    let env = "env" in req.query ? options.env = sqparse(req.query.env).reduce((object,envstr)=>{
        let n = envstr.indexOf("=");
        let skip = n < 0;
        if (skip) return object;
        let key = envstr.slice(0,n);
        let value = envstr.slice(n+1);
        object[key] = value;
        return object;
    },{}) : {};
    let inherited_env = inherit_env ? Object.assign({}, process.env) : {};
    if ("env" in req.query ) { options.env = inherited_env; }
    Object.assign(inherited_env, env);
    let datched = "datched" in req.query ? options.datched = Boolean(req.query.datched) : "(UNDEFINED)";
    let cwd = "cwd" in req.query ? options.cwd = Boolean(req.query.cwd) : "(UNDEFINED)";
    let argv0 = "argv0" in req.query ? options.argv0 = Boolean(req.query.argv0) : "(UNDEFINED)";

    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.setHeader('transfer-encoding', 'chunked');
    result += "command: " + JSON.stringify(command) + "\n";
    result += "args: " + JSON.stringify(args) + "\n";
    result += "env: " + JSON.stringify(env) + "\n";
    result += "inherit_env: " + JSON.stringify(inherit_env) + "\n";
    result += "cwd: " + JSON.stringify(cwd) + "\n";
    result += "argv0: " + JSON.stringify(argv0) + "\n";
    result += "options: " + JSON.stringify(options) + "\n";
    res.send(result);
    res.end();
});

app.get("/chromix-too/", (req, res) => {
    res.end();
});

app.get("/find-root/", (req, res) => {
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.setHeader('transfer-encoding', 'chunked');
    let command = "find";
    let args = ["/"];
    let p = child_process.spawn(command, args);
    var counter = 0;
    p.on("exit", function(code) {
        // console.log("process exit");
        res.end();
    });
    p.on("error", function(code) {
        // console.log("process error");
        res.end();
    });
    res.on("close", function(data) {
        // console.log("response close");
        p.kill();
    });
    p.stdout.on("data", function(data) {
        res.write(data);
        ++counter;
        // console.log(counter);
        // process.stdout.write(data);
    });
    p.stdout.on("end", function(){
        res.end();
    });
    p.stderr.on("data", function(data) {
        res.write(data);
        // process.stderr.write(data);
    });
    p.stderr.on("end", function(){
        res.end();
    });
});

app.get("/spawn/", (req, res) => {
    let result = "";
    let command = req.query.command;
    let args = sqparse(req.query.args || "");
    let options = {};
    let inherit_env = req.query.inherit_env != "false";
    let env = "env" in req.query ? options.env = sqparse(req.query.env).reduce((object,envstr)=>{
        let n = envstr.indexOf("=");
        let skip = n < 0;
        if (skip) return object;
        let key = envstr.slice(0,n);
        let value = envstr.slice(n+1);
        object[key] = value;
        return object;
    },{}) : {};
    let inherited_env = inherit_env ? Object.assign({}, process.env) : {};
    if ("env" in req.query ) { options.env = inherited_env; }
    Object.assign(inherited_env, env);
    let datched = "datched" in req.query ? options.datched = Boolean(req.query.datched) : "(UNDEFINED)";
    let cwd = "cwd" in req.query ? options.cwd = Boolean(req.query.cwd) : "(UNDEFINED)";
    let argv0 = "argv0" in req.query ? options.argv0 = Boolean(req.query.argv0) : "(UNDEFINED)";

    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.setHeader('transfer-encoding', 'chunked');
    result += "command: " + JSON.stringify(command) + "\n";
    result += "args: " + JSON.stringify(args) + "\n";
    result += "env: " + JSON.stringify(env) + "\n";
    result += "inherit_env: " + JSON.stringify(inherit_env) + "\n";
    result += "cwd: " + JSON.stringify(cwd) + "\n";
    result += "argv0: " + JSON.stringify(argv0) + "\n";
    result += "options: " + JSON.stringify(options) + "\n";

    let p = child_process.spawn(command, args);

    p.on("exit", function(code) {
        console.log("process exit");
        res.end();
    });
    p.on("error", function(code) {
        console.log("process error");
        res.end();
    });
    res.on("close", function(data) {
        console.log("response close");
        p.kill();
    });
    p.stdout.on("data", function(data) {
        res.write(data);
        // process.stdout.write(data);
    });
    p.stdout.on("end", function(){
        res.end();
    });
    p.stderr.on("data", function(data) {
        res.write(data);
        // process.stderr.write(data);
    });
    p.stderr.on("end", function(){
        res.end();
    });
});
