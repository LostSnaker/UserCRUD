"use strict";

angular.module('userCtrl', [])

    .controller('UserCRUDCtrl', ['$scope','UserCRUDService',

    function ($scope,UserCRUDService) {
        $scope.displayMode = "table";
        $scope.currentUser = null;

        $scope.getAllUsers = function () {
            UserCRUDService.getAllUsers()
                .then(function (response) {
                    $scope.users = response.data;
                    $scope.message='';
                })
                .catch(function (response) {
                    $scope.message = response.data;
                });
        };

        $scope.getUser = function () {

            UserCRUDService.getUser($scope.user.id)
                .then(function (response) {
                        $scope.user = response.data;
                        $scope.message='';
                })
                .catch(function (response) {
                        $scope.message = response.data;
                });
        };

        $scope.addUser = function (user) {

            user._source.email = user._source.email.toLowerCase();

            UserCRUDService.addUser(user._source.name, user._source.surname,
                user._source.birthdayDate, user._source.phone, user._source.email)
                .then(function (response) {
                        $scope.message = response.data;
                })
                .catch(function (response) {
                        $scope.message = response.data;
                });

            $scope.displayMode = "table";


        };

        $scope.updateUser = function (tempUser) {
            UserCRUDService.updateUser(tempUser._id, tempUser._source.name, tempUser._source.surname,
                tempUser._source.birthdayDate, tempUser._source.phone, tempUser._source.email)
                .then(function (response) {
                        $scope.message = response.data;
                })
                .catch(function (response) {
                        $scope.message = response.data;
                });
            $scope.displayMode = "table";
        };

        $scope.editUser = function (user){
            $scope.tempUser = user;
            $scope.tempUser._source.birthdayDate = new Date($scope.tempUser._source.birthdayDate);
            $scope.displayMode = "edit";
        }

        $scope.deleteUser = function (userId) {
            UserCRUDService.deleteUser(userId)
                .then(function (response) {
                        $scope.message = response.data;
                })
                .catch(function (response) {
                        $scope.message = response.data;
                });
        };

        $scope.cancel = function() {
            $scope.displayMode = "table";
        }

        $scope.add = function() {
            $scope.displayMode = "add";
        }

        $scope.getAllUsers();

    }]);


