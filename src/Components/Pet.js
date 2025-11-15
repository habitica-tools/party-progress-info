import { Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class Pet extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';

  render() {
    const pet = this.props.pet;

    return (
      <div class="item-wrapper">
        <div class="item">
          <span class="badge badge-pill badge-item badge-count2">
            {pet.petsNeeded}
          </span>
          <div class="badge badge-pill badge-item badge-info badge-count">
            {pet.petCount}
          </div>
          <span class={'item-content Pet Pet-' + pet.id}>
            <img src={this.imageurl + 'Pet-' + pet.id + '.png'} alt={pet.id} />
          </span>
        </div>
        <span class="pettxt">{pet.id}</span>
      </div>
    );
  }

}


export default Pet;