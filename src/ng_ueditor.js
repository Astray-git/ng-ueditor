(function () {
'use strict';

var ng_ueditor_directive = function (
    $window,
    $log,
    $sce
) {
    var generatedId = 0;
    var ID_PREFIX = 'ng-ueditor';

    var link = function (
        scope,
        element,
        attrs,
        ctrls
    ) {
        if ($window.UE === undefined) {
            $log.warn('Can not load ueditor.');
            return;
        }
        var editorInstance;
        var editorReady = false;
        var ngModel = ctrls[0];
        var customOptions = scope.$eval(attrs.ngUeditor);
        var customReady = scope.$eval(attrs.ready);

        // generate an ID
        var currentId = ID_PREFIX + '-' + generatedId++;
        attrs.$set('id', currentId);

        /**
         * update ngModel view
         * @method update_view
         */
        var update_view = function (editor) {
            var content = editor.getAllHtml().trim();
            content = $sce.trustAsHtml(content);

            ngModel.$setViewValue(content);
            scope.$applyAsync();
        };

        ngModel.$formatters.unshift(function(modelValue) {
            return modelValue ? $sce.trustAsHtml(modelValue) : '';
        });

        ngModel.$parsers.unshift(function(viewValue) {
            return viewValue ? $sce.getTrustedHtml(viewValue) : '';
        });

        ngModel.$render = function() {
            var viewValue = ngModel.$viewValue ?
                $sce.getTrustedHtml(ngModel.$viewValue) : '';

            // instance.getDoc() check is a guard against null value
            // when destruction & recreation of instances happen
            if (editorInstance !== undefined &&
                editorReady === true
            ) {
                editorInstance.setContent(viewValue);
                // Triggering change event due to TinyMCE not firing event &
                // becoming out of sync for change callbacks
                //editorInstance.fireEvent("selectionchange");
            }
        };

        // initialize editor
        editorInstance = UE.getEditor(
            currentId,
            customOptions
        );

        /**
         * callback when edit ready
         * @method ready_callback
         */
        var ready_callback = function () {
            editorReady = true;
            editorInstance.addListener(
                'ready',
                function () {
                    ngModel.$render();
                    ngModel.$setPristine();
                }
            );
            editorInstance.addListener(
                'afterExecCommand',
                function () {
                    update_view(editorInstance);
                }
            );
            editorInstance.addListener(
                'contentChange',
                function () {
                    update_view(editorInstance);
                }
            );

            if (angular.isFunction(customReady)) {
                customReady(editorInstance);
            }
        };

        editorInstance.ready(
            ready_callback
        );

        scope.$on('$destroy', function() {
            if (editorInstance !== undefined) {
                UE.delEditor(currentId);
                editorInstance = undefined;
            }
        });
    };

    return {
        restrict: 'A',
        require: ['ngModel'],
        link: link
    };
};

angular.module('ng.ueditor', [])
    .directive(
        'ngUeditor',
        [
            '$window',
            '$log',
            '$sce',
            ng_ueditor_directive
        ]
    )
;

}());
