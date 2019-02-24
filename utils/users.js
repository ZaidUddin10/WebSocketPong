const _ = require('lodash');

class Users {

    constructor () {
        this.users = [];
    }

    addUser (id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser (id) {
        var to_return = _.remove(this.users, {id});
        return to_return[0];
    }

    getUser (id) {
        return _.find(this.users, {id});
    }

    getUserList (room) {
        var users = _.filter(this.users, {room});
        return users.map((user) => user.name);
    }

    getRoomList () {
        var seen = {}, distinct_arr = [], i, length = this.users.length;
        for(i = 0; i < length; i++) {
            var currRoom = this.users[i].room;
            if (seen[currRoom]) continue;
            seen[currRoom] = true;
            distinct_arr.push(currRoom);
        }
        return distinct_arr;
    }
}

module.exports = {Users};