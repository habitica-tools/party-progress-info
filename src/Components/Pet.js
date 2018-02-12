import { h, render, Component } from 'preact';
import { observer } from 'mobx-preact';

@observer
class Pet extends Component {
    imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';

    render({pet}) {
        return (
            <div class="item-wrapper">
                <div class="item">
                <span class="badge badge-pill badge-item badge-count2">
                    {pet.needed}
                </span>
                <div class="badge badge-pill badge-item badge-info badge-count">
                    {pet.count}
                </div>  
                <span class={"item-content Pet Pet-" + pet.id}>
                    <img src={this.imageurl + "Pet-" + pet.id + ".png"} alt={pet.id}  />
                </span>
                </div>
                <span class="pettxt">{pet.id}</span>
            </div>
        );
    }  
    
}


export default Pet;