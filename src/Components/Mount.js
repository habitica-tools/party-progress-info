import { Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class Mount extends Component {
  imageurl = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';

  render() {
    const mount = this.props.mount;

    return (
      <div class="item-wrapper">
        <div class="item">
          <span class="badge badge-pill badge-item badge-count2">
            {mount.mountsNeeded}
          </span>
          <div class="badge badge-pill badge-item badge-info badge-count">
            {mount.mountCount}
          </div>
          <span class={"item-content Mount Mount_Icon_" + mount.id}>
            <img src={this.imageurl + "Mount_Body_" + mount.id + ".png"} alt={mount.id} />
            <img src={this.imageurl + "Mount_Head_" + mount.id + ".png"} alt={mount.id} />
          </span>
        </div>
        <span class="pettxt">{mount.id}</span>
      </div>
    );
  }

}


export default Mount;