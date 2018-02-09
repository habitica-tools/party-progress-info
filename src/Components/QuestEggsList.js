import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import { observable, action, computed  } from 'mobx';
import EggInfo from './EggInfo';

@observer
class QuestEggsList extends Component {
  @observable showAll = false;
  @observable eggInfo = null;
  @observable sortKey = "2";
  @computed get eggsWithCounts() {
    let eggs = [...this.props.store.eggs].map(function(egginfo){
        let eggdetail = {id:egginfo};
        eggdetail.count = [...this.props.store.eggs].filter(([id,egg]) => egg.id === egginfo[0]).reduce((prevVal,[id,egg]) => prevVal + egg.count , 0);
        return eggdetail;
    },this).filter(egg => egg.count > 0);
    
    switch(this.sortKey){
        case "1":
        eggs.sort(function(a,b){
            if(a.count < b.count){
                return -1;
            }
            if(a.count > b.count) {
                return 1;
            }
            return 0;
        })        
        break;
        case "2":
        eggs.sort(function(a,b){
            if(a.count > b.count){
                return -1;
            }
            if(a.count < b.count) {
                return 1;
            }
            return 0;
        })        
        break;
        /*
        case "3":
        eggs.sort(function(a,b){
            if(a.id < b.id){
                return -1;
            }
            if(a.id > b.id) {
                return 1;
            }
            return 0;
        })        
        break;
        */
        default:
        break;
    }

    return eggs;
  }


  render({store}, {petInfo}){


    if(store.loadingobjects){
        return(<div class="ui active centered inline loader"></div>);
    }
    else{
        return(
        <div class="ui fluid container">             
        <div class="column stable">
        <div class="ui stackable grid">
            <div class="twelve wide column">
                &nbsp;<br/><br/>
            </div>
            <div class="four wide column">
                <span class="dropdown-label">Sort By: </span>
                <select class="ui dropdown" value={this.sortKey} onChange={this.sortEggs}>
                    <option value="">Default</option>
                    <option value="1">Shortage</option>
                    <option value="2">Most</option>
                </select>   
            </div>                    
        </div>
            <div class="item-rows">
            <div class ="items">
            {[...this.eggsWithCounts].map(egg => 
                    <div>
                    <div class="item-wrapper">
                        <div class="item">
                            <span class="badge badge-pill badge-item badge-info badge-count">
                            {egg.count}
                            </span>                          
                            <span class={egg.id[0] === this.eggInfo ? "selectableInventory item-content Pet_Egg_" + egg.id[0] + "" : "item-content Pet_Egg_" + egg.id[0] + ""} onClick={this.showEggInfo.bind(this, egg.id[0])}>

                            </span>
                        </div>                      
                        <span class="pettxt">{egg.id[0]}</span>
                    </div>
                    </div>
            )}
            </div>
        </div>
        </div>
        <div class="column">
            {this.eggInfo === null ? <br/> :
                <EggInfo category={this.eggInfo} store={store} />
            }
        </div>
        </div>
        );
        }
    }

    @action setEggInfo(category){
        this.eggInfo = category;
    }
    
    showEggInfo = (e) => {
        this.setEggInfo(e);
    }
    
    @action sortEggs = (e) => {
        this.sortKey = e.target.value;
    }
  
};

export default QuestEggsList;  