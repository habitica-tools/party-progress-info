import { observable, computed, action } from 'mobx';

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

    @computed get damage(){
        if(!this.loading){
            if(this.data.party !== undefined){
                if(this.data.party.quest !== undefined){
                    if(this.data.party.quest.progress !== undefined){
                        return parseInt(this.data.party.quest.progress.up);
                    }
                }
            }
        }
    }

    @computed get totalPetCount(){
        let count = 0;
        if (!this.loading){
            [...this.store.pets].map(pet => pet[1])
            .filter(pet => pet.users.includes(this) ? pet : null)
            .forEach(function(pet){
                if(this.data.items.pets[pet.id] === -1){
                    count = count + 1;
                }
                else{
                    if(this.data.items.mounts === undefined){ //No Mounts at all
                        count = count;
                    }
                    else
                    {                
                        if(!this.data.items.mounts[pet.id]){
                            count = count + 1;
                        }
                        else{
                            count = count + 2;
                        }
                    }
                }
            },this)
        }
        return count;
    }

    @computed get totalGearCount(){
        let count = 0;
        if(!this.loading){
            [...this.store.gear].map(gear => gear[1])
            .filter(gear => gear.users.includes(this) ? gear : null)
            .forEach(function(gear){
                if(this.data.items.gear.owned[gear.id] !== undefined){
                    count = count + 1;
                }
            },this)
        }
        return count;
    }

    @action addUser(userid) {
        this.loading = true;
        window.fetch('https://habitica.com/api/v3/members/' + userid)
            .then(res => res.json())
            .then(action(json => {
                this.data = json.data;
                this.loading = false;
                //go over quests 
                if(json.data.items.quests !== undefined){
                    var quests = new Map(Object.entries(json.data.items.quests));
                    quests.forEach(function(value, key) {
                        if(value > 0)                   
                            this.store.quests.get(key).addUser(this);
                    }, this); 
                }
                //go over pets
                if(json.data.items.pets !== undefined){
                    var pets = new Map(Object.entries(json.data.items.pets));
                    pets.forEach(function(value, key) {
                        if(key !== null && key !== undefined)                   
                            var pet = this.store.pets.get(key);
                            if(pet !== undefined)
                                pet.addUser(this);
                    },this);   
                }
                //go over eggs
                if(json.data.items.eggs !== undefined){
                    var eggs = new Map(Object.entries(json.data.items.eggs));
                    eggs.forEach(function(value, key) {
                        if(key !== null && key !== undefined)                   
                            var egg = this.store.eggs.get(key);
                            if(egg !== undefined)
                                if(value > 0){
                                    egg.addUser(this);
                                }
                    },this);
                }
                //go over gear
                if(json.data.items.gear !== undefined){
                    var gear = new Map(Object.entries(json.data.items.gear.owned));
                    gear.forEach(function(value, key) {
                        if(key !== null && key !== undefined)                   
                            var gear = this.store.gear.get(key);
                            if(gear !== undefined)
                                if(value > 0){
                                    gear.addUser(this);
                                }
                    },this);                                                 
                }   
                //go over backgrounds
                /*
                if(json.data.items.backgrounds !== undefined){
                    var backgrounds = new Map(Object.entries(json.data.items.backgrounds.owned));
                    backgrounds.forEach(function(value, key) {
                        if(key !== null && key !== undefined)                   
                            var background = this.store.backgrounds.get(key);
                            if(background !== undefined)
                                if(value > 0){
                                    backgrounds.addUser(this);
                                }
                    },this);                                                 
                }        
                */         
            }));

        }
}

export default UserState;