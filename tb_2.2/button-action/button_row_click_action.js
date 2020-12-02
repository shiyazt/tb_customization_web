
var $injector = widgetContext.$scope.$injector;
var types = $injector.get('types'),
    $q = $injector.get('$q'),
    $mdDialog = $injector.get('$mdDialog'),
    $filter = $injector.get('$filter'),
    $document = $injector.get('$document');
    
var attributeService = $injector.get('attributeService');
var entityService = $injector.get('entityService');
var state = widgetContext.stateController.getStateParamsByStateId("device_state");
var entity = state.entityId;



//controller

function InfoDialogController($mdDialog) {
    let vm = this;
    vm.loading = true;
    vm.entityTitle = 'Update Details';
    let cal_ts = new Date();
    vm.cal_date = cal_ts.getDate();
    vm.cal_month = cal_ts.getMonth();
    vm.cal_year = cal_ts.getFullYear();
    
    vm.entityName = state.entityName;
    
    vm.cal_freq = 300;
    
    vm.close = () => {
        $mdDialog.cancel();   
    }
    
    console.log(state);
    
    let items = ['cal_freq','cal_prev']
    
    attributeService.getEntityAttributesValues(entity.entityType, entity.id, 'SERVER_SCOPE', items)
    .then(
        function success(item) {
            // console.log(item);
            vm.cal_freq = item.filter(item => item.key === 'cal_freq')[0].value;
            let calPrev = item.filter(item => item.key === 'cal_prev')[0].value;
            vm.cal_prev = new Date( calPrev * 1000).toLocaleString('en-US');
            
            let calNext = calPrev + (vm.cal_freq * 86400);
            
            vm.cal_next = new Date( calNext * 1000).toLocaleString('en-US');
            // vm.cal_freq = item[0].value;
            vm.loading = false;
        },
        function fail(msg) {
            console.log(msg);
            vm.loading = false;
        }
    );
    
    
    vm.saveAttribute = () => {
        vm.loading = true;
        
        let items = [
            {
                key : 'cal_freq',
                value : vm.cal_freq
            }, 
            {
                key : 'cal_prev',
                value : ((new Date(`${vm.cal_date}/${vm.cal_month}/${vm.cal_year}`)).getTime())/1000
            }
        ];
        
        attributeService.saveEntityAttributes(entity.entityType, entity.id, 'SERVER_SCOPE', items)
        .then(
            function success(item) {
                console.log(item);
                vm.loading = false;
            },
            function fail(msg) {
                console.log(msg);
                vm.loading = false;
            }
        );
    }
}

//template

var infoDialogTemplate =    '<md-dialog style="width: 500px;" aria-label="Info">' +
                                '<md-toolbar>'+
                                    '<div class="md-toolbar-tools">'+ 
                                        '<h2>{{vm.entityTitle}}</h2>'+
                                        '<span flex></span>'+
                                        '<md-button class="md-icon-button" ng-click="vm.close()">'+
                                            '<ng-md-icon icon="close" aria-label="Close"></ng-md-icon>'+
                                        '</md-button>'+
                                    '</div>' +
                                '</md-toolbar>'+
                                '<md-progress-linear class="md-warn" md-mode="indeterminate" ng-disabled="!vm.loading" ng-show="vm.loading"></md-progress-linear>'+
                                '<span style="min-height: 10px;" ></span>'+
                                '<md-dialog-content style="padding:5px;" >'+
                                    '<div style="border: 2px solid #ffc107; border-radius : 10px; margin : 10px 5px 15px 5px; backround-color: #ffecb3; padding: 5px;">' +
                                        '<div style="font-weight: 500; margin: 10px auto 10px auto;">Previous Calibration done on {{vm.cal_prev}}</div>' +
                                        '<div style="font-weight: 500; margin: 10px auto 10px auto;color : red; ">Next Calibration due on {{vm.cal_next}}</div>' +
                                    '</div>' +
                                    
                                    '<div style="text-decoration : underline; margin : 10px auto 0px auto;">Calibaration done on</div>'+
                                    '<div layout="row" layout-align="center" flex>' +
                                    
                                        '<md-input-container flex="20">' +
                                            '<label>Date</label>' +
                                            '<input ng-model="vm.cal_date" type="Number">' +
                                        '</md-input-container>'+
                                        
                                        '<md-input-container flex="20">' +
                                            '<label>Month</label>' +
                                            '<input type="Number" ng-model="vm.cal_month">' +
                                        '</md-input-container>'+
                                        
                                        '<md-input-container flex="20">' +
                                            '<label>Year</label>' +
                                            '<input type="Number" ng-model="vm.cal_year">' +
                                        '</md-input-container>'+
                                    
                                    '</div>' +
                                    
                                    '<div style="text-decoration : underline; margin : 10px auto 0px auto;">Calibration Frequency</div>' + 
                                    '<div layout="row" layout-align="center" flex>' +
                                        '<md-input-container flex="50">' +
                                            '<label>Frequency</label>' +
                                            '<input type="Number" ng-model="vm.cal_freq">' +
                                            '<div>Frequency in days</div>' +
                                        '</md-input-container>'+
                                    '</div>'+
                                    
                                '</md-dialog-content>'+
                                
                                '<md-dialog-actions>' +
                                    '<md-button ng-click="vm.saveAttribute()">Save</md-button>' +
                                    '<md-button color="secondary" ng-click="vm.close()">Cancel</md-button>' +
                                '</md-dialog-actions>'+
                                
                            '</md-dialog>';
                            
                            
showInfoDialog();

function showInfoDialog() {
    $mdDialog.show({
      controller: ['$mdDialog', InfoDialogController],
      controllerAs: 'vm',
      template: infoDialogTemplate,
      parent: angular.element($document[0].body),
      targetEvent: $event,
      clickOutsideToClose: false,
      fullscreen: true
    });
}



