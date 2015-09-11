/* global UE */
(function () {
'use strict';

var ng_ueditor_directive = function (
    $window,
    $log,
    $sce,
    $rootScope
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
        // attributes options
        var customOptions = scope.$eval(attrs.ngUeditor) || {};
        var customReady = scope.$eval(attrs.ready);
        var allHtml = attrs.allHtml !== undefined;

        // use existing id or generate an ID
        var currentId;
        if (attrs.id !== undefined) {
            currentId = attrs.id;
        } else {
            currentId = ID_PREFIX + '-' + generatedId++;
            attrs.$set('id', currentId);
        }

        /**
         * update ngModel view
         * @method update_view
         * @param {String} content updated content
         * @private
         */
        var update_view = function (content) {
            ngModel.$setViewValue(content);
            $rootScope.$applyAsync();
        };

        /**
         * update ngModel view with editor content
         * @method update_view
         * @private
         */
        var update_view_with_content = function (editor) {
            var content = editor.getContent().trim();
            update_view(content);
        };

        /**
         * update ngModel view with full html page
         * @method update_view_with_all_html
         * @private
         */
        var update_view_with_all_html = function (editor) {
            var content = editor.getAllHtml().trim();
            update_view(content);
        };

        ngModel.$formatters.unshift(function(viewValue) {
            return viewValue ? $sce.trustAsHtml(viewValue) : '';
        });

        ngModel.$render = function() {
            var viewValue = $sce.getTrustedHtml(ngModel.$viewValue || '');


            if (editorInstance !== undefined &&
                editorReady === true
            ) {
                editorInstance.setContent(viewValue);
                // trigger contentChange event for initial ngModel render,
                // due to TinyMCE not firing event
                editorInstance.fireEvent('contentChange');
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

            var update_callback = allHtml === true ?
                update_view_with_all_html.bind(
                    undefined,
                    editorInstance
                ) :
                update_view_with_content.bind(
                    undefined,
                    editorInstance
                )
            ;

            // set up listeners
            editorInstance.addListener(
                'afterExecCommand',
                update_callback
            );
            editorInstance.addListener(
                'contentChange',
                update_callback
            );

            // temporary fix enableAutoSave option in ueditor 1.4.3
            // covered language: zh-cn and en
            // https://github.com/fex-team/ueditor/issues/1421
            if (customOptions.enableAutoSave === false) {
                editorInstance.addListener(
                    'showmessage',
                    function(type, m){
                        if (
                            m.content === '本地保存成功' ||
                            m.content === 'Local conservation success'
                        ) {
                            return true;
                        }
                    }
                );
            }

            // call optional custom ready callback
            if (angular.isFunction(customReady)) {
                customReady(
                    editorInstance,
                    scope,
                    element,
                    attrs,
                    ngModel
                );
            }

            // trigger initial ngModel render
            ngModel.$render();
            ngModel.$setPristine();
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
            '$rootScope',
            ng_ueditor_directive
        ]
    )
;

}());
