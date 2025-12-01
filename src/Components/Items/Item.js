import { Component } from 'preact';
import { observer } from 'mobx-react';

@observer
class Item extends Component {
  static imageURL = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';
  static imageFilenameBase = null;
  static showItemCaption = true;

  render() {
    const { item } = this.props;

    return (
      <div class="item-wrapper">
        <div class="item" data-tooltip={item.tooltip}>
          <span class="badge badge-pill badge-item badge-info badge-count">
            {item.count}
          </span>
          {item.selectedCount < 1 ? '' : (
            <span class="badge badge-pill badge-item badge-blue">
              {item.selectedCount}
            </span>
          )}
          <span class={'item-content ' + item.constructor.type + ' ' + this.constructor.imageFilenameBase + item.id} onClick={this.showItemInfo}>
            <img src={Item.imageURL + this.constructor.imageFilenameBase + item.id + '.png'} alt={item.id} />
          </span>
        </div>
        {this.constructor.showItemCaption &&
          <span>{item.tooltip}</span>
        }
      </div>
    );
  }

  showItemInfo = () => {
    this.props.itemList.showInfo(this.props.item);
  }
}

export default Item;
