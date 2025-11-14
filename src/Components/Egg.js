import { Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class Egg extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';

  render() {
    const id = this.props.id;
    const egg = this.props.egg;

    return (
      <div class="item-wrapper">
        <div class="item" data-tooltip={id}>
          <span class="badge badge-pill badge-item badge-info badge-count">
            {egg.count}
          </span>
          {egg.selectedcount >= 1 ?
            <span class="badge badge-pill badge-item badge-blue">
              {egg.selectedcount}
            </span>
            : ''
          }
          <span class={"item-content Egg Pet_Egg_" + id} onClick={this.showEggInfo}>
            <img src={this.imageurl + "Pet_Egg_" + id + ".png"} alt={id} />
          </span>
        </div>
        <span class="pettxt">{id}</span>
      </div>
    );
  }

  showEggInfo = () => {
    this.props.eggList.showInfo(this.props.id);
  }
}

export default Egg;