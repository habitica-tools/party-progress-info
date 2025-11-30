import { action, computed, observable } from 'mobx';

class PetState {
  id = null;
  store = null;
  @observable accessor users = [];
  @observable accessor usersWithPet = [];
  @observable accessor usersWithMount = [];

  constructor(questpet, store) {
    this.id = questpet;
    this.store = store;
  }

  @computed get basetype() {
    if (this.id !== null) {
      return this.id.slice(0, this.id.indexOf('-'));
    }
    else {
      return '';
    }
  }

  @computed get potiontype() {
    if (this.id !== null) {
      return this.id.slice(this.id.indexOf('-') + 1);
    }
    else {
      return '';
    }
  }

  @computed get needed() {
    let count = 0;
    count = this.store.countValidUsers() * 2;
    this.users.forEach(function (value, index, array) {
      if (value.data.items.pets !== undefined && value.data.items.pets[this.id] > 0) {
        count = count - 1;
      }
      if (value.data.items.mounts !== undefined && value.data.items.mounts[this.id] > 0) {
        count = count - 1;
      }
    }, this);
    return count;
  }

  @computed get petsNeeded() {
    let count = 0;
    count = this.store.countValidUsers();
    this.users.forEach(function (value, index, array) {
      if (value.data.items.pets !== undefined && value.data.items.pets[this.id] > 0) {
        count = count - 1;
      }
    }, this);
    return count;
  }

  @computed get mountsNeeded() {
    let count = 0;
    count = this.store.countValidUsers();
    this.users.forEach(function (value, index, array) {
      if (value.data.items.mounts !== undefined && value.data.items.mounts[this.id] > 0) {
        count = count - 1;
      }
    }, this);
    return count;
  }

  @computed get count() {
    let count = 0;
    this.users.forEach(function (value, index, array) {
      if (value.data.items.pets !== undefined && value.data.items.pets[this.id] > 0) {
        count = count + 1;
      }
      if (value.data.items.mounts !== undefined && value.data.items.mounts[this.id] > 0) {
        count = count + 1;
      }
    }, this);
    return count;
  }

  @computed get petCount() {
    let count = 0;
    this.users.forEach(function (value, index, array) {
      if (value.data.items.pets !== undefined && value.data.items.pets[this.id] > 0) {
        count = count + 1;
      }
    }, this);
    return count;
  }

  @computed get mountCount() {
    let count = 0;
    this.users.forEach(function (value, index, array) {
      if (value.data.items.mounts !== undefined && value.data.items.mounts[this.id] > 0) {
        count = count + 1;
      }
    }, this);
    return count;
  }

  //get usercount

  //get selectedcount
  @computed get selectedcount() {
    let count = 0;

    this.users.filter(user => user.isInfoUser).forEach(function (value, index, array) {
      if (value.data.items.pets !== undefined && value.data.items.pets[this.id] > 0) {
        count = count + 1;
      }
      if (value.data.items.mounts !== undefined && value.data.items.mounts[this.id] > 0) {
        count = count + 1;
      }
    }, this)

    return count;
  }

  @action addUser(user) {
    this.users.push(user);
  }

  @action removeUser(user) {
    try {
      this.users.remove(user);
    }
    catch (e) { }
  }

  @action addUserWithPet(user) {
    this.usersWithPet.push(user);
  }

  @action removeUserWithPet(user) {
    try {
      this.usersWithPet.remove(user);
    }
    catch (e) { }
  }

  @action addUserWithMount(user) {
    this.usersWithMount.push(user);
  }

  @action removeUserWithMount(user) {
    try {
      this.usersWithMount.remove(user);
    }
    catch (e) { }
  }

}

export default PetState;