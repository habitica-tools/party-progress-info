import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import { observable, action, computed  } from 'mobx';
import GearInfo from './GearInfo';

@observer
class GearList extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  @observable showAll = false;
  @observable gearInfo = null;
  @observable sortKey = "2";
  @computed get gearWithCounts() {
    let gear = [...this.props.store.gear].map(function(gearinfo){
        let geardetail = gearinfo[1];
        //geardetail.count = [...this.props.store.gear].filter(([id,geari]) => geari.id === gearinfo[0]).reduce((prevVal,[id,geari]) => prevVal + geari.count , 0);
        return geardetail;
    },this).filter(geari => geari.count > 0);
    
    switch(this.sortKey){
        case "1":
        gear.sort(function(a,b){
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
        gear.sort(function(a,b){
            if(a.count > b.count){
                return -1;
            }
            if(a.count < b.count) {
                return 1;
            }
            return 0;
        })        
        break;
        case "3":
        gear.sort(function(a,b){
            if(a.id < b.id){
                return -1;
            }
            if(a.id > b.id) {
                return 1;
            }
            return 0;
        })        
        break;
        case "4":
        gear.sort(function(a,b){
            if(a.data.set < b.data.set){
                return -1;
            }
            if(a.data.set > b.data.set) {
                return 1;
            }
            return 0;
        })        
        break;        
        case "5":
        gear.sort(function(a,b){
            if(a.data.type < b.data.type){
                return -1;
            }
            if(a.data.type > b.data.type) {
                return 1;
            }
            return 0;
        })        
        break; 

        default:
        break;
    }

    return gear;
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
                <select class="ui dropdown" value={this.sortKey} onChange={this.sortGear}>
                    <option value="">Default</option>
                    <option value="1">Shortage</option>
                    <option value="2">Most</option>
                    <option value="3">A-Z</option>
                    <option value="4">Set</option>
                    <option value="5">Type</option>
                </select>   
            </div>                    
        </div>
            <div class="item-rows">
            <div class ="items">
            {[...this.gearWithCounts].map(gear => 
                    <div>
                    <div class="item-wrapper">
                        <div class="item">
                            <span class="badge badge-pill badge-item badge-info badge-count">
                            {gear.count}
                            </span>                          
                            <span class={gear.id === this.gearinfo ? "selectableInventory item-content Gear"  : "item-content Gear"} onClick={this.showGearInfo.bind(this, gear.id)}>
                                <img src={this.imageurl + "shop_" + gear.id + ".png"} alt={"shop_" + gear.id}  />
                            </span>
                        </div>                      
                    </div>
                    </div>
            )}
            </div>
        </div>
        </div>
        <div class="column">
            {this.gearInfo === null ? <br/> :
                <GearInfo category={this.gearInfo} store={store} gearlist={this} />
            }
        </div>
        </div>
        );
        }
    }

    @action setGearInfo(category){
        if(category === this.gearInfo){
            this.setGearInfo(null);
        }
        else{
            this.gearInfo = category;
        }
    }
    
    showGearInfo = (e) => {
        this.setGearInfo(e);
    }

    @action hideGearInfo()  {
        this.setGearInfo(null);
    }
    
    @action sortGear = (e) => {
        this.sortKey = e.target.value;
    }
  
};

export default GearList;  