"use strict";

angular.module('userCtrl', [])

    .controller('UserCRUDCtrl', ['$scope','UserCRUDService', '$timeout',

    function ($scope,UserCRUDService,$timeout) {
        $scope.displayMode = "table";
        $scope.currentUser = null;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.numOfPages = 1;
        $scope.pages = [];


        $scope.getAllUsers = function () {
            UserCRUDService.getAllUsers()
                .then(function (response) {
                    $scope.users = response.data;
                    $scope.message='';
                    $scope.totalItems = $scope.users.length;
                })
                .catch(function (response) {
                    $scope.message = response.data;
                });

        };

        $scope.getAllUsers();

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
                        $scope.message = response.data.message;
                        user._id = response.data.id;
                        $scope.users.push(user);
                        $scope.currentUser = null;
                })
                .catch(function (response) {
                        $scope.message = response.data;
                        $scope.currentUser = user;
                });

            $scope.displayMode = "table";
        };

        $scope.updateUser = function (tempUser) {
            UserCRUDService.updateUser(tempUser._id, tempUser._source.name, tempUser._source.surname,
                tempUser._source.birthdayDate, tempUser._source.phone, tempUser._source.email)
                .then(function (response) {
                        $scope.message = response.data;
                        $scope.users.some(function(entry, i) {
                            if (entry._id === tempUser._id) {
                                $scope.index = i;
                                angular.forEach(Object.keys(tempUser._source), function (key) {
                                    $scope.users[$scope.index]._source[key] = tempUser._source[key];
                                });
                                return true;
                            }
                        });
                })
                .catch(function (response) {
                        $scope.message = response.data;
                });
            $scope.displayMode = "table";
        };

        $scope.updateOrCreateUser = function(user){

            if(user._id !== undefined){
                $scope.updateUser(user);
            }
            else{
                $scope.addUser(user);
            }
        };

        $scope.editUser = function (user){
            $scope.currentUser = angular.copy(user);
            $scope.currentUser._source.birthdayDate = new Date($scope.currentUser._source.birthdayDate);
            $scope.displayMode = "add";
        };

        $scope.deleteUser = function (userId) {
            UserCRUDService.deleteUser(userId)
                .then(function (response) {
                    $scope.message = response.data;
                    $scope.users = $scope.users.filter(function (user) {
                        return user._id != userId;
                    })
                })
                .catch(function (response) {
                    $scope.message = response.data;
                });
        };

        $scope.cancel = function() {
            $scope.displayMode = "table";
        };

        $scope.add = function() {
            $scope.displayMode = "add";
        };

        $scope.changePage = function(page) {
            if(page === 0){
                $scope.currentPage = $scope.numOfPages;
            }
            else if(page > $scope.numOfPages){
                $scope.currentPage = 1;
            }
            else $scope.currentPage = page;
        };

        $scope.$watch('currentPage + users', function() {

            let begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                end = begin + $scope.itemsPerPage;

            if($scope.users != undefined) {
                $scope.filteredUsers = $scope.users.slice(begin, end);
            $scope.numOfPages = Math.ceil($scope.users.length/$scope.itemsPerPage);
            }
        });

        $scope.$watch('numOfPages', function () {
            if($scope.currentPage > $scope.numOfPages && $scope.currentPage !== 1) $scope.currentPage -= 1;
            $scope.pages = [];
            for(let i = 0; i < $scope.numOfPages; i++){
                $scope.pages.push(i+1);
            }

        })


    }]);


