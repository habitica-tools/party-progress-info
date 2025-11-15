import { Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class Egg extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';

  render() {
    const egg = this.props.egg;

    return (
      <div class="item-wrapper">
        <div class="item" data-tooltip={egg.id}>
          <span class="badge badge-pill badge-item badge-info badge-count">
            {egg.count}
          </span>
          {egg.selectedCount >= 1 ?
            <span class="badge badge-pill badge-item badge-blue">
              {egg.selectedCount}
            </span>
            : ''
          }
          <span class={"item-content Egg Pet_Egg_" + egg.id} onClick={this.showEggInfo}>
            <img src={this.imageurl + "Pet_Egg_" + egg.id + ".png"} alt={egg.id} />
          </span>
        </div>
        <span>{egg.id}</span>
      </div>
    );
  }

  showEggInfo = () => {
    this.props.eggList.showInfo(this.props.egg);
  }
}

export default Egg;