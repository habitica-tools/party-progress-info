import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';
import { observable, action, computed  } from 'mobx';
import BackgroundInfo from './BackgroundInfo';

@observer
class BackgroundList extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  @observable showAll = false;
  @observable BackgroundInfo = null;
  @observable sortKey = "";
  @computed get BackgroundWithCounts() {
    let Background = [...this.props.store.backgrounds].map(function(Backgroundinfo){
        let Backgrounddetail = Backgroundinfo[1];
        //Backgrounddetail.count = [...this.props.store.Background].filter(([id,Backgroundi]) => Backgroundi.id === Backgroundinfo[0]).reduce((prevVal,[id,Backgroundi]) => prevVal + Backgroundi.count , 0);
        return Backgrounddetail;
    },this)//.filter(Backgroundi => Backgroundi.count > 0);

    switch(this.sortKey){
        case "1":
        Background.sort(function(a,b){
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
        Background.sort(function(a,b){
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
        Background.sort(function(a,b){
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
        Background.sort(function(a,b){
            if(a.data.set < b.data.set){
                return -1;
            }
            if(a.data.set > b.data.set) {
                return 1;
            }
            return 0;
        })
        break;
        default:
        break;
    }

    return Background;
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
                <select class="ui dropdown" value={this.sortKey} onChange={this.sortBackground}>
                    <option value="">Default</option>
                    <option value="1">Shortage</option>
                    <option value="2">Most</option>
                    <option value="3">A-Z</option>
                    <option value="4">Set</option>
                </select>
            </div>
        </div>
            <div class="item-rows">
            <div class ="items backgrounds">
            {[...this.BackgroundWithCounts].map(Background =>
                    <div>
                    <div class="item-wrapper">
                        <div class="item">
                            <span class="badge badge-pill badge-item badge-info badge-count">
                            {Background.count}
                            </span>
                            <span class={Background.id === this.Backgroundinfo ? "selectableInventory item-content Background"  : "item-content Background"} onClick={this.showBackgroundInfo.bind(this, Background.id)}>
                                <img src={this.imageurl + "background_" + Background.id + ".png"} alt={"shop_" + Background.id}  />
                            </span>
                        </div>
                    </div>
                    </div>
            )}
            </div>
        </div>
        </div>
        <div class="column">
            {this.BackgroundInfo === null ? <br/> :
                <BackgroundInfo category={this.BackgroundInfo} store={store} Backgroundlist={this} />
            }
        </div>
        </div>
        );
        }
    }

    @action setBackgroundInfo(category){
        if(category === this.BackgroundInfo){
            this.setBackgroundInfo(null);
        }
        else{
            this.BackgroundInfo = category;
        }
    }

    showBackgroundInfo = (e) => {
        this.setBackgroundInfo(e);
    }

    @action hideBackgroundInfo()  {
        this.setBackgroundInfo(null);
    }

    @action sortBackground = (e) => {
        this.sortKey = e.target.value;
    }

};

export default BackgroundList;