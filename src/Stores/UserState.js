import { observable, action } from 'mobx';

class UserState {
    @observable loading = true;
    data  = {};
    id = null;
    store = null;
    constructor(store, id) {
        this.store = store;
        this.id = id;
        this.addUser(id);
        //this.store.quests.get("atom1").addUser("atom1",2,"d3de6635-37f7-4369-99c3-399d036d0898");
    }

    @action addUser(userid) {
        this.loading = true;
        window.fetch('https://habitica.com/api/v3/members/' + userid)
            .then(res => res.json())
            .then(action(json => {
                this.data = json.data;
                this.loading = false;
                //go over quests 
                var quests = new Map(Object.entries(json.data.items.quests));
                quests.forEach(function(value, key) {
                    if(value > 0)                   
                        this.store.quests.get(key).addUser(this);
                }, this); 
                //go over pets
                var pets = new Map(Object.entries(json.data.items.pets));
                pets.forEach(function(value, key) {
                    if(key !== null && key !== undefined)                   
                        var pet = this.store.pets.get(key);
                        if(pet !== undefined)
                            pet.addUser(this);
                },this);                    
            }));

        }
}

export default UserState;