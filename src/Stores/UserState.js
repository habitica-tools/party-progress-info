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
        var me = this;
        window.fetch('https://habitica.com/api/v3/members/' + userid)
            .then(res => res.json())
            .then(action(json => {
                this.data = json.data;
                
                //go over quests 
                var quests = new Map(Object.entries(json.data.items.quests));
                quests.forEach(function(value, key) {
                    if(value > 0)                   
                        me.store.quests.get(key).addUser(key, parseInt(value), userid);
                });

                this.loading = false;  
                
                console.log(this.data);            
            }));

        }
}

export default UserState;