import { Component } from 'preact';
import { observer } from 'mobx-react';

function beautifyCaption(caption) {
  return caption.replace(/([A-Z])/g, ' $1').trim();
}

@observer
class Item extends Component {
  static imageURL = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images/';

  static type = null;
  static imageFilenameBase = null;
  static showItemCaption = true;

  // eslint-disable-next-line class-methods-use-this
  get imageFilenameExtension() {
    return '.png';
  }

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
          <span class={'item-content ' + this.constructor.type + ' ' + this.constructor.imageFilenameBase + item.imageKey} onClick={this.showItemInfo}>
            <img src={Item.imageURL + this.constructor.imageFilenameBase + item.imageKey + this.imageFilenameExtension} alt={item.key} />
          </span>
        </div>
        {this.constructor.showItemCaption &&
          <span>{beautifyCaption(item.key)}</span>
        }
      </div>
    );
  }

  showItemInfo = () => {
    this.props.itemList.showInfo(this.props.item);
  }
}

export default Item;
