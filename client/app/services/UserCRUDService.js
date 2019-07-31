"use strict";


angular.module('userService', []).service('UserCRUDService', function($http) {

    var baseUrl = "http://localhost:3000/users/";

    this.getUser = function(userId) {
        return $http({
            method : 'GET',
            url : baseUrl + userId,
        });
    };

    this.addUser = function(name, surname, birthdayDate, phone, email) {
        return $http({
            method : 'POST',
            url : baseUrl,
            data : {
                name,
                surname,
                birthdayDate,
                phone,
                email,
                dateOfChange: (new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':')
            }
        });
    };

    this.updateUser = function(userId, name, surname, birthdayDate, phone, email) {
        return $http({
            method : 'PUT',
            url : baseUrl + userId,
            data : {
                userId,
                name,
                surname,
                birthdayDate,
                phone,
                email,
                dateOfChange: (new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':')
            }
        });
    };

    this.deleteUser = function(userId) {
        return $http({
            method : 'DELETE',
            url : baseUrl + userId
        });
    };

    this.getAllUsers = function() {
        return $http({
            method : 'GET',
            url : baseUrl
        });
    };
});