(function (angular) {

    var Events = angular.module('Events');

    Events.controller('CreateEvent', function ($scope, $routeParams, EventsService) {
        var event;

        $scope.mode = 'Publish';

        // if the route has a event id open the view in edit mode.
        // fetch the event from the server
        // display it in the view
        if ($routeParams.id) {
            event = EventsService.resource.get({
                id : $routeParams.id
            }).$promise.then(function (data) {
                $scope.mode = 'Update';   // change the text of the button to 'Edit event'
                $scope.event = data;
            });
        } else {
            $scope.event = EventsService.new();
            event = new EventsService.resource($scope.event);
        }

        $scope.saveEvent = function () {

            if ($scope.event.id) {   // update is has id PUT
                EventsService.resource
                    .update({id : $scope.event.id}, $scope.event)
                    .$promise.then(function () {
                        $scope.event.body = '';
                        $scope.event.title = '';
                        $scope.mode = 'Publish';
                    });
            } else {    // save if it has not id POST
                angular.extend(event, $scope.event);
                event.$save(function () {
                    $scope.event.body = '';
                    $scope.event.title = '';
                });
            }
        };
    });

    Events.controller('AllEvents', function (EventsService) {
        EventsService.fetch();
    });
}(angular));