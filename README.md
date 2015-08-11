# ng-ueditor
This directive allows you to add a TinyMCE editor to your form elements.

## [Demo](http://astray-git.github.io/ng-ueditor)

## Requirements
- AngularJS
- [UEditor](http://ueditor.baidu.com/website/download.html)

## Install
```
bower install ng-ueditor --save
```

## usage
Load the script files:
```
<script type="text/javascript" src="app/bower_components/ueditor-bower/ueditor.config.js"></script>
<script type="text/javascript" src="app/bower_components/ueditor-bower/ueditor.all.min.js"></script>
<script type="text/javascript" src="app/bower_components/angular/angular.js"></script>
<script type="text/javascript" src="app/bower_components/ng-ueditor/dist/ng-ueditor.min.js"></script>
```

add ng-ueditor module as a depenency:
```
angular.module('myModule', ['ng.ueditor']);
```

use as a directive, you must provide a `ng-model` for view data biding, you can put specific id for multiple editor.
```
<textarea
    ng-ueditor="Controller.ueditorConfig"
    ready="Controller.ready"
    ng-model="Controller.ueditorContent"
></textarea>
```

### custom options
- `ng-ueditor` add custom config.
- `ready` (optional) add custom on ready callback.
- `all-html` (optional) normally result is get from [`UE.Editor.getContent`](http://ueditor.baidu.com/doc/#UE.Editor:getContent%28%29) use this attribute tell ueditor to return all html using [`UE.Editor.getAllHtml`](http://ueditor.baidu.com/doc/#UE.Editor:getAllHtml%28%29), result including some ueditor style blocks.

## Building
- `npm install`
- `bower install`
- `gulp` build source files
