(function () {
'use strict';

var demo_controller = function (
    $sce,
    $state
) {
    var controller = this;
    // initial value
    controller.ueditorContent = 'ng-ueditor, current state: ' +
        $state.current.name;

    controller.updateHtml = function() {
        controller.ueditorHtml = $sce.trustAsHtml(controller.ueditorContent);
    };

    controller.ueditorConfig = {
        toolbars: [[
            'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'strikethrough', 'blockquote', '|',
            'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|',
            'paragraph', 'fontfamily', 'fontsize', '|', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
            'insertcode', 'background', '|','horizontal', 'date', 'time', '|',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow',
            'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright',
            'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            'preview', 'searchreplace'
        ]],
        enableContextMenu: false,
        enableAutoSave: false,
        lang: 'en'
    };

    controller.ready = function(editorInstance){
        console.debug(
            'UEditor ' +
            editorInstance.uid +
            ' ready!'
        );
    };
};

var state_config = function (
    $urlRouterProvider,
    $stateProvider
) {
    $urlRouterProvider.otherwise('/demo');

    $stateProvider
        .state(
            'demo',
            {
                url: '/demo',
                templateUrl: 'demo/view-index.html',
                controller: 'DemoController',
                controllerAs: 'Controller'
            }
        )
        .state(
            'route',
            {
                url: '/route',
                templateUrl: 'demo/view-route1.html',
                controller: 'RouteController',
                controllerAs: 'Controller'
            }
        )
    ;
};

angular.module(
    'ng.ueditor.example',
    [
        'ng.ueditor',
        'ui.router'
    ]
).controller(
    'DemoController',
    [
        '$sce',
        '$state',
        demo_controller
    ]
).controller(
    'RouteController',
    [
        '$sce',
        '$state',
        demo_controller
    ]
).config(
    [
        '$urlRouterProvider',
        '$stateProvider',
        state_config
    ]
)
;

}());


