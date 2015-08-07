(function () {
'use strict';

var demo_controller = function (
    $sce
) {
    var controller = this;

    controller.updateHtml = function() {
        controller.ueditorHtml = $sce.trustAsHtml(controller.ueditor);
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
        initialContent: 'Angular UEditor'
    };

    controller.ready = function(editor){
        alert('UEditor ready!');
    };
};

angular.module('ng.ueditor').controller(
    'DemoController',
    [
        '$sce',
        demo_controller
    ]
);

}());


